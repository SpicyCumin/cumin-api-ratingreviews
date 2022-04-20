"use strict";

const mongoose = require("mongoose");
const { Schema } = mongoose;
mongoose.connect('mongodb://localhost/sdc_dev')

//sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 3000
const create = require('./create')
const { checkForHydration, hydrate } = require('./hydrate')
const Models = require('./models');
const { Reviews, Metas } = Models






const find = (queries = {}, modelName = 'Reviews') => {
  if (Array.isArray(queries)) {
    return Models[modelName].find(queries)
    .catch(err => console.log('Error finding in db ', err, 'input: ', queries[0]))
  }
  return Models[modelName].find(queries)
    .catch(err => console.log('Error finding in db ', err, 'input: ', queries))
}

find.meta = (newMeta => create(newMeta, 'Metas'))
find.review = (newReview => create(newReview))



const db = { find, create, Reviews, Metas, checkForHydration, hydrate }

db.hydrate.bind(db)
db.checkForHydration.bind(db)

module.exports = db

