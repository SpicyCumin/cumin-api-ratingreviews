const Models = require('./models');



const createNew =  (newDocuments, modelName, save = true) => {

  if (Array.isArray(newDocuments)) {
    return createMany(newDocuments, modelName, save)
  }
  return Models[modelName].create(newDocuments)
}

const createProducts = (newProduct, save) => {
  return createNew(newProduct, 'Products', save)
}

const createReviews = (newReviews, save) => {
    return createNew(newReviews, 'Reviews', save)
}

const createMetas = (newMeta, save) => {
  return createNew(newMeta, 'Metas', save)
}

const createPhotos = (newPhotos, save) => {
  return createNew(newPhotos, 'Photos')
}


const createMany =  (newDocuments, modelName, save = true) => {

  if (Array.isArray(newDocuments)) {
    return Models[modelName].create(newDocuments)
  }
  return null
}

const createManyProducts = (newProduct, save) => {
  return createMany(newProduct, 'Products', save)
}

const createManyReviews = (newReviews, save) => {
    return createMany(newReviews, 'Reviews', save)
}

const createManyMetas = (newMeta, save) => {
  return createMany(newMeta, 'Metas', save)
}

const createManyPhotos = (newPhotos, save) => {
  return createMany(newPhotos, 'Photos')
}

module.exports = {
  reviews: createReviews,
  metas: createMetas,
  photos: createPhotos,
  products: createProducts,
  many: {
    reviews: createManyReviews,
    metas: createManyMetas,
    photos: createManyPhotos,
    products: createManyProducts,
  }
}


// const createNew =  (newDocuments, modelName, save = true) => {

//   if (Array.isArray(newDocuments)) {
//     return Promise.all(newDocuments.map(document => {
//       const newDoc = new Models[modelName](document)
//       if (save) {
//         newDoc.save((err) => err && console.log('Save document err', document))
//       }
//       return newDoc
//     }))
//   }
//   const newDoc = new Models[modelName](newDocuments)
//   if (save) {
//     newDoc.save((err) => err && console.log('Save document err', document))
//   }
//   return newDoc
// }




// const Models = require('./models');
// const {
//   Photos,
//   Metas,
//   Reviews,
//   Answers,
//   Questions,
//   Skus,
//   Styles,
//   Features,
//   Products
// } = Models

// const createNew = (newDocuments, modelName) => {
//   return Models[modelName].create(newDocuments)
//   .catch(err => console.log('Error saving to db for ', modelName, 'input: ', newDocuments[0], err))
// }

// const createPhotos = (newPhotos) => {
//   return createNew(newPhotos, 'Photos')
// }


// const makeNew = (newDocuments, modelName) => {

//   if (Array.isArray(newDocuments)) {
//     return newDocuments.map(document => {
//       const newDoc = new Models[modelName](document)
//       newDoc.save((err) => err && console.log('Save document err', document))
//       return newDoc
//     })
//   }
//   const newDoc = new Models[modelName](newDocuments)
//   newDoc.save((err) => err && console.log('Save document err', newDocuments))
//   return newDoc
// }

// const makeStyles = (newStyles) => {
//   return newStyles.map(newStyle => {
//     const { skus, photos } = newStyle
//     console.log('newStyle', newStyle)
//     newStyle.skus = makeNew(skus, 'Skus')
//     newStyle.photos = makeNew(photos, 'Photos')
//     return makeNew(newStyle, 'Styles')
//   })
// }

// const makeQuestions = (newQuestions) => {
//   return newQuestions.map(question => {
//     const { answers } = question;
//     question.answers = makeNew(answers, 'Answers')
//     return makeNew(question, 'Questions')
//   })
// }

// const makeReviews = (newReviews) => {
//   return newReviews.map(review => {
//     const { photos } = review;
//     review.photos = makeNew(photos, 'Photos')
//     return makeNew(review, 'Reviews')
//   })
// }

// const makeMetas = (newMeta) => {
//   return makeNew(meta, 'Metas')
// }


// const makeProduct = (newProduct) => {
//   const {
//     product,
//     features,
//     styles,
//     questions,
//     reviews,
//     meta,
//     related,
//   } = newProduct

//   product.features = makeNew(features, 'Features')
//   product.questions = makeQuestions(questions)
//   product.styles = makeStyles(styles)
//   product.meta = makeNew(meta, 'Metas')
//   product.reviews = makeReviews(reviews)
//   product.related = related
//   const saveProduct = makeNew(product, 'Products')
//   // console.log('input ', newProduct)
//   // console.log('out ', saveProduct)

// }