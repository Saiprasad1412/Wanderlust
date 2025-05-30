const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    created_at: { type: Date, default: Date.now() },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    listingId: {
        type: Schema.Types.ObjectId,
        ref: "Listing",
        required: true
    }
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;