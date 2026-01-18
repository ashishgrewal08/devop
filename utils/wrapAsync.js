function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(next);
    }
}
module.exports=wrapAsync;
//it is the function to use instead of the try and catch blocks