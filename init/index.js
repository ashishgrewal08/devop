const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listings.js");
const MONGO_URL="mongodb://127.0.0.1:27017/greywall";
main()
.then(()=>{
    console.log("connected to DB");

})
.catch((err)=>{
    console.log(err);
});


async function main(){
    await mongoose.connect(MONGO_URL);
}


const initDB = async () =>{                 // in our listing schema there is no option for owner because it was 
       await Listing.deleteMany({});               // created in the starting of the project so will adding one 
       initData.data=initData.data.map((obj)=>({   // same owner for all the listings
        ...obj,
        owner:"689fb77e2685967d44843360"
        }));
      await Listing.insertMany(initData.data);
      console.log("data was initialized");

};
initDB();
