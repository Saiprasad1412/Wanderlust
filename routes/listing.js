const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLogedIn, isOwner ,validateListing } = require("../middelware.js");
const listingContoller = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
    .get(wrapAsync(listingContoller.listing))
    .post(
        isLogedIn,
        upload.single("image"),
        validateListing,
        wrapAsync(listingContoller.addListing));

router.get("/create", isLogedIn, wrapAsync(listingContoller.create));
router.get("/mylistings", isLogedIn, wrapAsync(listingContoller.myListings));
router.get("/myreviews", isLogedIn, wrapAsync(listingContoller.myReviews));  
router.get("/mybookings", isLogedIn, wrapAsync(listingContoller.myBookings)); 
router.get('/suggestions', (listingContoller.suggestions))

router.route("/:id")
    .get(wrapAsync(listingContoller.show))
    .put(
        isOwner,
        upload.single("listing[image]"),
        validateListing, 
        wrapAsync(listingContoller.update))
    .delete(isLogedIn,isOwner, wrapAsync(listingContoller.delete));

router.get("/:id/edit", isLogedIn,isOwner, wrapAsync(listingContoller.edit));
router.get("/:id/checkout", isLogedIn, wrapAsync(listingContoller.checkout));

module.exports = router;