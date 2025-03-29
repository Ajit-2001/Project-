if (process.env.NODE_ENV != "production") {
    require("dotenv").config();

}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
app.use(methodOverride("_method"));
const ejsMate = require("ejs-mate");
const ExpressError = require ("./utils/ExpressError.js");



const listingRouter = require ("./routes/listing");
const reviewRouter = require ("./routes/review");


const session = require("express-session");
const MongoStore = require('connect-mongo');

const flash = require("connect-flash");

const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

const userRouter = require("./routes/user");



//to setup ejs
const path = require("path");


const dbUrl = process.env.ATLASDB_URL;


main().then(()=>{
    console.log("connected to DB")
}).catch((err)=>{
    console.log(err)
});

async function main () {
    await mongoose.connect(dbUrl);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "/public")));

app.engine("ejs", ejsMate);



const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto : {
        secret : process.env.SECRET,
    },
    touchAfter : 24*3600,
})

store.on("error", ()=>{
    console.log("Error in mongo session store", err);
});


//express-session
const sessionOptions = {
    store,
    secret :process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true, 
    }
};





app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//creating middleware for flash and session
app.use((req, res, next)=> {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

app.use('/listings', listingRouter);
app.use ('/listings/:id/reviews', reviewRouter);
app.use('/', userRouter);


app.get("/listings/icons"), (req, res)=>{
    res.send("This feature is coming soon! Stay tuned for updates.")
};


app.all("*", (req, res, next) => {
    res.status(404).render("error", { message: "Page Not Found!" });
});



/*Middleware - server side*/
app.use((err,req,res,next)=>{
    let {status = 500, message="Some error occured"}=err;
    console.log(err);
    // res.stutus(status).send(message)
    res.status(status).render("error.ejs", {message})
});


app.listen(8080, ()=>{
    console.log("server is listening to port 8080")
});