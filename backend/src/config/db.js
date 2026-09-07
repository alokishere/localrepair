const mongoose = require("mongoose");

const getMongoUri = () => (process.env.MONGODB_URI || process.env.MONGO_URI || "").trim();

const getMongoEnvName = () => process.env.MONGODB_URI ? "MONGODB_URI" : process.env.MONGO_URI ? "MONGO_URI" : null;

function describeMongoError(error) {
  return {
    name: error?.name || "MongoError",
    message: error?.message || "Unknown MongoDB connection error",
    code: error?.code,
  };
}

async function connectDB() {
  const mongoUri = getMongoUri();

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured");
  }

  mongoose.connection.once("connected", () => {
    console.log(`MongoDB connected using ${getMongoEnvName()}`);
  });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", describeMongoError(error));
  });

  mongoose.connection.on("disconnected", () => {
    console.error("MongoDB disconnected");
  });

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  }).catch((error) => {
    console.error("MongoDB startup connection failed:", describeMongoError(error));
    throw error;
  });
  return mongoose.connection;
}

module.exports = { connectDB, getMongoUri, getMongoEnvName };
