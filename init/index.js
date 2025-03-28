const mongoose= require("mongoose");
const initData = require("./data");
const Listing = require('../models/listing.js');

let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"

main().then(()=>{
    console.log("connected to DB")
}).catch((err)=>{
    console.log(err)
})

async function main () {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({})
    initData.data =initData.data.map((obj)=>({
        ...obj, owner:'67e16d6531aa7ee5c6fd15c4'
    }))
    await Listing.insertMany(initData.data)
    console.log("Data was initialized")
    console.log(initData.data);
}

initDB();