if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod')
} else if (process.env.NODE_ENV === 'staging') {
  module.exports = require('./stg')
} else if (process.env.NODE_ENV === 'development') {
  module.exports = require('./dev')
} else {
  module.exports = require('./local')
}
