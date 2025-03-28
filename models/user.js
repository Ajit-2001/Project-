const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema ({
    email :{
        type : String,
        required : true
    },

});



userSchema.plugin(passportLocalMongoose);//automatically it adds username , salting, hashing

const User = mongoose.model("User", userSchema);

module.exports = User;