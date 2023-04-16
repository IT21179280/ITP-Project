const mongoose = require('mongoose');

/**
 * Connect to MongoDB using the connection string in the environment.
 * Exits with a readable message when the connection cannot be established,
 * which is easier to debug than an unhandled promise rejection.
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || !uri.trim()) {
    console.error(
      '\n[MongoDB] MONGO_URI is not set. Copy backend/.env.example to backend/.env ' +
        'and paste your MongoDB Atlas connection string.\n'
    );
    process.exit(1);
  }

  try {
    const connection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 15000,
    });

    console.log(
      `[MongoDB] Connected to ${connection.connection.host}/${connection.connection.name}`
    );
  } catch (error) {
    console.error(`[MongoDB] Connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
