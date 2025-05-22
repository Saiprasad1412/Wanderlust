const express = require("express");
const router = express.Router();
const { isLogedIn } = require("../middelware");
const bookingController = require('../controllers/booking');
const wrapAsync = require("../utils/wrapAsync");

// Show checkout form
router.get("/new/:listingId", isLogedIn, wrapAsync(bookingController.checkout));

// Handle form submission
router.post("/checkout", isLogedIn, wrapAsync( bookingController.createBooking));

// Booking confirmation
router.get("/confirmation/:bookingId", isLogedIn, wrapAsync(bookingController.confirmbooking));

// router.post('/checkout', bookingController.createBooking);
router.delete('/:id', isLogedIn, bookingController.cancelBooking);
module.exports = router;
