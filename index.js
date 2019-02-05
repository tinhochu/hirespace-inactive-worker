const mongoose = require('mongoose')
const keys = require('./config/keys')
const inactiveWorker = require('./workers/InactiveWorker')

// Models Database
require('./models')

// Start Connection with the Database
mongoose
  .connect(
    keys.mongoURI,
    { useCreateIndex: true, useNewUrlParser: true, useFindAndModify: false }
  )
  .then(() => {
    // Init Workers
    console.log('🚀 ==> Init Workers')
    inactiveWorker.init()
  })
  .catch(e => {
    console.log('MongoError:', e.message)
  })
