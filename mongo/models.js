
"use strict";

const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/sdc_dev')
console.log('Connected to mongoDB succsesfully')
const { Schema } = mongoose;


const RandomId = () => {
  return Math.round((Math.random() * 100000))
}

const PhotosSchema = new Schema({
  id: {
    type: Number,
    default: RandomId
  },
  review_id: {
    type: Number,
    default: RandomId
  },
  thumbnail_url: {
    type: String,
    default: null,
  },
  url:  {
    type: String,
    default: null,
  },
})



const MetasSchema = new Schema({
  id: {
    type: Number,
    default: RandomId
  },
  review_id: {
    type: Number,
    default: RandomId
  },
  characteristic_id: {
    type: Number,
    default: null
  },
  value: {
    type: String,
    default: null
  },
})



const ReviewsSchema = new Schema({
  id: {
    type: Number,
    default: RandomId
  },
  product_id: {
    type: Number,
    default: null,
  },
  reviewer_name: {
    type: String,
    default: null,
  },

  summary: {
    type: String,
    default: null,
  },
  body: {
    type: String,
    default: null,
  },
  response: {
    type: String,
    default: null,
  },

  helpfulness: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  },
  recommend: {
    type: Boolean,
    default: false,
  },

  photos: {
    type: [ PhotosSchema ],
    default: [],
  },
  meta: {
    type: [MetasSchema],
    default: [],
  },

  date:  {
    type: Date,
    default: Date.now
  },
})


const ProductsSchema = new Schema({
  id: {
    type: Number,
    default: RandomId
  },
  reviews: {
    type: [ ReviewsSchema ],
    default: []
  },


  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
})




const Photos = mongoose.model('Photos', PhotosSchema);
const Metas = mongoose.model('Metas', MetasSchema);
const Reviews = mongoose.model('Reviews', ReviewsSchema);
const Products = mongoose.model('Products', ProductsSchema);



module.exports = {
  Photos,
  Metas,
  Reviews,
  Products,
}


// ratings: {
//   1: '10',
//   2: '16',
//   3: '41',
//   4: '27',
//   5: '101',
// },
// recommended: {
//   false: '29',
//   true: '166',
// },
// characteristics: {
//   Fit: {
//     id: 125031,
//     value: '3.2320000000000000',
//   },
//   Length: {
//     id: 125032,
//     value: '3.1376811594202899',
//   },
//   Comfort: {
//     id: 125033,
//     value: '3.2626262626262626',
//   },
//   Quality: {
//     id: 125034,
//     value: '3.2959183673469388',
//   },
// },




//  characteristics
// id,product_id,name
// 1,1,"Fit"
// 2,1,"Length"
// 3,1,"Comfort"



// characteristics {
//  id: '1',
//  product_id: '1',
//  name: 'Fit'
// },

// meta {
//  id: '1',
//  characteristic_id: '1',
//  review_id: '1',
//  value: '4'
// },

// review {
//   id: '1',
//   product_id: '1',
//   rating: '5',
//   date: '1596080481467',
//   summary: 'This product was great!',
//   body: 'I really did or did not like this product based on whether it was sustainably sourced.  Then I found out that its made from nothing at all.',
//   recommend: 'true',
//   reported: 'false',
//   reviewer_name: 'funtime',
//   reviewer_email: 'first.last@gmail.com',
//   response: 'null',
//   helpfulness: '8'
// },

// photos {
//  id: '1',
//  review_id: '5',
//  url: 'https://images.unsplash.com/photo-1560570803-7474c0f9af99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80'
//}







// meta {
//   value: { id: '2', characteristic_id: '2', review_id: '1', value: '3' },
//   done: false
// }
// review {
//   value: {
//     id: '2',
//     product_id: '1',
//     rating: '4',
//     date: '1610178433963',
//     summary: 'This product was ok!',
//     body: 'I really did not like this product solely because I am tiny and do not fit into it.',
//     recommend: 'false',
//     reported: 'false',
//     reviewer_name: 'mymainstreammother',
//     reviewer_email: 'first.last@gmail.com',
//     response: 'null',
//     helpfulness: '2'
//   },
//   done: false
// }
// photos {
//   value: [
//     {
//       id: '2',
//       review_id: '5',
//       url: 'https://images.unsplash.com/photo-1561693532-9ff59442a7db?ixlib=rb-1.2.1&auto=format&fit=crop&w=975&q=80'
//     }
//   ],
//   done: false

// review_id, product_id, rating, date, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness,



//  tot prods 950 071
//  tot reviews 5 774 952
// db.products.findOne({id: 34775})