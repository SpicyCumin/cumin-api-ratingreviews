
const { format } = require('./formatter')
const { query } = require('./query')


// UPDATE [table] SET [fields] WHERE [condition];
var table; // table to operate on
var fields; // array of which columns to update
var condition; //array of conditions



// const { table, condition, fields, values } = params
const PUT = async (params, fields = ['*']) => {
  return await query(params, 'UPDATE', fields)
}


const buildCondition = (table, tableId) => {
  return `${table}.id = ${tableId}`
}

const buildFieldsAndValues = (newData) => {
  return Object.keys(newData).reduce((memo, key, ind) => {
    memo.fields += ` ${key} = $${ind + 1} `
    memo.values.push(newData[key])
  }, {fields:'', values: []})
}

const putReview = async (newData, review_id) => {
  if(newData) {
    table = 'reviews'
    condition = buildCondition(table, review_id)
    const { values, fields } = buildFieldsAndValues(newData, table)
    return await PUT({ table, condition, fields, values })
  }
  return null
}

const putMeta = async (newData, meta_id) => {
  if(newData) {
    table = 'metas'
    condition = buildCondition(table, meta_id)
    const { values, fields } = buildFieldsAndValues(newData, table)
    return await PUT({ table, condition, fields, values })
  }
  return null
}


const putPhoto = async (newData, photo_id) => {
  if(newData) {
    table = 'photos'
    condition = buildCondition(table, photo_id)
    const { values, fields } = buildFieldsAndValues(newData, table)
    return await PUT({ table, condition, fields, values })
  }
  return null
}

const putCharacteristic = async (newData, characteristic_id) => {
  if(newData) {
    table = 'characteristics'
    condition = buildCondition(table, characteristic_id)
    const { values, fields } = buildFieldsAndValues(newData, table)
    return await PUT({ table, condition, fields, values })
  }
  return null
}

PUT.characteristics = putCharacteristic
PUT.reviews = putReview
PUT.photos = putPhoto
PUT.metas = putMeta

module.exports = { PUT }