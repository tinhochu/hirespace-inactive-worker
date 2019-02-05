const _ = require('lodash')
const WPAPI = require('wpapi')
const mongoose = require('mongoose')
const axios = require('axios')
const voca = require('voca')
const moment = require('moment-timezone')
const keys = require('../config/keys')

// Setup WordPress Credentials
const wp = new WPAPI({
  endpoint: keys.WP_Endpoint,
  username: keys.WP_Admin,
  password: keys.WP_Password,
  auth: true
})

// Register Route
wp.agents = wp.registerRoute('wp/v2', 'agents/(?P<id>)')

// Cast to titleCase
const titleCase = word => voca.titleCase(voca.lowerCase(word))

// Check License against the WordPress Directory
const CheckLicense = async license => {
  try {
    let { data } = await axios.get(`${keys.WP_Endpoint}/wp/v2/checklicense?license_number=${license}`)
    return data
  } catch (e) {
    console.log(e)
  }
}

const getTimeStamp = () => moment.tz(Date.now(), 'America/Chicago').format('MMMM Do YYYY, h:mm:ss a')

/**
 * Cast the Fields to be titleCase Too
 * @param update
 * @returns {*}
 */
const standarize = update => {
  let fields = update['fields']

  Object.keys(fields).forEach(key => {
    if (key === 'business_name' || key === 'business_address_2nd_line' || key === 'business_address') {
      update['fields'][key] = titleCase(update['fields'][key])
    }
  })

  return update
}

/**
 * Create Agent
 * @param agent
 * @param business_name
 * @returns {Promise<void>}
 */
const createAgent = async (agent, business_name) => {
  let data = await CheckLicense(agent.license_number)

  // Bail if this License Already Exists
  if (!_.isEmpty(data)) return

  // Standardize the Variables
  let name = titleCase(agent.license_holder_name)
  business_name = titleCase(agent.business_name)
  let business_address = titleCase(agent.business_address_1)
  let business_address_2nd_line = titleCase(agent.business_address_2)
  let business_city = titleCase(agent.business_city)
  let license_type = titleCase(agent.license_type)
  let licensed_as = titleCase(agent.license_holder_name)

  // Create new Agent Given the Data
  wp.agents()
    .create({
      title: name,
      fields: {
        hide_from_algolia: false,
        agent_first_name: name,
        agent_last_name: name,
        full_name: name,
        business_name,
        business_page_title: business_name,
        business_address,
        business_address_2nd_line,
        business_city,
        business_state: agent.business_state,
        business_zipcode: agent.business_zip,
        license_expire: agent.license_expiration_date,
        license_number: agent.license_number,
        license_type,
        licensed_as,
        status: 'active'
      }
    })
    .then(async ({ id }) => id)
    .catch(e => {
      console.log(e)
      return e
    })
}

const updateAgent = async (license_number, update) => {
  let data = await CheckLicense(license_number)

  // Bail if not license here
  if (_.isEmpty(data)) return

  wp.agents()
    .id(data.agent_id)
    .update(standarize(update))
    .then(id => id)
    .catch(e => e)
}

/**
 * Check Brokerage to create or return it
 * @param agent
 * @param isCounty
 * @param countyGiven
 * @returns {Promise<*>}
 */
const checkBrokerage = async (agent, isCounty, countyGiven = null) => {
  // DB Model
  let Brokerage = mongoose.model('brokerage')

  // Get Important Data
  let {
    business_address_1,
    business_address_2,
    business_city,
    business_name,
    business_state,
    business_zip,
    county
  } = agent

  // Find a Brokerage with this Name
  let brokerage = await Brokerage.findOne({ business_name })

  // Check if Exists
  if (!_.isEmpty(brokerage)) return brokerage

  // Create New Brokerage
  brokerage = new Brokerage({
    business_address_1,
    business_address_2,
    business_city,
    business_name,
    business_state,
    business_zip,
    county: isCounty ? county : countyGiven
  })

  // And Save it
  return await brokerage.save()
}

/**
 * Verify Agent, Brokerage and what to do with it
 * @param agent
 * @param isCounty
 * @param countyGiven
 * @returns {Promise<void>}
 */
const verifyAgent = async (agentGiven, isCounty, countyGiven = null) => {
  // DB Model
  let Agent = mongoose.model('agent')
  let Event = mongoose.model('event')

  // Get Brokerage
  let {
    _id: brokerageId,
    business_address_1,
    business_address_2,
    business_city,
    business_name,
    business_state,
    business_zip,
    county
  } = await checkBrokerage(agentGiven, isCounty, countyGiven)

  // Get Some Agent Data from Agent Given
  let { license_expiration_date, license_holder_name, license_number, license_type } = agentGiven

  // Check License Number
  let agent = await Agent.findOne({ license_number })

  // If no Agent is found, create One
  if (_.isEmpty(agent)) {
    // Create a New Agent
    agent = new Agent({
      brokerageId,
      license_expiration_date,
      license_holder_name,
      license_number,
      license_type,
      business_address_1,
      business_address_2,
      business_city,
      business_name,
      business_state,
      business_zip,
      county: isCounty ? county : countyGiven,
      status: 'active'
    })

    // Create an Event that handles te new Agent added.
    let eventNewLicense = new Event({
      date: Date.now(),
      license_number,
      activity: 'New Agent',
      business_to: brokerageId
    })

    // Record added Agent
    await eventNewLicense.save()

    // Save the Agent
    await agent.save()

    // Create Agent of WordPress
    await createAgent(agent)

    // Return Agent
    return agent
  } else {
    // the Agent is already on the DB
    if (agent.brokerageId.toString() !== brokerageId.toString()) {
      // Create a Switch Brokerage Event
      let eventSwitchBrokerage = new Event({
        date: Date.now(),
        license_number,
        activity: 'Switch Brokerage',
        business_from: agent.brokerageId,
        business_to: brokerageId
      })

      // and save it!
      await eventSwitchBrokerage.save()

      // Update on WP
      await updateAgent(agent.license_number, {
        fields: {
          business_name,
          business_page_title: business_name,
          business_address: business_address_1,
          business_address_2nd_line: business_address_2,
          business_city,
          business_state,
          business_zipcode: business_zip,
          county: isCounty ? county : countyGiven
        }
      })

      // Change of Brokerage
      agent.brokerageId = brokerageId
      agent.business_address_1 = business_address_1
      agent.business_address_2 = business_address_2
      agent.business_city = business_city
      agent.business_name = business_name
      agent.business_state = business_state
      agent.business_zip = business_zip
      agent.county = isCounty ? county : countyGiven
    }

    // Active Regardless
    agent.status = 'active'

    // save the Agent again!
    await agent.save()

    // Update Status on Algolia
    await updateAgent(agent.license_number, {
      fields: {
        hide_from_algolia: false,
        status: 'active'
      }
    })
  }

  // Return Agent
  return agent
}

// Exported Functions Containing Functions
const onspaceFn = {
  /**
   * Create an Agent on WordPress Every time that we have a new Agent
   * @param agent
   * @param business_name
   */
  createAgent: createAgent,

  /**
   * Update Agent that are in WordPress
   * @param license_number
   * @param update
   * @returns {Promise<void>}
   */
  updateAgent: updateAgent,

  /**
   * Verify Agent in Order to make the decision of what to do with it
   */
  verifyAgent: verifyAgent,

  /**
   * Get Time Stamp
   */
  getTimeStamp: getTimeStamp
}

module.exports = onspaceFn
