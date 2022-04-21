const Models = require('./models');
const {
  Photos,
  Metas,
  Reviews,
} = Models


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

module.exports = { find }