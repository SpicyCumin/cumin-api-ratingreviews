"use strict";

const Koa = require('koa');
// const cors = require('cors');
const path = require("path");
// const compression = require('compression');

const PORT = process.env.PORT || 3000;
const ORIGIN = process.env.CORS_ORIGIN || `http://localhost:${PORT}`
console.log('CORS_ORIGIN', ORIGIN)
const corsOptions = {
  origin: ORIGIN,
  optionsSuccessStatus: 200
}

const app = new Koa();
// app.use(compression())
// app.use(cors(corsOptions))




// const api = require('./api/index.js');
const db = require('./db/index.js')

const requestLogs = false
let numRequests = 0;

const getTime = (seconds) => {
  var hours = Math.floor(seconds / 3600)
  seconds = seconds % 3600
  var minutes = Math.floor(seconds / 60)
  seconds = seconds % 60
  return hours ? `${hours} hours, ${minutes} minutes, and ${seconds} seconds` : `${minutes} minutes and ${seconds} seconds`

}

if (requestLogs) {
  console.log('requestLogs: ', requestLogs)
  const logInterval = 10000//ms
  let upTime = 0;
  setInterval(() =>{
    upTime += logInterval
    var seconds = Math.round(upTime/1000)
    const time = getTime(seconds)
    var reqPerSec = ( numRequests / seconds )
    reqPerSec = +reqPerSec.toFixed(2);
    console.log(`\nSTATUS update:\n  number of requests: ${numRequests}\n  uptime: ${time} \n  requests/second: ${reqPerSec}`)
  }, logInterval)
}

const fakeMeta = {
  characteristics:{
    fake:'yup'
  }
}

const fakeReviews = [
{
  reviewer_name: 'tim',
  summary: 'its nice',
  body: 'this be fake',
},
{
  reviewer_name: 'Not also tim',
  summary: 'its not nice',
  body: 'this be not fake',
}
]
const fakeDb = {
  GET: {
    meta: ((productId) => new Promise((res, rej) => res(fakeMeta))),
    reviews: ((productId) => new Promise((res, rej) => res(fakeReviews)))
  }
}



app.use(async (ctx, next) => {
  ctx.state.start = Date.now()
// if (requestLogs) {
//     numRequests++
//     console.log('\nGET DATA req:  params', ctx.req.query)
//   }
  const { request, response } = ctx

  const requests = ctx.path.split(/\//g).filter(str => !!str.length)
  const { product_id } = ctx.query
  ctx.state.data = await fakeDb[ctx.method][requests[0]](product_id)
  next()

})

app.use(async (ctx, next) => {

  if(ctx.state.data) {
    ctx.body = JSON.stringify(ctx.state.data)
    ctx.status = 200
  }
  else {
    ctx.body = JSON.stringify({ error: true })
    console.log('error no data')
  }
  // console.log('sent')
  // console.log(`finished in ${Date.now() - ctx.state.start}ms`)
})



// app.listen(PORT);
console.log(`Listening at http://localhost:${PORT}`);



