const mongoose =require("mongoose");
const Schema=mongoose.Schema; 
const Review=require("./review.js");
 const listingSchema=new Schema({
    title: {
      type:String,
      required:true,   
    },
    description: {
      type: String,
    },
    image: {
       url: String,
       filename: String,
    }, 
    price: {
      type: Number,
    },
    location: {
      type: String,
    },
    country: {
      type: String,
    },
    reviews:[
      {
        type:Schema.Types.ObjectId,
        ref:"Review", 
      },
    ],
    owner:{
      type:Schema.Types.ObjectId,
      ref:"User",
    },
    
 });

 //this is mongoose middleware for the case when we delete the listing
 //  then the reviews in listings will be deleted but reviews in the 
 // collection "reviews will not be deleted, thus to delete from there 
 // also we use this middleware"
 listingSchema.post("findByIdAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
 });

 const Listing=mongoose.model("Listing",listingSchema);
 module.exports=Listing;