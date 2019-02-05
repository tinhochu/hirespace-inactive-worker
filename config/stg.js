module.exports = {
  // mongoURI: 'mongodb://' + process.env.MONGO_HOST + ':' + process.env.MONGO_PORT + '/' + process.env.MONGO_DB,
  mongoURI: 'mongodb://hirespace:space123@ds121382.mlab.com:21382/stg_hirespace',
  data_endpoint:
    "https://data.ny.gov/resource/yg7h-zjbf.json?$$app_token=bYWDc07XZhLQVXkqPoqQzLbLK&$where=license_type!='REAL ESTATE PRINCIPAL OFFICE' AND license_type!='REAL ESTATE BRANCH OFFICE' AND ",
  inactivity_endpoint: 'https://data.ny.gov/resource/yg7h-zjbf.json?$$app_token=bYWDc07XZhLQVXkqPoqQzLbLK&$where=license_number==',
  schedule: '*/5 * * * *',
  counties: ['KINGS', 'NEW YORK', 'QUEENS', 'BRONX', 'RICHMOND'],
  batchAmount: 10,
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
      county: 'BROOKLYN'
    },
    {
      name: 'BRONX',
      county: 'BRONX'
    }
  ],
  WP_Endpoint: 'http://space.test/wp-json',
  WP_Admin: 'admin',
  WP_Password: 'zsc$jf$H%e%yZ22o!9ieL#bi',
}
