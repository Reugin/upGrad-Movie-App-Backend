const mongoose = require('mongoose');


const showSchema = new mongoose.Schema({
  id: Number,
  theatre: {
    name: String,
    city: String,
  },
  language: String,
  show_timing: Date,
  available_seats: Number,
  unit_price: Number,
});

const MovieSchema = mongoose.Schema({
  movieid: { type: String, unique: true }, // Add unique constraint to movieid field
  title: String,
  published: Boolean,
  released: Boolean,
  poster_url: String,
  release_date: String,
  publish_date: String,
  artists: [Object],
  genres: [String],
  duration: Number,
  critic_rating: Number,
  trailer_url: String,
  wiki_url: String,
  story_line: String,
  shows: [
    showSchema
  ],
});

// Add the auto-increment plugin to the schema
module.exports = mongoose.model('Movie', MovieSchema);
