
var dbToLoad = process.env.DB
var db;
if (dbToLoad === 'MYSQL') {
  db = require('../sequelize/index')
}
else {
  db = require('../mongo/index')
  dbToLoad = "MONGO"
}
console.log(`CURRENT DB = ${dbToLoad}`)


const toHydrate = JSON.parse(process.env.HYDRATE) || false
console.log(`TO HYDRATE DB = ${toHydrate}`)
if (toHydrate) {
  db.checkForHydration()
}

module.exports = db

