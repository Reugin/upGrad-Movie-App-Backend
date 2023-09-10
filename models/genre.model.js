const mongoose = require('mongoose');

const GenreSchema = mongoose.Schema({
  genreid: Number,
  genre: String,
});

module.exports = mongoose.model('Genre', GenreSchema);
