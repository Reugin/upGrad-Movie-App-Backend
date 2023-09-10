const Genre = require('../models/genre.model');

// Find all genres
exports.findAllGenres = (req, res) => {
  Genre.find()
    .then((genres) => {
      res.sendSuccess({genres:genres});
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};


// function insertGenres (){
//   const genresToInsert = [
//     { "genreid": 1, "genre": "comedy" },
//     { "genreid": 2, "genre": "drama" },
//     { "genreid": 3, "genre": "action" },
//     { "genreid": 4, "genre": "romance" },
//     { "genreid": 5, "genre": "horror" }
//   ];

//   Genre.insertMany(genresToInsert)
//     .then(() => {
//       res.sendSuccess({ message: 'Genres inserted successfully' });
//     })
//     .catch((err) => {
//       res.status(500).json({ message: err.message });
//     });
// };
