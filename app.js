if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("./models/user.js");
const generateRandomUsername = require('./utils/generateUsername');

const wishlistRoutes = require("./routes/wishlist");
const userRoutes = require("./routes/user.js")
const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const bookingRoutes = require("./routes/booking.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const dbUrl = process.env.ATLAS_URL;
main().then(() => {
    console.log("Connected to database");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});
store.on("error",()=>{
    console.log("error in mongo store", err)
});

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true
    },
};

app.use(session(sessionOptions));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(
  { usernameField: 'email' },
  User.authenticate()
));

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: 'http://localhost:8080/auth/google/callback'
  },
   async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value;

      if (!email) {
        return done(new Error('No email found from Google account.'));
      }

      let user = await User.findOne({ email });

      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email: email,
          username: generateRandomUsername(profile.displayName),
          name: profile.displayName,
          profilePicture: profile.photos?.[0]?.value,
        });
      } else if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// Routes
app.use("/listing", listingRoutes);
app.use("/listing/:id/reviews", reviewRoutes);
app.use("/", userRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/bookings", bookingRoutes);

app.get("/", wrapAsync(async (req, res) => {
  try {
    const allListings = await Listing.find({});

    const handpickedListings = allListings.slice(0, 8);  // first 8
    const hiddenGemListings = allListings.slice(8, 16); // next 8
    const trendingListings = allListings.slice(16, 24);

    res.render("./listings/index.ejs", { handpickedListings, hiddenGemListings, trendingListings });
  } catch (e) {
    console.error("Error loading homepage listings", e);
    res.status(500).send("Server Error");
  }
}));

// Error Handlers
app.all("*", (req, res, next) => next(new ExpressError(404, "Page not found")));
app.use((err, req, res, next) => {
    if (res.headersSent) return next(err);
    res.render("error.ejs", { err });
});

app.listen(8080, () => console.log("App listening on port 8080"));