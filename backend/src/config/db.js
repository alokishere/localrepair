const mongoose = require('mongoose');

const getMongoUri = () => process.env.MONGODB_URI || process.env.MONGO_URI;

async function connectDB() {
  const mongoUri = getMongoUri();

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured');
  }

  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
  });

  mongoose.connection.on('error', (error) => {
    console.error('MongoDB connection error:', error.message);
  });

  mongoose.connection.on('disconnected', () => {
    console.error('MongoDB disconnected');
  });

  await mongoose.connect(mongoUri);
  return mongoose.connection;
}

module.exports = { connectDB, getMongoUri };
