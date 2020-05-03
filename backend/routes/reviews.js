const express = require("express");
const router = express.Router();
const passport = require("passport");
const reviewsController = require("../controller/ReviewsController");

router.get(
  "/all",
  passport.authenticate("jwt", { session: false }),
  reviewsController.getAll
);
router.get(
  "/get/:id",
  passport.authenticate("jwt", { session: false }),
  reviewsController.getReviewbyResId
);
router.post(
  "/add",
  passport.authenticate("jwt", { session: false }),
  reviewsController.addReview
);
router.put(
  "/edit/:id",
  passport.authenticate("jwt", { session: false }),
  reviewsController.editReview
);
router.delete(
  "/delete/:id",
  passport.authenticate("jwt", { session: false }),
  reviewsController.deleteReview
);

module.exports = router;
