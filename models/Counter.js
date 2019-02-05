const mongoose = require('mongoose')
const { Schema } = mongoose

const counterSchema = new Schema({
  county: String,
  name: String,
  offset: Number,
  limit: Number,
  lastRun: Date
})

mongoose.model('counter', counterSchema)
