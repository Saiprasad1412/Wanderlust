const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  googleId: { type: String, unique: true, sparse: true },
  username: { type: String, required: true, unique: true },
  bio: String,
  wishlist: [
    {
      type: Schema.Types.ObjectId,
      ref: "Listing"
    }
  ],
  profilePicture: {
    type: String,
  },
}, { timestamps: true });

// Tell passport-local-mongoose to use 'email' as the login field
userSchema.plugin(passportLocalMongoose, {
  usernameField: 'email'
});

module.exports = mongoose.model('User', userSchema);
