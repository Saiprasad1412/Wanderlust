const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middelware.js");
const userController = require("../controllers/user.js")

router.route("/signup")
    .get(wrapAsync(userController.signupPage))
    .post(wrapAsync(userController.signup));

router.route("/login")
    .get(saveRedirectUrl, wrapAsync(userController.loginPage))
    .post(passport.authenticate('local',
        { failureRedirect: "/login", failureFlash: true }),wrapAsync(userController.login));

router.get("/logout", wrapAsync(userController.logout));
router.get("/contact", wrapAsync(userController.contact));
router.get("/about", wrapAsync(userController.about));

router.post("/profile/update", wrapAsync(userController.profileEdit));

// Store the intended URL before redirecting to Google
 router.get('/auth/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback route
router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
   wrapAsync(userController.googleAuth)); 
  
module.exports = router;

