"use strict";


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


