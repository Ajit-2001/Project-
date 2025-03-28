
const ExpressError = require ("./utils/ExpressError.js")
const Listing = require('./models/listing');
const Review = require('./models/review');
const { listingSchema } = require('./schema');

const { reviewSchema } = require('./schema');

const isLoggedIn = (req, res, next)=>{
    // console.log("middleware reached")
    // console.log(req.path, ".." , req.originalUrl);
    if(!req.isAuthenticated()){
        // redirect url for if user is not logged in
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create listing!")
        return res.redirect("/login");
    }
    next()
}

module.exports = isLoggedIn;


module.exports.saveRedirectUrl = (req, res, next)=> {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async (req, res, next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`listings/${id}`);
    }
    next();
}


/*Validate middleware */ //server side validation
module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el)=>el.message).join(",")
            throw new ExpressError(400, errMsg);
        } else {
            next();
        }
}


/*Validate middleware */ //server side validation
module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
        if(error){
            let errMsg = error.details.map((el)=>el.message).join(",")
            throw new ExpressError(400, errMsg);
        } else {
            next();
        }
}

//for author
// module.exports.isReviewAuthor = async (req, res, next)=>{
//     let { id, reviewId } = req.params;
//     let review = await Review.findById(reviewId);
//     if (!review.author.equals(res.locals.currUser._id)){
//         req.flash("error", "You are not the Author of review");
//         return res.redirect(`listings/${id}`);
//     }
//     next();
// }
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    
    if (!review) {
        req.flash("error", "Review not found!");
        return res.redirect(`/listings/${id}`);
    }

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not authorized to delete this review!");
        return res.redirect(`/listings/${id}`);
    }

    next();
};

