
"use strict";


const mongoose = require("mongoose");
const { Schema } = mongoose;


const RandomId = () => {
  return Math.round((Math.random() * 100000))
}

const PhotosSchema = new Schema({
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
  product_id: {
    type: Number,
    default: RandomId
  },
  ratings:  {
    type: Object,
    default: {
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
    },
  },
  recommended: {
    type: Object,
    default: {}
  },
  characteristics: {
    type: Object,
    default: {}
  },
})



const ReviewsSchema = new Schema({
  review_id: {
    type: Number,
    default: RandomId
  },
  product_id: {
    type: Number,
    // required: true,
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