const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Post schema
const postSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  users: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Array,
    default: [],
  },
});

// Create the Post model from the schema
const Post = mongoose.model('Post', postSchema);

module.exports = Post;
