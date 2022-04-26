
// var dbToLoad = process.env.DB
var DBToLoad = 'PG'
var DB;
if (DBToLoad === 'PG') {
  DB = require('../postgres/index')
  DBToLoad = "PG"
}
else {
  DB = require('../mongo/index')
  DBToLoad = "MONGO"
}
console.log(`CURRENT DB = ${DBToLoad}`)


// const toHydrate = JSON.parse(process.env.HYDRATE) || false
// console.log(`TO HYDRATE DB = ${toHydrate}`)
// if (toHydrate) {
//   DB.checkForHydration()
// }

module.exports = DB

