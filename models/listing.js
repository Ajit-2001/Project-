const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema ({
    title : {
        type:String,
        required:true
    },
    description : String,
    image: {
          filename: String,
          url: String,
        _id: false
      },
      price: {
        type: Number,
        required: true,   // Ensures every listing has a price
        default: 1000        // Prevents null values
    },
    location : String,
    country :String,
    reviews : [
      {
        type: Schema.Types.ObjectId,
        ref : "Review"
      },
    ],
    owner :{
      type : Schema.Types.ObjectId,
      ref : "User"
    },
    geometry : {
      type: {
        type: String, // Don't do `{ location: { type: String } }`
        enum: ['Point'], // 'location.type' must be 'Point'
        required: true
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
})

listingSchema.post("findOneAndDelete", async (listing)=>{
  if(listing) {
    await Review.deleteMany({_id : {$in : listing.reviews}})
  }
})


//model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;