const express = require("express");
const router = express.Router({ mergeParams: true });
// const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLogedIn, isOwner ,validateListing } = require("../middelware.js");
const listingContoller = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

router.route("/")
    .get(wrapAsync(listingContoller.index))
    .post(
        isLogedIn,
        upload.single("image"),
        validateListing,
        wrapAsync(listingContoller.addListing));

router.get("/create", isLogedIn, wrapAsync(listingContoller.create));

router.route("/:id")
    .get(wrapAsync(listingContoller.show))
    .put(
        isOwner,
        upload.single("listing[image]"),
        validateListing, 
        wrapAsync(listingContoller.update))
    .delete(isLogedIn,isOwner, wrapAsync(listingContoller.delete));

// Edit Route (Form Page)
router.get("/:id/edit", isLogedIn,isOwner, wrapAsync(listingContoller.edit));

module.exports = router;