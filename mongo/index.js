"use strict";


//sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 3000

const { Reviews, Metas } = require('./models');
const create = require('./create')
const { find } = require('./find')
const { checkForHydration, hydrate } = require('./hydrate')



const db = {
  GET: find,
  POST: create,
  create,
  Reviews,
  Metas,
  checkForHydration,
  hydrate
}

db.hydrate.bind(db)
db.checkForHydration.bind(db)

module.exports = db
// /var/lib/mongo
// /var/log/mongodb
// sudo systemctl start mongod
// sudo systemctl status mongod
// sudo systemctl restart mongod
// mongosh

