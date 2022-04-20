'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.review_id = this.belongsTo(models.Reviews)
    }
  }
  Photos.init({
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    thumbnail_url: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Photos',
  });
  return Photos;
};