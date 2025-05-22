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
};

module.exports.loginPage = (req,res)=>{
    res.render("./user/login.ejs");
};

module.exports.contact = async(req,res)=>{
    res.render("./listings/contact.ejs",{ user: req.user || null });
};
module.exports.about = async(req,res)=>{
    res.render("./listings/about.ejs");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome Back To Your Account!");
    const redirectUrl = req.session.redirectUrl || "/listing";
    delete req.session.redirectUrl;
    res.redirect(redirectUrl);
};

module.exports.logout = (req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are loged out!");
        res.redirect("/listing");
    });
};

module.exports.googleAuth = async (req, res) => {
  req.flash("success", "Successfully logged in with Google!");
  const redirectUrl = req.session.redirectUrl || "/listing";
  delete req.session.redirectUrl;
  res.redirect(redirectUrl);
};

module.exports.profileEdit = async (req,res)=>
    {
  try {
    const userId = req.user._id;
    const { username, bio } = req.body;

    // Check if the username is taken by someone else
    const existingUser = await User.findOne({ username });

    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      req.flash("error", "Username is already taken.");
      return res.redirect(req.get("Referrer") || "/");
    }

    // Update the user's username and bio
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, bio },
      { new: true } // returns updated user
    );

    // Update req.user so res.locals.currUser is fresh
    req.user = updatedUser;

    req.flash("success", "Profile updated successfully.");
    res.redirect(req.get("Referrer") || "/");
  } catch (err) {
    console.error("Error updating profile:", err);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect(req.get("Referrer") || "/");
  }
};
