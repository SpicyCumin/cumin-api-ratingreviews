'use strict';
const RandomId = () => {
  return Math.round((Math.random() * 100000)).toString()
}
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class metas extends Model {

    static associate(models) {
      this.review_id = this.hasOne(models.reviews)
    }

  }
  metas.init({
    id: {
      type: DataTypes.STRING,
      default: RandomId(),
      primaryKey: true,
    },
    characteristic_id: {
      type: DataTypes.STRING,
      default: null,
    },
    value: {
      type: DataTypes.STRING,
      default: '0',
    },

  }, {
    sequelize,
    modelName: 'metas',
  });
  return metas;
};





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



