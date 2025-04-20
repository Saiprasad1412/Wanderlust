const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const {isLogedIn,validateReview } = require("../middelware.js");
const reviewContoller = require("../controllers/review.js");

// Review Routes
router.post("/",
    isLogedIn,
    validateReview,
    wrapAsync(reviewContoller.postReview));

router.delete("/:reviewId",
    isLogedIn,
    wrapAsync(reviewContoller.deleteReview));

module.exports = router;