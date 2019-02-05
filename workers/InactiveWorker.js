// Daily Worker to Update the Agents Status */
const _ = require('lodash')
const Aigle = require('aigle')
const mongoose = require('mongoose')
const cron = require('node-cron')
const axios = require('axios')
// const onSpace = require('./onspaceFn')
const keys = require('../config/keys')
Aigle.mixin(_)

// Model Schema
let Agent
let Event
let Counter

const getAgentStatus = async batch => {
  // Iterate over Agent Batch
  for (let i = 0; i < batch.length; i++) {
    // Extract the Variables
    let { _id, license_number, brokerageId } = batch[i]
    let status = 'inactive'

    // Make the Call to NY API
    try {
      let { data } = await axios.get(`${keys.inactivity_endpoint}'${license_number}'`)

      // Check data returned
      if (data.length === 0) {
        // Means Inactive Agent
        await Agent.findOneAndUpdate({ _id }, { status })

        // Update the Directory on WordPress
        // await onSpace.updateAgent(license_number, {
        //   fields: {
        //     hide_from_algolia: true,
        //     status
        //   }
        // })

        // Create an Event where log that Agent got Inactive
        let inactiveEvent = new Event({
          business_from: brokerageId,
          business_to: null,
          license_number,
          date: Date.now(),
          activity: 'Inactive Agent'
        })

        // Save the Inactive Event
        await inactiveEvent.save()
      }
    } catch (e) {
      console.log(`⚠️ ==> ${e.message}`)
    }
  }
}

const DailyCheck = async () => {
  let counter = await Counter.findOne({ name: 'inactiveWorker' })

  // Find the Counter for this County
  if (!counter) {
    counter = new Counter({ name: 'inactiveWorker', offset: 0 })
    await counter.save()
  }

  try {
    // Search on DB
    let batchAgent = await Agent.find({ status: 'active' }, '_id license_number brokerageId')
      .skip(counter.offset)
      .limit(keys.batchAmount)

    // Check if data is null
    if (batchAgent.length > 0) {
      console.log(`==> 🚀 Starting Inactivity Worker`)
      // Make the Batch Request
      await getAgentStatus(batchAgent)
      console.log(`==> ✅ Finished Inactivity Worker`)

      // Save keys.batchAmount for next time
      counter.offset += keys.batchAmount
      await counter.save()
    } else {
      // Init Counter Again
      counter.offset = 0

      // and save the Counter
      await counter.save()
    }
  } catch (e) {
    console.log(`⚠️ ==> ${e.message}`)
  }
}

const _init = async () => {
  // Assign the Models to this variables
  Agent = mongoose.model('agent')
  Event = mongoose.model('event')
  Counter = mongoose.model('counter')

  // Schedule Work Every 24 hours
  cron.schedule(keys.schedule, DailyCheck, { scheduled: true, timezone: 'America/Chicago' })
}

module.exports = {
  async init() {
    await _init()
  }
}
