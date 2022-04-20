
const Models = require('./models/index');


const createNew =  (newDocuments, modelName, save = true) => {

  if (Array.isArray(newDocuments)) {
    return Promise.all(newDocuments.map(document => {
      Models[modelName].create(document)
    }))
  }
  return Models[modelName].create(newDocuments)
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
    return Models[modelName].bulkCreate(newDocuments)
  }
  return null
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
  many: {
    reviews: createManyReviews,
    metas: createManyMetas,
    photos: createManyPhotos,
  }
}




// Previous project sequelize functions

// const createNewAssociates = (rawData, users) => {
//   var associates =  Object.keys(rawData).map((key) => {
//     var newRecord = FORMAT[key](rawData[key])
//     newRecord.userId = users.id
//     return [key, DB[key].create(newRecord)];
//   });
//   return Promise.all(associates.map((vals) => vals[1]))
//     .then((assocs) => {
//       return assocs.reduce((memo, val, ind) => {
//         memo[associates[ind][0]] = val;
//         return memo;
//         }, { users })
//     })
//     .catch((err) => console.log('createNewAssociate err: ', err))
// };


// const createNewUser = (rawData) => {
//   return DB.users.create(FORMAT.users(rawData))
//           .then((createRes) => createRes)
//           .catch((err) => console.log('createNewUser err: ', err))
// }


// const CREATE = {
//   newUser: createNewUser,
//   newAssociates: createNewAssociates,
// }
