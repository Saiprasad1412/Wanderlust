const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  
  // Support for multiple images
  image:{
      url: String,
      filename: String,
    },

  price: { type: Number, required: true },
  location: { type: String, required: true },
  country: { type: String, required: true  },

  // Link to review documents
  reviews: [{ type: Schema.Types.ObjectId, ref: 'Review' }],
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },

  // Category (added based on your city list)
  category: {
    type: String,
    enum: ['beach', 'mountain', 'city', 'heritage', 'adventure', 'forest'],
  }
});

// Cascade delete associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
