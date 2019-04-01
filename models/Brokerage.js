const mongoose = require('mongoose')
const { Schema } = mongoose

const BrokerageSchema = new Schema({
  business_address_1: String,
  business_address_2: String,
  business_city: String,
  business_name: String,
  business_state: String,
  business_zip: String,
  county: String,
  status: {
    type: String,
    default: 'hidden'
  }
})

mongoose.model('brokerage', BrokerageSchema)
