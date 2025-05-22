const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const User = require("../models/user");

// Middleware to check if user is logged in
const { isLogedIn } = require("../middelware.js");

// Add to wishlist
router.post("/:id", isLogedIn, async (req, res) => {
    const listingId = req.params.id;
    const user = await User.findById(req.user._id);

    // Avoid duplicates
    if (!user.wishlist.includes(listingId)) {
        user.wishlist.push(listingId);
        await user.save();
    }
    res.redirect("back");
});

// Remove from wishlist
router.delete("/:id", isLogedIn, async (req, res) => {
    const listingId = req.params.id;
    await User.findByIdAndUpdate(req.user._id, {
        $pull: { wishlist: listingId }
    });
    res.redirect("back");
});

// ✅ Show user's wishlist
router.get("/", isLogedIn, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("wishlist");
        res.render("./listings/wishlist.ejs", { listings: user.wishlist });
    } catch (err) {
        console.error("Error fetching wishlist:", err);
        res.redirect("/listings");
    }
});


module.exports = router;
