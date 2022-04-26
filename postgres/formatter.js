



const format = (rawData, fields, extend = false) => {
  // const formated = extend ? {...rawData} : {}
  const values = fields.map(key => rawData[key])
  return { values, fields }
}






const reviewKeys = [
  'product_id',
  'rating',
  'date',
  'summary',
  'body',
  'recommend',
  'reported',
  'reviewer_name',
  'reviewer_email',
  'response',
  'helpfulness',
]
const formatReview = (rawData, extend = false) => {
  return format(rawData, reviewKeys, extend)
}





const photoKeys = [
  'review_id',
  'url',
]
const formatPhoto = (rawData, extend = false) => {
  return format(rawData, photoKeys, extend)
}





const characteristicKeys = [
  'product_id',
  'name',
]
const formatCharacteristic = (rawData, extend = false) => {
  return format(rawData, characteristicKeys, extend)
}






const metaKeys = [
  'characteristic_id',
  'review_id',
  'value',
]
const formatMeta = (rawData, extend = false) => {
  return format(rawData, metaKeys, extend)
}


format.metas = formatMeta
format.characteristics = formatCharacteristic
format.photos = formatPhoto
format.reviews = formatReview

module.exports = { format }