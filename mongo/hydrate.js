"use strict";

const fs = require('fs');
const csv = require('csv-parser')
// const heapdump = require('heapdump');
const path = require('path')

const csvDir = '/Users/ian/Downloads'
const reviewCSV = path.join(csvDir, "/reviews.csv")
const metaCSV = path.join(csvDir, "/metas.csv")
const photoCSV = path.join(csvDir, "/photos.csv")

// const heapSnapShots = `./../../heapSnapshots`
// async function snapHeap() {
//   heapdump.writeSnapshot(function(err, heapSnapShots) {
//     console.log('dump written to', heapSnapShots);
//   });
// }


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

    //stream.pause()
    yield chunk
    //stream.resume()
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
      // stream.pause()
      yield photos
      photos = [chunk]
      id = chunk.id
      // stream.resume()
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
  let newMetas = [];

  let reviewsCreated = 0
  let metasCreated = 0
  let loops = 0;

  while (!review.done) {
    // newPhotos = await this.create.photos(photos.value)
        // newMeta = await this.create.metas(meta.value)
    // newReview = await this.create.reviews(review.value)

    review.value.photos = photos.value || [];
    !review.done && newReviews.push(review.value)
    !meta.done && newMetas.push(meta.value)
    if (newReviews.length === bulkWriteAt || review.done) {
      await this.create.many.reviews(newReviews)
      reviewsCreated += newReviews.length
      newReviews = []
    }

    if (newMetas.length === bulkWriteAt || meta.done) {
      await this.create.many.reviews(newMetas)
      metasCreated += newMetas.length
      newMetas = []
    }

    review = !review.done ?  await reviewGen.next() : review
    meta = !meta.done ? await metaGen.next() : meta
    photos = !photos.done ?  await photoGen.next() : photos

    if ( !(loops % logAt)) {
      console.log(`\n\nReviewsCreated ${reviewsCreated}  metasCreated ${metasCreated}`)
      console.log(`Done? review ${review.done} meta ${meta.done} photos ${photos.done}`)
      // mem = process.memoryUsage()
      // console.log(`Mem use \nrss:${mem.rss} \nheapMax: ${mem.heapTotal} heapUsed:${mem.heapUsed}  \narrayBuffers:${mem.arrayBuffers}`)
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

//  node --max_old_space_size=400 app.js
//   clinic heapprofiler -- node --max_old_space_size=400 app.js
//  clinic doctor -- node --max_old_space_size=400 app.js



