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
    review_id: {
      type: DataTypes.STRING,
      // primaryKey: true,
      default: RandomId(),
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