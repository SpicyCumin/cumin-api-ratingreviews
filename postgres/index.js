const { GET }  = require('./get')
const { POST } = require('./post')
const { PUT } = require('./put')


const DB = {
  GET,
  POST,
  PUT,
}
// DB.GET.bind(DB)
DB.POST.bind(DB)
DB.PUT.bind(DB)

module.exports = { DB }



