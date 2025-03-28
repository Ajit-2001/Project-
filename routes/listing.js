const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
// const reviewSchema = require('../schema'); // Import schema for server side validation from schema.js
// const listingSchema = require('../schema'); // Import schema server side validation
const ExpressError = require ("../utils/ExpressError.js")
const Listing = require('../models/listing');
const { listingSchema } = require('../schema');
const isLoggedIn = require("../middleware.js");
const isOwner  = require("../middleware");
const validateListing = require("../middleware")

const listingController = require("../controllers/listing");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js")
const upload = multer({ storage });





router.route("/")
.get( wrapAsync(listingController.index))//index route
.post(isLoggedIn,upload.single('listing[image][url]'),validateListing, wrapAsync (listingController.createListing));//create route





router.get("/new",isLoggedIn, listingController.renderNewForm );//new route

router.route("/:id")
.get(wrapAsync(listingController.showListing))//show route
.put(isLoggedIn,isOwner,upload.single('listing[image][url]'),validateListing,wrapAsync(listingController.updateListing))//update route
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));//delete route

router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));//edit route


module.exports = router;



// //Index route
// router.get("/", wrapAsync(listingController.index));


//New route
// router.get("/new",isLoggedIn, listingController.renderNewForm );


//show route(read)->to print individual data
// router.get("/:id", wrapAsync(listingController.showListing));



// //Create route
// router.post("/",validateListing,isLoggedIn, wrapAsync (listingController.createListing));


//Edit route
// router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));


//update route
// router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));


//Delete route 
// router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));



