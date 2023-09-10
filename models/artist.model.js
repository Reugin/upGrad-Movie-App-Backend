const mongoose = require('mongoose');

const ArtistSchema = mongoose.Schema({
  artistid: Number,
  first_name: String,
  last_name: String,
  wiki_url: String,
  profile_url: String,
  movies: [Object], // This can be modified based on your requirements
});

module.exports = mongoose.model('Artist', ArtistSchema);
