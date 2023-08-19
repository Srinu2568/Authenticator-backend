const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const indexRoutes = require('./routes/homeRoutes/indexRoutes');
const authRoutes = require('./routes/authRoutes/authRoutes');

const { authMiddleware } = require('./middlewares/Authentication');

// Configure path to environment variables file(.env).
dotenv.config({ path: './.env' });

const app = express();
app.use(
  cors({
    origin: '*', // Allow all origins
    methods: '*', // Allow all methods
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Access-Control-Allow-Credentials',
    ],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Auth Routes
app.use('/api/v1/auth', authRoutes);

// Middleware to check if the user is loggedIn or not
// Home routes
app.use('/api/v1', authMiddleware, indexRoutes);

app.get('/healthz', (req, res) => {
  res.status(200).json({ msg: 'Server is up and Running!' });
});

// Mongoose connection and Server startup
const start = async () => {
  try {
    // Connect to mongoose
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 5000,
      socketTimeoutMS: 20000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      w: 'majority',
    });
    console.log('Connected to MongoDB!');
    // start the server
    const port = process.env.PORT || 1476;
    app.listen(
      port,
      () => {
        console.log(`Server is running on port ${port}.`);
      }
    );
  } catch (error) {
    console.error(error);
  }
};

// Start the app.
start();
