
const { pool } = require('./connect')



const query = async (params) => {
  try {
      const res = await pool.query(params)
      return res.rows;
  } catch (err) {
    console.log(`PSQL GET QUERY ERROR for: \nParams: ${JSON.stringify(params)}`)
    // console.log(err)
    return []
  }
}


const reviewFieldsArray = [
  'review_id',
  'rating',
  'summary',
  'recommend',
  'response',
  'body',
  'date',
  'reviewer_name',
  'helpfulness',
  'review_photos'
]

const reviewFields = reviewFieldsArray.join(', ')
const reviewKeys = [...Array(reviewFieldsArray.length).keys()].map(ind =>  `$${(ind + 1)} `)

const selectReviewProd = (product_id) => {
  return query({
    text: `SELECT ${reviewFields} FROM reviews WHERE product_id = $1`,
    values: [product_id]
  })
}



const selectMetaProd = (product_id) => {
  return query({
    text: 'SELECT m.characteristic_id, m.value FROM metas AS m WHERE m.product_id = $1',
    values: [product_id],
  })
}


// const selectCharProd = (product_id) => {
//   return query({
//     text: 'SELECT c.characteristic_id, c.name FROM characteristics AS c WHERE c.product_id = $1',
//     values: [product_id]
//   })
// }
const selectCharProd = (product_id) => {
  return query({
    text: 'SELECT p.characteristics, p.characteristics_ids FROM products AS p WHERE p.product_id = $1',
    values: [product_id]
  })
}




const SELECT = {
  reviews: {
    product_id: selectReviewProd
  },
  metas: {
    product_id: selectMetaProd
  },
  characteristics: {
    product_id: selectCharProd
  },
}







const insertReview = (reviewValues) => {
  return query({
    text: `INSERT INTO reviews (${reviewFields}) VALUES (${reviewKeys})`,
    values: [reviewValues]
  })
}



const INSERT = {
  reviews: {
    product_id: insertReview
  }
}





const updateReview = (updateValues, setFields) => {

  return query({
    text: `UPDATE reviews SET ${setFields.map((field, ind) => `${field} = $${ind + 1}`)}  WHERE review_id = $${setFields.length + 1}`,
    values: updateValues
  })
}



const UPDATE = {
  reviews: {
    review_id: updateReview
  }
}



const charQueryText = `
WITH allVals AS
(
  SELECT chars.name, chars.id, ARRAY( SELECT m.value FROM metas AS m WHERE m.characteristic_id = chars.id ) AS values
  FROM
  (
    SELECT c.name, c.characteristic_id AS id
    FROM characteristics AS c
    WHERE c.product_id = $1
  )
  AS chars
  JOIN
  (
    SELECT m.value, m.characteristic_id AS id
    FROM  metas AS m
    WHERE m.product_id = $1
  )
  AS metaVals
  ON metaVals.id = chars.id
)
SELECT DISTINCT *
FROM allVals;
`


const buildCharacteristics = (product_id) => {
  return query({
    text: charQueryText,
    values: [product_id]
  })
}



const buildReviews = (product_id) => {
  return query({
    text: `SELECT r.recommend, r.rating FROM reviews AS r WHERE r.product_id = $1;`,
    values: [product_id]
  })
}



const BUILD = {
  characteristics: buildCharacteristics,
  reviewsData: buildReviews
}








module.exports = {  SELECT, INSERT, UPDATE, BUILD }

// INSERT INTO [table] ([fields]) VALUES ([keys]) WHERE [condition]; keys => values
// function buildInsertQuery (params) {
//   const { table, condition, fields, values } = params
//   const numValues = values.length
//   if(numValues) {
//     const keys = [...Array(numValues).keys()].map(ind =>  `$${(ind + 1)} `)
//     if (condition) {
//       return {
//         text: `INSERT INTO ${table} (${fields}) VALUES (${keys})  WHERE ${condition}`,
//         values
//       }
//     }
//     else {
//       return {
//         text: `INSERT INTO ${table} (${fields}) VALUES (${keys})`,
//         values
//       }
//     }
//   }
//   return null
// }


// const builders = {
//   SELECT: buildSelectQuery,
//   INSERT: buildInsertQuery,
//   UPDATE: buildUpdateQuery,
// }


// function buildQuery (params, type, name,  fields) {
//   if(type) {
//     return builders[type](params, name, fields)
//   }
//   return null
// }



// UPDATE [table] SET [keys] WHERE [condition]; keys => values
// function buildUpdateQuery (table, condition, fields, values) {
//   const numValues = values.length
//   if(numValues) {
//     return {
//       text: `UPDATE ${table} SET ${fields} WHERE ${condition}`,
//       values
//     }
//   }
//   return null
// }

