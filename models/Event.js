const mongoose = require('mongoose')
const { Schema } = mongoose

const EventSchema = new Schema({
  date: Date,
  license_number: String,
  activity: String,
  business_from: { type: Schema.Types.ObjectId, ref: 'brokerage' },
  business_to: { type: Schema.Types.ObjectId, ref: 'brokerage' }
})

mongoose.model('event', EventSchema)
