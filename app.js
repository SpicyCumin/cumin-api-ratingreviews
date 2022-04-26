"use strict";

const Koa = require('koa');
const path = require("path");
const compress = require('koa-compress');
const logger = require('koa-pino-logger')



const app = new Koa();
// app.silent = true // disable console.errors
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


const { DB } = require('./db/index.js')


app.use(async (ctx, next) => {
  try {
    const requestPath = ctx.path.split(/\//g).filter(str => !!str.length)
    const action = ctx.method
    if (requestPath.length) {
      ctx.state.data = await DB[action][requestPath[0]](ctx.query)
    }
    next()
  } catch (err) {
    console.log('REQUEST ERROR ', ctx.method, ctx.path)
    console.log(err)
    ctx.status = 500;
    ctx.body = { error: true }
  }
})

app.use(async (ctx, next) => {
  try {
    if(ctx.state.data) {
      ctx.status = 200
      ctx.body = ctx.state.data
    }
    else {
      ctx.status = 404
    }
  } catch (err) {
    console.log('SEND ERROR ', ctx.method, ctx.path, ctx.state.data)
    ctx.status = 500;
    ctx.body = { error: true }
  }
})


if (!process.env.CLUSTER) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT);
  console.log(`\n\n\n\n\n~~~~~~~~~~~~~Listening at http://localhost:${PORT}~~~~~~~~~~~~~\n\n\n\n\n`);
}

module.exports = app






// console.log(`All DB keys: ${Object.keys(DB)}`)

// const logTime = 20000
// let queries = 0
// let totalTime = 0

// setInterval(() => {
//   totalTime += logTime
//   console.log(`Total queries ${[queries]} over a time of ${totalTime} ms for pid: ${process.pid}`)
//   console.log(`PRODUCT data fetched with an average time of ${[(queries / totalTime)]} ms\n`)
// }, logTime)



  // console.log(`\n\nREQUEST action: ${action}`)
  // console.log(`Action DB keys: ${Object.keys(DB[action])}`)
  // console.log(`ACTION path: ${requestPath}`)
