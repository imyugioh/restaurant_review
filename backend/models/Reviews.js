const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  resid: {
    type: String,
    required: true
  },
  userid: {
    type: String,
    required: true
  },
  rate: {
    type: Number,
    minimum: 0,
    maximum: 5,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  comment: {
    type: String,
    required: true
  }
});

const Reviews = mongoose.model("reviews", ReviewSchema);

module.exports = Reviews;
