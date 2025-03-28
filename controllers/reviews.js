const Listing = require("../models/listing");
const Review  = require ("../models/review");



module.exports.createReview = async(req, res)=>{
    let {id} = req.params;
    // console.log("listing ID :", id);
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);//Pushing to Review array object in it

    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Added!")
    res.redirect(`/listings/${listing._id}`)

};


module.exports.destroyReview = async(req, res)=>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});//which reviewId matches reviews that are pulled
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review Deleted!")
   
    res.redirect(`/listings/${id}`);
   }