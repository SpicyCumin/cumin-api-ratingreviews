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
const charCSV = path.join(csvDir, "/characteristics.csv")



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



async function * genStream(streamFile) {
  const stream = makeGenStream(streamFile)
  for await (let chunk of stream) {
    yield chunk
  }
}

async function* genManyStream(streamFile, idKey = 'review_id') {
  const stream = makeGenStream(streamFile)
  let items = []
  let idValue;

  for await (let chunk of stream) {
    chunk[idKey] = chunk[idKey] ? chunk[idKey] : idValue
    idValue = idValue ? idValue : chunk[idKey]
    if (chunk[idKey] === idValue) {
      items.push(chunk)
    }
    else {

      yield items
      items = [chunk]
      idValue = chunk[idKey]
    }
  }
}



const logAt = 10000
const bulkWriteAt = 5000;

async function hydrate() {
  console.log('running hydrate')
  const reviewGen = genStream(reviewCSV)
  const metaGen = genManyStream(metaCSV)
  const photoGen = genManyStream(photoCSV)
  console.log('reviewGen', reviewGen)
  console.log('metaGen', metaGen)
  console.log('photoGen', photoGen)

  let review = await reviewGen.next()
  let metas = await metaGen.next()
  let photos = await photoGen.next()
  let mem = process.memoryUsage()
  let newPhotos;
  let newReviews = [];

  let createdProducts = 0
  let createdReviews = 0
  let createdMetas = 0
  let createdPhotos = 0
  let loops = 0;

  let productId = review.value.product_id
  while (!review.done) {

    if ( !(loops % logAt)) {
      console.log(`\n\ncreatedProducts ${createdProducts} \ncreatedReviews ${createdReviews}  \ncreatedMetas ${createdMetas} \ncreatedPhotos ${createdPhotos}`)
      console.log(`Done? review ${review.done} meta ${metas.done} photos ${photos.done}`)
    }

    photos.value = photos.value ? photos.value : [{review_id: 0}]
    metas.value = metas.value ? metas.value : [{review_id: 0}]
    let reviewId = review.value.id
    let photoReviewId = photos.value[0].review_id
    let metasReviewId = metas.value[0].review_id


    if (reviewId === photoReviewId) {
      review.value.photos = photos.value;
      this.create.many.photos(photos.value)
      createdPhotos += photos.value.length
      photos = await photoGen.next()
    }
    if (reviewId === metasReviewId) {
      review.value.meta = metas.value;
      this.create.many.metas(metas.value)
      createdMetas += metas.value.length
      metas = await metaGen.next()
    }

    if (review.value.product_id === productId) {
      newReviews.push(review.value)
    }
    if (review.value.product_id !== productId) {
      let newProduct = { id: productId, reviews: newReviews  }
      await this.create.products(newProduct)
      createdProducts++
      productId = review.value.product_id
      newReviews = [review.value]
    }

    await this.create.reviews(review.value)
    createdReviews++
    review = await reviewGen.next()

    loops++
  }

  console.log('\n ---DONE---- ')
  console.log(`createdReviews ${createdReviews}  createdPhotos ${createdPhotos}  createdMetas ${createdMetas}`)
  console.log(`Done? review ${review.done} meta ${metas.done} photos ${photos.done}`)
  return true
}


//  db.products.drop()
//  db.reviews.drop()
//  db.metas.drop()
//  db.photos.drop()


function checkForHydration () {
  console.log('Checking DB for data MONGO')
  // linkReviewsToProducts(this)
  // this.hydrate()
  // return db.find({}).then(dbRes => {
  //   console.log('Db already hydrated setting up the search')
  // })
}


module.exports = { hydrate, checkForHydration }




// async function linkReviewsToProducts (db) {
//   // console.log(db)
//   console.log('\nlinkReviewsToProducts\n')
//   var allProducts = 0;
//   var ind = 0;
//   const allValues = 5788000
//   // const iterations = Math.ceil(allValues/maxValues);
//   while (allValues > ind++) {

//     const res = await db.GET.reviews({ product_id: ind.toString()})

//     const totLength = res.length
//     allProducts += totLength
//     let newProduct = { id: ind.toString(), reviews: res  }
//     await db.create.products(newProduct)
//     if ( !(ind % logAt) ) {
//       console.log(`\ncreatedProducts ${allProducts}  reviewCount ${ind} out of ${totLength} `)
//     }

//   }
//     // var lt = (ind + 1) * maxValues


//     // console.log('all reviews ', totLength)
//     // let createdProducts = 0
//     // var toSave = []
//     // var productId = res[0].product_id
//     // res.forEach(async (review, ind) => {
//       // if ( !(ind % logAt) ) {
//       //   console.log(`\ncreatedProducts ${allProducts}  reviewCount ${ind} out of ${totLength} `)
//       // }
//     //   if (review.product_id === productId) {
//     //     toSave.push(review)
//     //   }
//     //   else {
//     //     let newProduct = { id: productId, reviews: toSave  }
//     //     await this.POST.products(newProduct)
//     //     createdProducts++
//     //     productId = review.product_id
//     //     toSave = [review]
//     //   }
//     // })
//   // })

//   console.log('\nDONE linkReviewsToProducts\n')

// }
