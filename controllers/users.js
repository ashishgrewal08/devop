
const User=require("../models/user.js")

module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.signup=async(req,res)=>{
    try{
        let {username, email, password}=req.body;
    const newUser=new User({email, username});
    const registeredUser=await User.register(newUser, password);
    console.log(registeredUser);

    req.login(registeredUser,(err)=>{     //this login is to automatically login after signup
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to GreyWall!");
     res.redirect("/listings");
    });
    
} catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};


module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
};


module.exports.login=async(req,res)=>{
  req.flash("success","Welcome back to GreyWall!");
  let redirectUrl=res.locals.redirectUrl || "/listings"; // if are login from the listing page 
    res.redirect(redirectUrl);                              // then for it if there is no req.locals.redirectUrl will store "/listings"
  
};


module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out!");
        res.redirect("/listings");
    });
};



