const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controller/UserController");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);

router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  userController.readAllUser
);
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  userController.addUser
);
router.put(
  "/edit/:id",
  passport.authenticate("jwt", { session: false }),
  userController.editUser
);
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  userController.deleteUser
);

module.exports = router;
