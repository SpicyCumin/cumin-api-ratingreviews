"use strict";

const fs = require('fs');
const csv = require('csv-parser')
const path = require('path')

const csvDir = '/Users/ian/Downloads'
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
    // stream.destroy()
  })
  .on('close', function(err) {
    console.log(`\n\n ----Stream ${streamFile} closed----\n\n`);
  })
  return stream
}

async function* genStream(streamFile) {
  const stream = makeGenStream(streamFile)

  for await (let chunk of stream) {
    yield chunk
  }
}

async function* photoGenStream(streamFile) {
  const stream = makeGenStream(streamFile)
  let photos = []
  let id;

  for await (let chunk of stream) {

    id = !id && chunk.id
    if (chunk.id === id) {
      photos.push(chunk)
    }
    else {
      // console.log('new photos', photos)
      yield photos
      photos = [chunk]
      id = chunk.id
    }
  }
}

const bulkWriteAt = 5000
const logAt = 25000

async function hydrate() {
  console.log('running hydrate')
  const reviewGen = genStream(reviewCSV)
  const metaGen = genStream(metaCSV)
  const photoGen = photoGenStream(photoCSV)
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
      review.value.photos = photos.value;
      photos = !photos.done ?  await photoGen.next() : photos
    }
    if (review.value.id === meta.value.review_id) {
      review.value.meta = meta.value;
      meta = !meta.done ?  await metaGen.next() : meta
    }
    !review.done && newReviews.push(review.value)
    if (newReviews.length === bulkWriteAt || review.done) {
      await this.create.many.reviews(newReviews)
      reviewsCreated += newReviews.length
      newReviews = []
    }

    review = !review.done ?  await reviewGen.next() : review

    if ( !(loops % logAt)) {
      console.log(`\n\nReviewsCreated ${reviewsCreated}  metasCreated ${metasCreated}`)
      console.log(`Done? review ${review.done} meta ${meta.done} photos ${photos.done}`)
    }
    loops++
  }
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




