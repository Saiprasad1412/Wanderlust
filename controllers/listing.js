const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const Booking = require("../models/booking.js");

module.exports.listing = async (req, res) => {
  const { search, sort, maxPrice, category } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { city: new RegExp(search, "i") },
      { tags: new RegExp(search, "i") },
      { title: new RegExp(search, "i") }
    ];
  }

  if (maxPrice) {
    filter.price = { $lte: parseInt(maxPrice) };
  }

  if (category) {
    filter.category = category;
  }

  let sortOption = {};
  if (sort === "price_asc") sortOption.price = 1;
  else if (sort === "price_desc") sortOption.price = -1;
  else if (sort === "rating") sortOption.rating = -1;
  else if (sort === "newest") sortOption._id = -1;

  const allListings = await Listing.find(filter).sort(sortOption);

const categories = [
  {
    name: "🏖️ Beach Escapes",
    _id: "beach",
    listings: allListings.filter(l => l.category === 'beach').slice(0, 10)
  },
  {
    name: "⛰️ Mountain Retreats",
    _id: "mountain",
    listings: allListings.filter(l => l.category === 'mountain').slice(0, 10)
  },
  {
    name: "🏙️ City Views",
    _id: "city",
    listings: allListings.filter(l => l.category === 'city').slice(0, 10)
  },
  {
    name: "🏛️ Heritage Spots",
    _id: "heritage",
    listings: allListings.filter(l => l.category === 'heritage').slice(0, 10)
  },
  {
    name: "🧗 Adventure Escapes",
    _id: "adventure",
    listings: allListings.filter(l => l.category === 'adventure').slice(0, 10)
  },
  {
    name: "🌲 Forest Retreats",
    _id: "forest",
    listings: allListings.filter(l => l.category === 'forest').slice(0, 10)
  }
];

  res.render("listings/listing.ejs", { categories, allListings });
};

module.exports.create = async (req, res) => {
  res.render("./listings/new.ejs");
}

module.exports.addListing = async (req, res) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listing");
}

module.exports.show = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist!");
    res.redirect("/listing");
  }
  res.render("./listings/show.ejs", { listing });
}

module.exports.edit = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for doesn't exist!");
    res.redirect("/listing");
  }
  res.render("./listings/edit.ejs", { listing });
}

module.exports.update = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listing/${id}`);
}

module.exports.delete = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted Sucessfully!");
  res.redirect("/listing");
}


module.exports.suggestions = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.length < 2) {
      return res.json([]); // Return empty array for short queries
    }

    const regex = new RegExp(query, 'i'); // case-insensitive regex
    const listings = await Listing.find({
      $or: [
        { title: regex },
        { location: regex },
        { category: regex },
        { description: regex }
      ]
    })
      .select('_id title location') // limit fields
      .limit(7); // limit results for performance

    res.json(listings);
  } catch (err) {
    console.error('Error fetching suggestions:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports.myListings = async (req, res) => {
  const listings = await Listing.find({ owner: req.user._id });
  res.render("user/mylistings", { listings });
};

module.exports.myReviews = async (req, res) => {
  const reviews = await Review.find({ author: req.user._id })
    .populate("listingId");
  res.render("user/myreviews", { myReviews: reviews });
};

module.exports.myBookings = async (req, res) => {
  const myBookings = await Booking.find({ user: req.user._id })
    .populate('listing')
    .lean();

  myBookings.forEach(booking => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    booking.startDateFormatted = new Date(booking.startDate).toLocaleDateString('en-IN', options);
    booking.endDateFormatted = new Date(booking.endDate).toLocaleDateString('en-IN', options);
  });
  res.render('user/myBookings', { myBookings });

};
