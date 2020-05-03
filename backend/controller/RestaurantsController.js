const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Restaurants = require("../models/Restaurants");
const Reviews = require("../models/Reviews");
const validateRestaurant = require("../validation/restaurants");

const findAll = res => {
  Restaurants.find({}, (err, doc) => {
    doc.sort((a, b) => Number(b.avrating) - Number(a.avrating));
    return res.json(doc);
  });
};
exports.getAll = (req, res) => {
  findAll(res);
};

exports.getRestaurant = (req, res) => {
  Restaurants.find(req.params.id, (err, doc) => {
    return res.json(doc);
  });
};

exports.addRestaurant = (req, res) => {
  const { errors, isValid } = validateRestaurant(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  if (req.user.role == "user") {
    return res.status(400).json({
      error: "Access denied"
    });
  }
  new Restaurants({ name: req.body.name })
    .save()
    .then(rest => {
      console.log("Adding restaurant succeed.", rest);
      findAll(res);
    })
    .catch(error => {
      return res.status(400).json({
        error: "Something went wrong with adding the restaurant"
      });
    });
};

exports.editRestaurant = (req, res) => {
  const { errors, isValid } = validateRestaurant(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  if (req.user.role == "user") {
    return res.status(400).json({
      error: "Access denied"
    });
  }
  Restaurants.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true },
    (err, doc) => {
      if (err) {
        return res.status(400).json({
          error: "Something went wrong with updating the restaurant"
        });
      } else {
        if (!doc) {
          return res.status(400).json({
            error: "operation failed"
          });
        }
        console.log("Updating restaurant succeed.", doc);
        findAll(res);
      }
    }
  );
};

exports.deleteRestaurant = (req, res) => {
  if (req.user.role == "user") {
    return res.status(400).json({
      error: "Access denied"
    });
  }
  Restaurants.findByIdAndDelete(req.params.id, (err, doc) => {
    if (err) {
      return res.status(400).json({
        error: "Something went wrong with deleting the restaurant"
      });
    } else {
      if (!doc) {
        return res.status(400).json({
          error: "operation failed"
        });
      }
      Reviews.deleteMany({ resid: req.params.id })
        .then(() => {
          console.log("Deleting restaurant succeed.", doc);
          findAll(res);
        })
        .catch(err => {
          return res.status(400).json({
            error: "Something went wrong with deleting the restaurant"
          });
        });
    }
  });
};
