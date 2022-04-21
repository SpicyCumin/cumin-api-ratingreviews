
"use strict";

const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/sdc_dev')
const { Schema } = mongoose;


const RandomId = () => {
  return Math.round((Math.random() * 100000)).toString()
}

const PhotosSchema = new Schema({
  id: {
    type: String,
    default: RandomId
  },
  review_id: {
    type: String,
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
    type: String,
    default: RandomId
  },
  review_id: {
    type: String,
    default: RandomId
  },
  characteristic_id: {
    type: String,
    default: null
  },
  value: {
    type: String,
    default: null
  },
})



const ReviewsSchema = new Schema({
  id: {
    type: String,
    default: RandomId
  },
  product_id: {
    type: String,
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
    type: MetasSchema,
  },

  date:  {
    type: Date,
    default: Date.now
  },
})



const Photos = mongoose.model('Photos', PhotosSchema);
const Metas = mongoose.model('Metas', MetasSchema);
const Reviews = mongoose.model('Reviews', ReviewsSchema);



module.exports = {
  Photos,
  Metas,
  Reviews,
}


// meta {
//   value: { id: '1', characteristic_id: '1', review_id: '1', value: '4' },
//   done: false
// }
// review {
//   value: {
//     id: '1',
//     product_id: '1',
//     rating: '5',
//     date: '1596080481467',
//     summary: 'This product was great!',
//     body: 'I really did or did not like this product based on whether it was sustainably sourced.  Then I found out that its made from nothing at all.',
//     recommend: 'true',
//     reported: 'false',
//     reviewer_name: 'funtime',
//     reviewer_email: 'first.last@gmail.com',
//     response: 'null',
//     helpfulness: '8'
//   },
//   done: false
// }
// photos {
//   value: [
//     {
//       id: '1',
//       review_id: '5',
//       url: 'https://images.unsplash.com/photo-1560570803-7474c0f9af99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=975&q=80'
//     }
//   ],
//   done: false
// }
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