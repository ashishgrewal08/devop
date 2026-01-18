const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listings.js");
const {isLoggedIn, isOwner, validateListing}=require("../middleware.js");

const listingController=require("../controllers/listings.js")
const multer=require('multer');
const {storage}=require("../cloudconfig.js");
const upload=multer({storage});


router.route("/")
.get(wrapAsync(listingController.index))     //index route
.post(                                       //create route
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
     wrapAsync(listingController.createListing)
    );
     
    //new route
    router.get("/new", isLoggedIn,listingController.renderNewForm);

    router.route("/:id")
    .get(wrapAsync(listingController.showListing))    //show route
    .put(                                             //edit and update
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
     wrapAsync(listingController.updateListing))
     .delete(                                         //delete
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing));

    router.get("/health", (req, res) => {
  res.status(200).send("OK");
});

module.exports = router;

//Edit route
router.get(
    "/:id/edit", 
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditForm));

module.exports=router;