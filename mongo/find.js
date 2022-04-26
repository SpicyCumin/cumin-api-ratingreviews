const Models = require('./models');
const {
  Photos,
  Metas,
  Reviews,
} = Models


const find = (queries = {}, modelName = 'Reviews') => {
  if (Array.isArray(queries)) {
    return Models[modelName].find(queries)
    .then(res => {
      // console.log(res)
      return res && res[0] ? res.reviews : []
    })
    .catch(err => console.log('Error finding in db ', err, 'input: ', queries[0]))
  }
  return Models[modelName].findOne(queries)
    .then(res => {
      // console.log(res)
      return res ? res.reviews : []
    })
    .catch(err => console.log('Error finding in db ', err, 'input: ', queries))
}


find.metas = (queries => find(queries, 'Metas'))
find.reviews = (queries => find(queries))
find.product = (queries => find({ id: queries}, 'Products'))



module.exports = { find }

