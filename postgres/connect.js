const { Pool } = require('pg')


const host = 'ec2-3-227-231-159.compute-1.amazonaws.com'
const config = {
  database: 'sdc',
  host,
  user: 'postgres',
  port: 6432,
  max: 30, //max number of clients per server
}

const connectMsg = `Connected to POSTGRES via PGBOUNCER succsesfully`
const pool = new Pool(config)
console.log(connectMsg)

module.exports = { pool }


// app.get('loaderIO suff here', (req, res) => {
//   res.send('loaderIO stuff here');
// });