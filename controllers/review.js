const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
  const { id } = req.params; // id of the listing being reviewed
  const listing = await Listing.findById(id);

  const newReview = new Review({
    rating: req.body.review.rating,
    comment: req.body.review.comment,
    author: req.user._id,
    listingId: listing._id 
  });

  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();

  req.flash("success", "Review added!");
  res.redirect(`/listing/${id}`);
};
module.exports.deleteReview = async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully!");
    res.redirect(`/listing/${id}`);
}