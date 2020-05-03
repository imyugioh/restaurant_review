const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Reviews = require("../models/Reviews");
const Restaurants = require("../models/Restaurants");
const validateReview = require("../validation/review");

const findReviewsbyResId = (resid, res) => {
  Reviews.find({ resid }, (err, doc) => {
    return res.json(doc);
  });
};

const getAllReviews = res => {
  Reviews.find({}, (err, doc) => {
    return res.json(doc);
  });
};

exports.getAll = (req, res) => {
  getAllReviews(res);
};

exports.getReviewbyResId = (req, res) => {
  findReviewsbyResId(req.params.id, res);
};

exports.addReview = (req, res) => {
  const { errors, isValid } = validateReview(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { resid, rate, comment } = req.body;
  const userid = req.user.id;

  Restaurants.findById(resid, (err, rest) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: "Something went wrong with adding the review"
      });
    }
    if (!rest) {
      return res.status(400).json({
        error: "operation failed"
      });
    }
    Reviews.findOne({ resid, userid })
      .then(user => {
        if (user) {
          return res.status(400).json({
            error: "You already gave the feedback"
          });
        } else {
          new Reviews({ resid, userid, rate, date: new Date(), comment })
            .save()
            .then(review => {
              let avRate, maxRate, minRate;
              avRate =
                (parseFloat(rest.avrating) * rest.reviewcount + Number(rate)) /
                (rest.reviewcount + 1);
              maxRate = rest.maxrating < rate ? rate : rest.maxrating;
              minRate = rest.minrating > rate ? rate : rest.minrating;
              Restaurants.findByIdAndUpdate(
                resid,
                {
                  avrating: avRate,
                  maxrating: maxRate,
                  minrating: minRate,
                  lastratingid: review.id,
                  reviewcount: rest.reviewcount + 1
                },
                { new: true },
                (err, rest) => {
                  if (err) {
                    return res.status(400).json({
                      error: "Something went wrong with adding the review"
                    });
                  } else {
                    console.log("Adding Review succeed.", review);
                    getAllReviews(res);
                  }
                }
              );
            })
            .catch(error => {
              return res.status(400).json({
                error: "Something went wrong with adding the review"
              });
            });
        }
      })
      .catch(err => {
        return res.status(400).json({
          error: "Something went wrong with adding the review"
        });
      });
  });
};

exports.editReview = (req, res) => {
  const { errors, isValid } = validateReview(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { rate, comment } = req.body;
  if (req.user.role == "user") {
    return res.status(400).json({
      error: "Access denied"
    });
  }

  Reviews.findById(req.params.id).then(review => {
    if (!review) {
      return res.status(400).json({
        error: "operation failed"
      });
    }
    Reviews.findByIdAndUpdate(
      review.id,
      { rate: rate, date: new Date(), comment: comment },
      { new: true },
      (err, newReview) => {
        if (err) {
          return res.status(400).json({
            error: "Something went wrong with editing the review"
          });
        } else {
          Reviews.find({ resid: review.resid }, (err, allReview) => {
            if (err) {
              return res.status(400).json({
                error: "Something went wrong with editing the review"
              });
            }
            let maxRate = -1,
              minRate = 6,
              avRate;

            Restaurants.findById(review.resid, (err, rest) => {
              if (err) {
                console.log(err);
                return res.status(400).json({
                  error: "Something went wrong with adding the review"
                });
              }
              if (rest === undefined) {
                return res.status(400).json({
                  error: "Could not find the restaurant"
                });
              }
              allReview.forEach(elem => {
                if (maxRate <= elem.rate) maxRate = elem.rate;
                if (minRate >= elem.rate) minRate = elem.rate;
              });
              avRate =
                (parseFloat(rest.avrating) * rest.reviewcount -
                  review.rate +
                  Number(newReview.rate)) /
                rest.reviewcount;
              Restaurants.findByIdAndUpdate(
                newReview.resid,
                {
                  avrating: avRate,
                  maxrating: maxRate,
                  minrating: minRate,
                  lastratingid: review.id
                },
                { new: true },
                (err, rest) => {
                  if (err) {
                    return res.status(400).json({
                      error: "Something went wrong with editing the review"
                    });
                  } else {
                    console.log("Updating review succeed.", newReview);
                    getAllReviews(res);
                  }
                }
              );
            });
          });
        }
      }
    );
  });
};

exports.deleteReview = (req, res) => {
  if (req.user.role == "user") {
    return res.status(400).json({
      error: "Access denied"
    });
  }

  Reviews.findByIdAndDelete(req.params.id, (err, review) => {
    if (err) {
      return res.status(400).json({
        error: "Something went wrong with deleting the review"
      });
    } else {
      if (!review) {
        return res.status(400).json({
          error: "operation failed"
        });
      }
      Reviews.find({ resid: review.resid }, (err, allReview) => {
        if (err) {
          return res.status(400).json({
            error: "Something went wrong with deleting the review"
          });
        }
        let maxRate = -1,
          minRate = 6,
          avRate = "0",
          lastReviewId = "";

        Restaurants.findById(review.resid, (err, rest) => {
          if (err) {
            console.log(err);
            return res.status(400).json({
              error: "Something went wrong with adding the review"
            });
          }
          if (rest === undefined) {
            return res.status(400).json({
              error: "Could not find the restaurant"
            });
          }
          if (allReview.length > 0) {
            lastDate = allReview[0].date;
            allReview.forEach(elem => {
              if (maxRate <= elem.rate) maxRate = elem.rate;
              if (minRate >= elem.rate) minRate = elem.rate;
              if (lastDate <= elem.date) {
                lastDate = elem.date;
                lastReviewId = elem.id;
              }
            });
            avRate =
              (parseFloat(rest.avrating) * rest.reviewcount - review.rate) /
              (rest.reviewcount - 1);
          }

          Restaurants.findByIdAndUpdate(
            review.resid,
            {
              avrating: avRate,
              maxrating: maxRate,
              minrating: minRate,
              lastratingid: lastReviewId,
              reviewcount: rest.reviewcount - 1
            },
            { new: true },
            (err, rest) => {
              if (err) {
                return res.status(400).json({
                  error: "Something went wrong with deleting the review"
                });
              } else {
                console.log("Deleting review succeed.", review);
                getAllReviews(res);
              }
            }
          );
        });
      });
    }
  });
};
