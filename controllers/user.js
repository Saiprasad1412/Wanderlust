const User = require("../models/user.js");

module.exports.signupPage = async (req, res) => {
    res.render("./user/signup.ejs");
}

module.exports.signup = async(req,res)=>{
    try{
        let {email,username,password} = req.body;
        let newUser = new User({email, username});
        let registredUser = await User.register(newUser, password);
        req.login(registredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome To WanderLust");
            return res.redirect("/listing");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}

module.exports.loginPage = (req,res)=>{
    res.render("./user/login.ejs");
}

module.exports.login = async(req,res)=>{
    req.flash("success","Welcome Back To Your Account!");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are loged out!");
        res.redirect("/listing");
    });
}