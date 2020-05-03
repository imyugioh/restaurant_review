const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const validateEditUser = require("../validation/edituser");
const validateAddUser = require("../validation/adduser");
const User = require("../models/User");
const jwtExpireTime = 60 * 60 * 24;

exports.registerUser = (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      return res.status(400).json({
        email: "Email already exists"
      });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: "user"
      });

      bcrypt.genSalt(10, (err, salt) => {
        if (err) console.error("There was an error", err);
        else {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.error("There was an error", err);
            else {
              newUser.password = hash;
              newUser.save().then(user => {
                console.log("Register succeed.", user);
                return res.json(user);
              });
            }
          });
        }
      });
    }
  });
};

exports.loginUser = (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name,
          role: user.role
        };
        jwt.sign(
          payload,
          "secret",
          {
            expiresIn: jwtExpireTime
          },
          (err, token) => {
            if (err) console.error("There is some error in token", err);
            else {
              console.log("Login Succeed.", payload);
              res.json({
                success: true,
                token: `Bearer ${token}`
              });
            }
          }
        );
      } else {
        errors.password = "Incorrect Password";
        return res.status(400).json(errors);
      }
    });
  });
};

exports.addUser = (req, res) => {
  const { errors, isValid } = validateAddUser(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  if (req.user.role == "user") {
    return res.status(400).json({
      error: "Access denied"
    });
  }
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      return res.status(400).json({
        email: "Email already exists"
      });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role
      });

      bcrypt.genSalt(10, (err, salt) => {
        if (err) console.error("There was an error", err);
        else {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.error("There was an error", err);
            else {
              newUser.password = hash;
              newUser.save().then(user => {
                console.log("User Added Successfully.", user);
                User.find({}, (err, doc) => {
                  return res.json(doc);
                });
              });
            }
          });
        }
      });
    }
  });
};

exports.editUser = (req, res) => {
  const { errors, isValid } = validateEditUser(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  if (req.user.role == "user") {
    return res.status(400).json({
      error: "Access denied"
    });
  }
  User.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, role: req.body.role },
    { new: true },
    (err, doc) => {
      if (err) {
        return res.status(400).json({
          error: "Something went wrong with updating the user"
        });
      } else {
        console.log("Updating user succeed.", doc);
        User.find({}, (err, doc) => {
          return res.json(doc);
        });
      }
    }
  );
};

exports.deleteUser = (req, res) => {
  if (req.user.role === "user") {
    return res.status(400).json({
      error: "Access denied"
    });
  }
  if (req.user.id === req.params.id) {
    return res.status(400).json({
      error: "You can't delete yourself"
    });
  }
  User.findByIdAndDelete(req.params.id, (err, doc) => {
    if (err) {
      return res.status(400).json({
        error: "Something went wrong with updating the user"
      });
    } else {
      console.log("Deleting user succeed.", doc);
      User.find({}, (err, doc) => {
        return res.json(doc);
      });
    }
  });
};

exports.readAllUser = (req, res) => {
  if (req.user.role == "user") {
    return res.status(400).json({
      error: "Access denied"
    });
  }
  User.find({}, (err, doc) => {
    return res.json(doc);
  });
};
