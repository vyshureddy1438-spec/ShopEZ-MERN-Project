const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`In-Memory MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to In-Memory MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
