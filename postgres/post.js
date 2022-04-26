const { format } = require('./formatter')
const { query } = require('./query')



var table;
var condition; // optional and currently unused



// INSERT INTO [table] ([fields]) VALUES ([values]) WHERE [condition];

const POST = async (params, fields = ['*']) => {

  return await query(params, 'INSERT', fields)

}


const getFormatted = (rawData, tableName) => {
  return format[tableName](rawData)
}

const postReview = async (rawData) => {
  if(rawData) {
    table = 'reviews'
    const { values, fields } = getFormatted(rawData, table)
    return await POST({ table, values, fields })
  }
  return null
}

const postMeta = async (rawData) => {
  if(rawData) {
    table = 'metas'
    const { values, fields } = getFormatted(rawData, table)
    return await POST({ table, values, fields })
  }
  return null
}


const postPhoto = async (rawData) => {
  if(rawData) {
    table = 'photos'
    const { values, fields } = getFormatted(rawData, table)
    return await POST({ table, values, fields })
  }
  return null
}

const postCharacteristic = async (rawData) => {
  if(rawData) {
    table = 'characteristics'
    const { values, fields } = getFormatted(rawData, table)
    return await POST({ table, values, fields })
  }
  return null
}


POST.characteristics = postCharacteristic
POST.reviews = postReview
POST.photos = postPhoto
POST.metas = postMeta


module.exports = { POST }