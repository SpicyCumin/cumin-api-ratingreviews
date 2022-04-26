"use strict";


const { Reviews, Metas, Products } = require('./models');
const create = require('./create')
const { find } = require('./find')
const { checkForHydration, hydrate } = require('./hydrate')



const db = {
  GET: find,
  POST: create,
  create,
  find,
  Reviews,
  Metas,
  Products,
  checkForHydration,
  hydrate
}

db.hydrate.bind(db)
db.checkForHydration.bind(db)

module.exports = db


// db.Products.createIndex( { id: "hashed" } )
//  db.Products.dropIndex('id_hashed')