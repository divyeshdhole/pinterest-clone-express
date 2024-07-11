const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose'); 
const Schema = mongoose.Schema;

// Define the User schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  posts: [ {
    type: Schema.Types.ObjectId,
    ref: 'Post',
  }],
});
userSchema.plugin(passportLocalMongoose);

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
