module.exports = {
  mongoURI: 'mongodb://' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_DB,
  // mongoURI: 'mongodb://hirespace:space123@ds119345.mlab.com:19345/hirespace',
  data_endpoint:
    "https://data.ny.gov/resource/yg7h-zjbf.json?$$app_token=bYWDc07XZhLQVXkqPoqQzLbLK&$where=license_type!='REAL ESTATE PRINCIPAL OFFICE' AND license_type!='REAL ESTATE BRANCH OFFICE' AND ",
  inactivity_endpoint:
    'https://data.ny.gov/resource/yg7h-zjbf.json?$$app_token=bYWDc07XZhLQVXkqPoqQzLbLK&$where=license_number==',
  schedule: '*/15 * * * * *',
  batchAmount: 1,
  WP_Endpoint: 'http://space.test/wp-json',
  WP_Admin: process.env.WP_API_USER,
  WP_Password: process.env.WP_API_PASS,
  counties: [
    {
      name: 'KINGS',
      county: 'KINGS'
    },
    {
      name: 'NEW YORK',
      county: 'NEW YORK'
    },
    {
      name: 'QUEENS',
      county: 'QUEENS'
    },
    {
      name: 'BRONX',
      county: 'BRONX'
    },
    {
      name: 'RICHMOND',
      county: 'RICHMOND'
    }
  ],
  cities: [
    {
      name: 'STATEN ISLAND',
      county: 'RICHMOND'
    },
    {
      name: 'NEW YORK',
      county: 'NEW YORK'
    },
    {
      name: 'BROOKLYN',
      county: 'KINGS'
    },
    {
      name: 'BRONX',
      county: 'BRONX'
    }
  ]
}
