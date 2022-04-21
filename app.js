"use strict";

const Koa = require('koa');
const path = require("path");
const compress = require('koa-compress');
const logger = require('koa-pino-logger')



const app = new Koa();
app.use(logger())
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
  ctx.log.info('API start')
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
