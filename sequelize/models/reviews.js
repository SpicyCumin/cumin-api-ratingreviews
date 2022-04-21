'use strict';
const RandomId = () => {
  return Math.round((Math.random() * 100000))
}

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class reviews extends Model {

    static associate(models) {
      // define association here
      this.meta_id = this.belongsTo(models.metas)
      this.photos = this.hasMany(models.photos)
    }
  }
  reviews.init({
    id: {
      type: DataTypes.STRING,
      default: RandomId(),
      primaryKey: true,
    },
    product_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reviewer_name: {
      type: DataTypes.STRING,
      default: null,
    },


    summary: {
      type: DataTypes.STRING(256),
      allowNull: false,
    },
    body: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    response: {
      type: DataTypes.STRING(250),
      defaultValue: null,
    },

    rating: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    helpfulness: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    recommend: {
      type: DataTypes.BOOLEAN,
      default: false,
    },


  }, {
    sequelize,
    modelName: 'reviews',
  });
  return reviews;
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