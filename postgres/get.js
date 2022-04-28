const { ShortCache } = require('../db/ShortCache')
const {  SELECT, BUILD } = require('./query')


const SC = ShortCache()
let table = 'photos'
let condition = 'review_id'
let values;




const getProductReview = async ({ product_id, page, count, sort }) => {

  if(product_id) {
    const reviews = await SELECT.reviews.product_id(product_id)
    return  { product: product_id, results: reviews, page, count, sort }
  }
  return {}
}

const getProductMeta = async ({ product_id }) => {

  if(product_id) {

    const queries = await Promise.all([
      BUILD.reviewsData(product_id),
      BUILD.characteristics(product_id),
    ])
    return make.meta(product_id, ...queries)
  }
  return {}
}

setInterval(() => {
  getProductMeta({ product_id : 34545 })
  .then(res => {
    console.log('\nRESPONSE')
    console.log('query res', res)
  })
  .catch(err => {
    console.log('\nERROR')
    console.log('query err', err)
  })
}, 5000)

const GET = {
  reviews: getProductReview,
  product: getProductReview,
  metas: getProductMeta,
}



module.exports = { GET }



const makeMetaData = ( product_id, reviews, chars) => {
  const characteristics = {}
  let cl = chars.length
  let c = cl
  var char;
  while(c--) {
    char = chars[c]
    let cv = char.values.length;
    let sum = 0
    while (cv--) {
      sum += char.values[cv]
    }
    sum = sum /  char.values.length
    char.value = sum
    characteristics[char.name] = char
  }


  const metaData = {
    product_id,
    rating: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    },
    recommend: {
      "0": 0,
      "1": 0,
    },
    characteristics
  };


  let r = reviews.length
  var review;
  while(r--) {
    review = reviews[r]
    metaData.rating[review.rating.toString()]++
    if (review.recommend ) {
      metaData.recommend["1"]++
    }
    else {
      metaData.recommend["0"]++
    }
  }

  metaData.rating[review.rating] = metaData.rating[review.rating] / reviews.length
  return metaData
}



// const buildMeta = ( product_id, reviews, metas, chars) => {
//   const characteristics = {}
//   let cl = chars.length
//   let c = cl
//   var char;
//   while(c--) {
//     char = chars[c]
//     characteristics[char.name] = char
//   }
//   const metaData = {
//     product_id,
//     rating: {
//       1: 0,
//       2: 0,
//       3: 0,
//       4: 0,
//       5: 0,
//     },
//     recommend: {
//       "0": 0,
//       "1": 0,
//     },
//     characteristics
//   };

//   let m = metas.length
//   var meta;
//   while(m--) {
//     meta = metas[m]
//     c = cl
//     while(c--) {
//       char = chars[c]
//       if (char.characteristic_id === meta.characteristic_id) {
//         const metaValue = Number(meta.value)
//         const value = char.value;
//         char.value = value ? value + metaValue : metaValue
//       }
//     }
//   }


//   let r = reviews.length
//   var review;
//   while(r--) {
//     review = reviews[r]
//     metaData.rating[review.rating]++
//     if (review.recommend ) {
//       metaData.recommend["1"]++
//     }
//     else {
//       metaData.recommend["0"]++
//     }
//   }


//   return metaData
// }




const make = {
  meta: makeMetaData
}




// const cached = SC.check(product_id)
// if (cached) {
//   console.log('\nFETCHED CACHED meta ', cached)
//   return await cached
// }

// {
//   "product_id": "2",
//   "ratings": {
//     2: 1,
//     3: 1,
//     4: 2,
//     // ...
//   },
//   "recommended": {
//     0: 5
//     // ...
//   },
//   "characteristics": {
//     "Size": {
//       "id": 14,
//       "value": "4.0000"
//     },
//     "Width": {
//       "id": 15,
//       "value": "3.5000"
//     },
//     "Comfort": {
//       "id": 16,
//       "value": "4.0000"
//     },
//     // ...
// }



// {
//   "product": "2",
//   "page": 0,
//   "count": 5,
//   "results": [
//     {
      // "review_id": 5,
      // "rating": 3,
      // "summary": "I'm enjoying wearing these shades",
      // "recommend": false,
      // "response": null,
      // "body": "Comfortable and practical.",
      // "date": "2019-04-14T00:00:00.000Z",
      // "reviewer_name": "shortandsweeet",
      // "helpfulness": 5,
      // "photos": [{
//           "id": 1,
//           "url": "urlplaceholder/review_5_photo_number_1.jpg"
//         },




    // const queries = await Promise.all([
    //   GET('reviews', [product_id]),
    //   GET('metas', [product_id]),
    //   GET('chars', [product_id]),
    // ])
    // const queries = await Promise.all([
    //   getReviews({ product_id }),
    //   getMetas({ product_id }, ['characteristic_id', 'value']),
    //   getCharacteristics({ product_id }),
    // ])
    // const reviews = await getReviews({ product_id })
    // const metas = await getMetas({ product_id }, ['characteristic_id', 'value'])
    // const chars = await getCharacteristics({ product_id })
    // return build.meta({ product_id, reviews, metas, chars })


// // const GET = async (params, name, fields = ['*']) => {
// //   return await query(params, 'SELECT', name, fields)
// // }

// const GET = async ( name, values ) => {
//   return query(name, values)
// }




// const getReviews = async ({ product_id }, fields = reviewFields) => {

//   if (product_id) {
//     table = 'reviews'
//     condition = 'product_id'
//     values = Array.isArray(product_id) ? product_id : [product_id]
//     const reviews = await GET({ table, condition, values  }, `reviews_${product_id}`, fields)
//     return reviews ? reviews : []
//   }
//   return []
// }




// const getPhotos = async ({ review_id }) => {

//   if (review_id) {
//     table = 'photos'
//     condition = 'review_id'
//     values = Array.isArray(review_id) ? review_id : [review_id]
//     const photos = await GET({ table, condition, values  })
//     return photos ? photos : []
//   }
//   return []
// }


// const getMetas = async ({ product_id, review_id }, fields) => {


//   if (product_id) {
//     table = 'metas'
//     condition = 'product_id'
//     values = Array.isArray(product_id) ? product_id : [product_id]
//     const metas = await GET({ table, condition, values }, `metas_${product_id}`, fields)
//     return metas ? metas : []
//   }

//   if (review_id) {
//     table = 'metas'
//     condition = 'review_id'
//     values = Array.isArray(review_id) ? review_id : [review_id]
//     const metas = await GET({ table, condition, values }, `metas_${review_id}`, fields)
//     return  metas ? metas : []
//   }
//   return []
// }



// const getCharacteristics = async ({ product_id, review_id }) => {

//   if (product_id) {

//     table = 'characteristics'
//     condition = `product_id `
//     values = Array.isArray(product_id) ? product_id : [product_id]
//     const chars = await GET({ table, condition, values }, `chars_${product_id}`, ['characteristic_id', 'name'])
//     return chars ? chars : []
//   }
//   if (review_id) {
//     table = 'characteristics'
//     condition = 'characteristic_id'
//     const metas = await getMetas({ review_id }, ['characteristic_id'])
//     values = metas ? metas.map(meta =>  meta.characteristic_id) : []
//     const chars = await GET({ table, condition, values }, `chars_${review_id}`, ['characteristic_id', 'name'])
//     return chars ? chars : []
//   }
//   return []
// }
