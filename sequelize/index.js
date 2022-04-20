"use strict";

const create = require('./create')
const { Reviews, Metas, Photos }  = require('./models/index');
const { checkForHydration, hydrate } = require('./hydrate')








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
