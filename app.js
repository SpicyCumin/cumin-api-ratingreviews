"use strict";

const Koa = require('koa');
const path = require("path");
const compress = require('koa-compress');
const logger = require('koa-pino-logger')



const app = new Koa();
app.silent = true // disable console.errors
// app.use(logger())
app.use(compress({
  filter (content_type) {
  	return /text/i.test(content_type)
  },
  threshold: 2048,
  gzip: {
    flush: require('zlib').constants.Z_SYNC_FLUSH
  },
  deflate: {
    flush: require('zlib').constants.Z_SYNC_FLUSH,
  },
  br: false
}))



const db = require('./db/index.js')
console.log('app.js db keys: ', Object.keys(db))

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

// db.reviews.find({product_id: 317311})

app.use(async (ctx, next) => {
  ctx.state.start = Date.now()
  // ctx.log.info('API start')
  // console.log(ctx.log)
  const { request, response } = ctx

  const requests = ctx.path.split(/\//g).filter(str => !!str.length)
  const { product_id } = ctx.query
  console.log(`\n\nproduct_id: ${product_id} requests: ${requests}`)
  // ctx.log.info(`\n\nproduct_id: ${product_id} requests: ${requests}\n\n`)
  // ctx.state.data = await fakeDb[ctx.method][requests[0]](product_id)
  ctx.state.data = await db[ctx.method][requests[0]]({ product_id })

  next()

})

app.use(async (ctx, next) => {
  console.log('ctx.state.data', ctx.state.data)
  if(ctx.state.data) {
    ctx.body = JSON.stringify(ctx.state.data)
    ctx.status = 200
  }
  else {
    ctx.body = JSON.stringify({ error: true })
    console.log('error no data')
  }

})


const PORT = process.env.PORT || 3000;
// app.listen(PORT);
console.log(`Listening at http://localhost:${PORT}`);





// let numRequests = 0;

// const getTime = (seconds) => {
//   var hours = Math.floor(seconds / 3600)
//   seconds = seconds % 3600
//   var minutes = Math.floor(seconds / 60)
//   seconds = seconds % 60
//   return hours ? `${hours} hours, ${minutes} minutes, and ${seconds} seconds` : `${minutes} minutes and ${seconds} seconds`

// }

// if (requestLogs) {
//   console.log('requestLogs: ', requestLogs)
//   const logInterval = 10000//ms
//   let upTime = 0;
//   setInterval(() =>{
//     upTime += logInterval
//     var seconds = Math.round(upTime/1000)
//     const time = getTime(seconds)
//     var reqPerSec = ( numRequests / seconds )
//     reqPerSec = +reqPerSec.toFixed(2);
//     console.log(`\nSTATUS update:\n  number of requests: ${numRequests}\n  uptime: ${time} \n  requests/second: ${reqPerSec}`)
//   }, logInterval)
// }
