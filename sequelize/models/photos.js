'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class photos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.review_id = this.belongsTo(models.reviews)
    }
  }
  photos.init({
    url: {
      type: DataTypes.STRING,
      default: ''
    },
    thumbnail_url: {
      type: DataTypes.STRING,
      default: ''
    }
  }, {
    sequelize,
    modelName: 'photos',
  });
  return photos;
};