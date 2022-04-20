'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Metas extends Model {

    static associate(models) {
      this.reviews = this.hasMany(models.Reviews)
    }

  }
  Metas.init({
    product_id: {
      type: DataTypes.STRING,
      allowNull: false
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
    modelName: 'Metas',
  });
  return Metas;
};








//https://imgur.com/a/eEkEwl1
//https://imgur.com/a/N3gGl7Q
// reviews csv 'https://drive.google.com/file/d/1xMnPRZoW4ASwKAHHJznXAh9PJrgYmxP_/view?usp=sharing'
// rev photos https://drive.google.com/file/d/14xma0YTuNqKGm3HFFSOXCaAxrfRLLQw7/view?usp=sharing
// rev char https://drive.google.com/file/d/1wpSEn0v8KkLIwiJjMPwFD1Zz5Vbs8IBt/view?usp=sharing

//  curl -o reviews.csv https://drive.google.com/file/d/1xMnPRZoW4ASwKAHHJznXAh9PJrgYmxP_/view?usp=sharing
//  curl -o reviews.csv  https://drive.google.com/u/0/uc?id=1xMnPRZoW4ASwKAHHJznXAh9PJrgYmxP_&export=download

//scp -i myAmazonKey.pem review.csv ec2-user@mec2-50-17-16-67.compute-1.amazonaws.com:~/.
//  scp -i /path/to/your/.pemkey -r /copy/from/path user@server:/copy/to/path
//  scp -i ~/.ssh/IMB.pem ~/Downloads/reviews.csv ec2-user@ec2-54-89-37-206.compute-1.amazonaws.com:/home/ec2-user/rawData
//  scp -i ~/.ssh/IMB.pem ~/Downloads/metas.csv ec2-user@ec2-54-89-37-206.compute-1.amazonaws.com:/home/ec2-user/rawData
//  scp -i ~/.ssh/IMB.pem ~/Downloads/photos.csv ec2-user@ec2-54-89-37-206.compute-1.amazonaws.com:/home/ec2-user/rawData