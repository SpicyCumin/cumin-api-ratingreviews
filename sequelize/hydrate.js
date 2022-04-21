"use strict";

const fs = require('fs');
const { pipeline } = require('stream');
const csv = require('csv-parser')
const path = require('path')


const csvDir = process.env.CSV_DIR
console.log('csvDir', csvDir)
const reviewCSV = path.join(csvDir, "/reviews.csv")
const metaCSV = path.join(csvDir, "/metas.csv")
const photoCSV = path.join(csvDir, "/photos.csv")



function makeGenStream(streamFile) {
  const stream = fs.createReadStream(streamFile).pipe(csv())
  .on('error', function(err) {
      console.log('review err ', err.stack);
  })
  .on('end', function(err) {
    console.log(`\n\n ----Stream from ${streamFile} ended----\n\n`);
  })
  .on('close', function(err) {
    console.log(`\n\n ----Stream ${streamFile} closed----\n\n`);
  })
  return stream
}



async function* reviewGenStream(streamFile) {
  const stream = makeGenStream(streamFile)
  for await (let chunk of stream) {
    yield chunk
  }
}

async function* genManyStream(streamFile) {
  const stream = makeGenStream(streamFile)
  let items = []
  let review_id;

  for await (let chunk of stream) {
    chunk.review_id = chunk.review_id ? chunk.review_id : review_id
    review_id = review_id ? review_id : chunk.review_id
    if (chunk.review_id === review_id) {
      items.push(chunk)
    }
    else {

      yield items
      items = [chunk]
      review_id = chunk.review_id
    }
  }
}

const loopLog = 5000
const bulkWriteAt = 1000;

async function hydrate() {
  this.sequelize.options.logging = false
  console.log('Turned off auto db insert logging')
  console.log('running hydrate')
  const reviewGen = reviewGenStream(reviewCSV)
  const metaGen = genManyStream(metaCSV)
  const photoGen = genManyStream(photoCSV)
  console.log('reviewGen', reviewGen)
  console.log('metaGen', metaGen)
  console.log('photoGen', photoGen)


  let meta = await metaGen.next()
  let review = await reviewGen.next()
  let photos = await photoGen.next()
  let mem = process.memoryUsage()
  let loops = 0
  let createdReviews = 0
  let createdPhotos = 0
  let createdMetas = 0

  let newReviews = [];

  while (!review.done) {


    if (review.value.id.toString() === photos.value[0].review_id.toString()) {

      await this.create.many.photos(photos.value)
      createdPhotos += photos.value.length
      photos = await photoGen.next()
    }
    if (review.value.id.toString() === meta.value[0].review_id.toString()) {
      console.log('\n\nmatched meta ', meta.value)

      review.value.meta_id = meta.value.id
      await this.create.metas(meta.value)
      createdMetas++
      meta = await metaGen.next()
    }

    // !review.done && newReviews.push(review.value)
    // if (newReviews.length === bulkWriteAt || review.done) {
    //   await this.create.many.reviews(newReviews)
    //   createdReviews += newReviews.length
    //   newReviews = []
    // }
    await this.create.reviews(review.value)
    createdReviews++
    review = !review.done ?  await reviewGen.next() : review



    if ( !(loops % loopLog)) {
      console.log(`\n\nloopped ${loops} times`)
      console.log(`createdReviews ${createdReviews}  createdPhotos ${createdPhotos}  createdMetas ${createdMetas}`)
      console.log(`Done? review ${review.done} meta ${meta.done} photos ${photos.done}`)
      // mem = process.memoryUsage()
      // console.log(`Mem use \nrss:${mem.rss} \nheapMax: ${mem.heapTotal} heapUsed:${mem.heapUsed}  \narrayBuffers:${mem.arrayBuffers}`)
    }
    loops++
  }
  console.log('\n ---DONE---- ')
  this.sequelize.options.logging = true
  console.log('Turned on auto db insert logging')
  return true
}





async function checkForHydration() {
  console.log('Starting DB sync')
  // await this.sequelize.authenticate()
  await this.sequelize.sync({ force: true })
  console.log('DB synced')
  console.log('Checking DB for data sequelize')
  this.hydrate()
}

module.exports = { hydrate, checkForHydration }

//  node --max_old_space_size=400 app.js
//   clinic heapprofiler -- node --max_old_space_size=400 app.js
//  clinic doctor -- node --max_old_space_size=400 app.js


// newReviews = []
// newPhotos = []
// reviews.value.forEach(review => {

//   review.meta_id = newMeta._id
//   newReviews.push(review)


// })

// photos.value.forEach(photo => {

//   photo.review_id = review.review_id
//   newPhotos.push(photo)

// })
// await this.create.many.reviews(newReviews)
// await this.create.many.photos(newPhotos)
// createdReviews += newReviews.length
// createdPhotos += newPhotos.length
