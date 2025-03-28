const express = require("express");
const router = express.Router({mergeParams : true});
//to get req.params values from app.js parent routes the above merge object
const wrapAsync = require("../utils/wrapAsync.js");
// const reviewSchema = require('../schema'); // Import schema for server side validation from schema.js
// const listingSchema = require('../schema'); // Import schema server side validation
const ExpressError = require ("../utils/ExpressError.js")
const Listing = require('../models/listing');
const { reviewSchema } = require('../schema');
const Review  = require ("../models/review")
const {validateReview} = require("../middleware")
const isLoggedIn = require("../middleware");
const {isReviewAuthor} = require ("../middleware")

const viewController = require("../controllers/reviews")


/*Reviews POST route*/
router.post("/",isLoggedIn, validateReview, wrapAsync (viewController.createReview));


//Delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(viewController.destroyReview))


module.exports = router;