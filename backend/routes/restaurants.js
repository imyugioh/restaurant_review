const express = require("express");
const router = express.Router();
const passport = require("passport");
const restaurantController = require("../controller/RestaurantsController");

router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  restaurantController.getAll
);
router.get(
  "/get/:id",
  passport.authenticate("jwt", { session: false }),
  restaurantController.getRestaurant
);
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  restaurantController.addRestaurant
);
router.put(
  "/edit/:id",
  passport.authenticate("jwt", { session: false }),
  restaurantController.editRestaurant
);
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  restaurantController.deleteRestaurant
);

module.exports = router;
