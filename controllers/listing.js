const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res)=>{
    const allListings = await Listing.find({})
        res.render ("listing/index.ejs", {allListings})
};



module.exports.renderNewForm = (req, res)=>{
    // if(!req.isAuthenticated()){
    //     req.flash("error", "You must be logged in to create listing!")
    //     res.redirect("/login");
    // }
    res.render("listing/new.ejs")
};


module.exports.showListing = async (req, res)=>{
    let {id} = req.params
    //populate used to get complt review object insted of id
    const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } }) 
    .populate("owner");

    if(!listing){
        req.flash("error", "Listing You are Trying to access does not exist!")
        res.redirect("/listings");
    }
    // console.log("Listing Data in showListing:", listing); 
    res.render("listing/show.ejs", {listing});
};


module.exports.createListing=async (req, res)=>{

    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
      })
        .send()
        // console.log("Geocoding Response:", JSON.stringify(response.body, null, 2));

    // let {title,description,price, image, location, country} = req.body;
    //or else we can make object ex:listing[title]
        // if (!req.body.listing){
        //     throw new ExpressError(400, "Send valid data for listing")
        // } or
        let url = req.file.path; //extracting uploaded img link and file name
        let filename= req.file.filename;
        
        const newListing = new Listing(req.body.listing);
        // let listing = req.body.listing;
        newListing.owner = req.user._id;
        newListing.image = {url, filename};
        newListing.geometry = response.body.features[0].geometry;

       
        let savedListing = await newListing.save();
        // console.log(savedListing);
        req.flash("success", "New Listing Created!")//they are in key : value frmt
        res.redirect("/listings");
};



module.exports.renderEditForm = async (req, res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    if(!listing){
        req.flash("error", "Listing You are Trying to access does not exist!")
        res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/,w_250")
    res.render("listing/edit.ejs", {listing, originalImageUrl});
};


module.exports.updateListing =  async (req, res)=>{
    if (!req.body.listing){
        throw new ExpressError(400, "Send valid data for listing")
    }
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    if (typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename= req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    
    req.flash("success", "Listing Updated!")
    res.redirect(`/listings/${id}`);
    
};


module.exports.destroyListing=async (req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!")
    res.redirect("/listings");
};