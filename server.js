const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 8085;

// Import the models and db URL
const dbConfig = require('./config/db.config');
const mongoose = require('mongoose'); // Import Mongoose

// Middleware
app.use(cors());
app.use(express.json());


// Use the response wrapper middleware
// Import the response wrapper middleware
const responseWrapper = require('./common/responseWrapper');
app.use(responseWrapper);

// Import and use the routes
const movieRoutes = require('./routes/movie.routes');
const genreRoutes = require('./routes/genre.routes');
const artistRoutes = require('./routes/artist.routes');
const userRoutes = require('./routes/user.routes');

// Define routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Upgrad Movie booking application development.' });
});

// Connect to the MongoDB database
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });


// Use the imported routes
app.use('/api', movieRoutes);
app.use('/api', genreRoutes);
app.use('/api', artistRoutes);
app.use('/api', userRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
