module.exports = {
  mongoURI: 'mongodb://localhost:27017/hirespace',
  data_endpoint:
    "https://data.ny.gov/resource/yg7h-zjbf.json?$$app_token=bYWDc07XZhLQVXkqPoqQzLbLK&$where=license_type!='REAL ESTATE PRINCIPAL OFFICE' AND license_type!='REAL ESTATE BRANCH OFFICE' AND ",
  inactivity_endpoint: 'https://data.ny.gov/resource/yg7h-zjbf.json?$$app_token=bYWDc07XZhLQVXkqPoqQzLbLK&$where=license_number==',
  schedule: '* * * * * *',
  counties: ['KINGS', 'NEW YORK', 'QUEENS', 'BRONX', 'RICHMOND'],
  batchAmount: 1,
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
  ],
  WP_Endpoint: 'http://space.test/wp-json',
  WP_Admin: 'admin',
  WP_Password: 'zsc$jf$H%e%yZ22o!9ieL#bi',
}
