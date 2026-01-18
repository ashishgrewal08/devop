if(process.env.NODE_ENV!="production"){
require('dotenv').config();  
}                

const express=require("express");
const app=express();
const healthRouter = require("./routes/health.js");
const mongoose=require("mongoose");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore=require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const homeRouter = require("./routes/home");




//const MONGO_URL="mongodb://127.0.0.1:27017/greywall"; 
const dbUrl=process.env.ATLASDB_URL;

// main()
// .then(()=>{
//     console.log("connected to DB"); 
// })
// .catch((err)=>{
//     console.log(err);
// });

// async function main(){
//     await mongoose.connect(dbUrl);
// }


if (process.env.NODE_ENV !== "test") {
  main()
    .then(() => {
      console.log("connected to DB");
    })
    .catch((err) => {
      console.log(err);
    });
}
async function main(){
  await mongoose.connect(dbUrl);
}


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded ({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// const store=MongoStore.create({
//     mongoUrl:dbUrl,
//     crypto:{
//         secret:process.env.SECRET,
//     },
//     touchAfter:24*3600,
// });
let store;

if (process.env.NODE_ENV !== "test") {
  store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto:{ secret: process.env.SECRET }
  });
}


// store.on("error",()=>{
//     console.log("ERROR in MONGO SESSION STORE",err);
// });
if (store) {
  store.on("error", (err) => {
    console.log("ERROR in MONGO SESSION STORE", err);
  });
}


const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 1000*60*60*24*7,
        httpOnly:true,
    },
};




app.use("/", healthRouter);   // FIRST middleware
if (process.env.NODE_ENV !== "test") {
  app.use(session(sessionOptions));
}


app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

 

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);
app.use("/", homeRouter);



 
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not Found!")); 
});
//app.all jab route kisi bhi api route se match nahi hoga toh yaha
//  aayega aur yaha se hum send kardenge ki 404 not found

app.use((err, req, res, next)=>{ 
    let{statusCode=500,message="Something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{err});
    //res.status(statusCode).send(message);
     
});

module.exports = app;


 