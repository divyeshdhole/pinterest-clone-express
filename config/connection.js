const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pinterestDB');
module.exports = mongoose.connection;