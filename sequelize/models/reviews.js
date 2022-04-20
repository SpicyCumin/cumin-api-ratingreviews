'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.meta_id = this.belongsTo(models.Metas)
      this.photos = this.hasMany(models.Photos)
    }
  }
  Reviews.init({
    review_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
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
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    body: {
      type: DataTypes.STRING(1000),
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
    modelName: 'Reviews',
  });
  return Reviews;
};