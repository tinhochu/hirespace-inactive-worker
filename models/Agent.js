const mongoose = require('mongoose')
const { Schema } = mongoose

const agentSchema = new Schema({
  brokerageId: { type: Schema.Types.ObjectId, ref: 'brokerage' },
  license_expiration_date: Date,
  license_holder_name: String,
  license_number: String,
  license_type: String,
  status: String,
  date_update: Date,
  business_address_1: String,
  business_address_2: String,
  business_city: String,
  business_name: String,
  business_state: String,
  business_zip: String,
  county: String
})

mongoose.model('agent', agentSchema)