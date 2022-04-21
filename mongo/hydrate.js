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

const loopLog = 10000
const bulkWriteAt = 5000;

async function hydrate() {
  console.log('running hydrate')
  const reviewGen = reviewGenStream(reviewCSV)
  const metaGen = genManyStream(metaCSV)
  const photoGen = genManyStream(photoCSV)
  console.log('reviewGen', reviewGen)
  console.log('metaGen', metaGen)
  console.log('photoGen', photoGen)

  let review = await reviewGen.next()
  let meta = await metaGen.next()
  let photos = await photoGen.next()
  let mem = process.memoryUsage()
  let newPhotos;
  let newReviews = [];

  let reviewsCreated = 0
  let metasCreated = 0
  let loops = 0;


  while (!review.done) {


    if (review.value.id === photos.value[0].review_id) {
      review.value.photos = photos.value ? photos.value : [];
      this.create.many.photos(photos.value)
      photos = await photoGen.next()
    }
    if (review.value.id === meta.value[0].review_id) {
      review.value.meta = meta.value ? [meta.value] : [];
      this.create.metas(meta.value)
      meta = await metaGen.next()
    }
    !review.done && newReviews.push(review.value)
    if (newReviews.length === bulkWriteAt || review.done) {
      await this.create.many.reviews(newReviews)
      reviewsCreated += newReviews.length
      newReviews = []
    }

    review = await reviewGen.next()

    if ( !(loops % logAt)) {
      console.log(`\n\nReviewsCreated ${reviewsCreated}  metasCreated ${metasCreated}`)
      console.log(`Done? review ${review.done} meta ${meta.done} photos ${photos.done}`)
    }
    loops++
  }
  await this.create.many.reviews(newReviews)

  console.log('\n ---DONE---- ')
  return true
}





function checkForHydration () {
  console.log('Checking DB for data MONGO')
  this.hydrate()
  // return db.find({}).then(dbRes => {
  //   console.log('Db already hydrated setting up the search')
  // })
}

module.exports = { hydrate, checkForHydration }




