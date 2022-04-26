const { Pool } = require('pg')

// PGB
const config = {
  database: 'sdc',
  user: 'ian',
  port: 6432,
  max: 30, //max number of clients per server
}

const connectMsg = `Connected to POSTGRES via PGBOUNCER succsesfully`
const pool = new Pool(config)
console.log(connectMsg)

module.exports = { pool }