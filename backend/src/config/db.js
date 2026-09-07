const mongoose = require("mongoose");
let connectionPromise;
let listenersAttached = false;

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
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (connectionPromise) return connectionPromise;

  const mongoUri = getMongoUri();

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (!listenersAttached) {
    mongoose.connection.once("connected", () => {
      console.log(`MongoDB connected using ${getMongoEnvName()}`);
    });
    mongoose.connection.on("error", (error) => {
      console.error("MongoDB connection error:", describeMongoError(error));
    });
    mongoose.connection.on("disconnected", () => {
      console.error("MongoDB disconnected");
    });
    listenersAttached = true;
  }

  connectionPromise = mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  }).then(() => mongoose.connection).catch((error) => {
    console.error("MongoDB startup connection failed:", describeMongoError(error));
    connectionPromise = undefined;
    throw error;
  });

  return connectionPromise;
}

module.exports = { connectDB, getMongoUri, getMongoEnvName };
