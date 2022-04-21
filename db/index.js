
//sudo iptables -t nat -I PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 3000
// const db = require('../mongo/index')
const db = require('../sequelize/index')


db.checkForHydration()

module.exports = db

