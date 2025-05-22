const Booking = require("../models/booking");
const Listing = require("../models/listing");
const nodemailer = require("nodemailer");

module.exports.checkout = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.listingId);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }
    res.render("bookings/checkout", { listing, error: null });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

module.exports.createBooking = async (req, res) => {
  try {
    const {
      listingId,
      startDate,
      endDate,
      adults,
      children,
      addons,
      fullName,
      paymentMethod,
      totalPrice,
    } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).send("Listing not found");
    }

    const booking = new Booking({
      listing: listingId,
      user: req.user._id,
      startDate,
      endDate,
      guests: { adults, children },
      addons: Array.isArray(addons) ? addons : [addons],
      fullName,
      paymentMethod,
      totalPrice,
      status: "pending",
    });

    await booking.save();
    res.redirect(`/bookings/confirmation/${booking._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to confirm booking");
  }
};

module.exports.confirmbooking = async (req, res) => {
  try {
    // ✅ Populate both listing and user
    const booking = await Booking.findById(req.params.bookingId)
      .populate("listing")
      .populate("user");

    if (!booking) {
      return res.status(404).send("Booking not found");
    }

    // ✅ Check if user and email exist
    if (!booking.user || !booking.user.email) {
      return res.status(400).send("User email not available for sending confirmation.");
    }

    // ✅ Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: process.env.EMAIL_PASS  // your App Password
      }
    });

    // ✅ Prepare the email
    const mailOptions = {
      from: '"WanderLust" <' + process.env.EMAIL_USER + '>',
      to: booking.user.email,
      subject: "Your Booking is Confirmed!",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Booking Confirmation</h2>
          <p>Hi ${booking.user.name || "Guest"},</p>
          <p>Your booking at <strong>${booking.listing.title}</strong> is confirmed!</p>
          <p><strong>Check-in:</strong> ${new Date(booking.startDate).toDateString()}</p>
          <p><strong>Check-out:</strong> ${new Date(booking.endDate).toDateString()}</p>
          <p>Thank you for choosing WanderLust. We look forward to hosting you!</p>
          <br>
          <p>Best regards,<br>WanderLust Team</p>
        </div>
      `
    };

    // ✅ Send the email
    await transporter.sendMail(mailOptions);

    // ✅ Render confirmation page
    res.render("bookings/confirmation", { booking });

  } catch (err) {
    console.error("Error in confirmbooking:", err);
    res.status(500).send("Server error");
  }
};


module.exports.cancelBooking = async (req, res) => {
  const { id } = req.params;
  const booking = await Booking.findById(id);

  if (!booking) {
    req.flash('error', 'Booking not found.');
    return res.redirect('/listing/mybookings');
  }

  if (!booking.user.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to cancel this booking.');
    return res.redirect('/listing/mybookings');
  }

  await Booking.findByIdAndDelete(id);
  req.flash('success', 'Booking cancelled successfully.');
  res.redirect('/listing/mybookings');
};

