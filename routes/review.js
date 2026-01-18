const express=require("express");
const router=express.Router({mergeParams:true}); //app.js se link karte 
// hai toh app.js me common prefix of the route is written if we want 
// id here but id is written in the route in app.js thus we use this 
// to solve that problem.

const wrapAsync=require("../utils/wrapAsync.js");
const Review=require("../models/review.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");




//reviews
//post route
router.post("/", isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports=router;