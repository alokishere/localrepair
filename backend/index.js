const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = require("./src/app");
const { connectDB } = require("./src/config/db");

const PORT = Number(process.env.PORT) || 3001;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed because MongoDB is unavailable.");
    process.exit(1);
  }
}

async function shutdown(signal) {
  console.log(`${signal} received; closing MongoDB connection`);
  await mongoose.connection.close();
  process.exit(0);
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

startServer();
