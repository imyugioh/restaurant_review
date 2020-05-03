const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RestaurantsSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  avrating: {
    type: String,
    mininum: 0,
    maximum: 5,
    default: 0
  },
  maxrating: {
    type: Number,
    mininum: 0,
    maximum: 5,
    default: -1
  },
  minrating: {
    type: Number,
    mininum: 0,
    maximum: 5,
    default: 6
  },
  lastratingid: {
    type: String
  },
  reviewcount: {
    type: Number,
    default: 0,
    minimum: 0
  }
});

const Restaurants = mongoose.model("restaurants", RestaurantsSchema);

module.exports = Restaurants;
