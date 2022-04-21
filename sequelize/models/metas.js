'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class metas extends Model {

    static associate(models) {
      this.reviews = this.hasMany(models.reviews)
    }

  }
  metas.init({
    product_id: {
      type: DataTypes.STRING,
      default: -1,
    },
    ratings: {
      type: DataTypes.JSON,
      default: {
        "1": "0",
        "2": "0",
        "3": "0",
        "4": "0",
        "5": "0",
      },
    },
    recommend: {
      type: DataTypes.JSON,
      default: { "0":"0" },
    },
    characteristics: {
      type: DataTypes.JSON,
      default: {},
    },

  }, {
    sequelize,
    modelName: 'metas',
  });
  return metas;
};









//scp -i myAmazonKey.pem review.csv ec2-user@mec2-50-17-16-67.compute-1.amazonaws.com:~/.
//  scp -i /path/to/your/.pemkey -r /copy/from/path user@server:/copy/to/path
//  scp -i ~/.ssh/IMB.pem ~/Downloads/reviews.csv ec2-user@ec2-54-89-37-206.compute-1.amazonaws.com:/home/ec2-user/rawData
//  scp -i ~/.ssh/IMB.pem ~/Downloads/metas.csv ec2-user@ec2-54-89-37-206.compute-1.amazonaws.com:/home/ec2-user/rawData
//  scp -i ~/.ssh/IMB.pem ~/Downloads/photos.csv ec2-user@ec2-54-89-37-206.compute-1.amazonaws.com:/home/ec2-user/rawData

//  scp -i ~/.ssh/IMB2.pem ~/Downloads/reviews.csv  ec2-user@ec2-44-201-118-229.compute-1.amazonaws.com:/home/ec2-user/api/rawData
//  scp -i ~/.ssh/IMB2.pem ~/Downloads/metas.csv  ec2-user@ec2-44-201-118-229.compute-1.amazonaws.com:/home/ec2-user/api/rawData
//  scp -i ~/.ssh/IMB2.pem ~/Downloads/photos.csv  ec2-user@ec2-44-201-118-229.compute-1.amazonaws.com:/home/ec2-user/api/rawData