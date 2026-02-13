import type { Connection } from "mongoose";

const mongoose = require("mongoose");

type DatabaseConnectionType = {
  connection: () => Connection | null;
  connect: () => Promise<Connection>;
  getConnection: () => Connection | null;
  disconnect: () => Promise<void>;
};

class DatabaseConnection implements DatabaseConnectionType {
  connection: Connection | null;

  constructor() {
    this.connection = null;
  }

  async connect() {
    if (this.connection) {
      console.log("Using existing database connection");
      return this.connection;
    }

    try {
      const mongooseConnection = await mongoose.connect(process.env.MONGODB_URI);
      this.connection = mongooseConnection.connection;

      console.log(`MongoDB connected: ${this.connection.host}`);
      console.log(`Database: ${this.connection.name}`);

      this.connection.on("error", (error: unknown) => {
        console.error("MongoDB connection error:", error);
      });

      this.connection.on("disconnected", () => {
        console.log("MongoDB disconnected");
      });

      return this.connection;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      console.error("Database connection failed:", message);
      process.exit(1);
    }
  }

  getConnection() {
    return this.connection;
  }

  async disconnect() {
    if (this.connection) {
      await mongoose.disconnect();
      this.connection = null;
      console.log("Database disconnected");
    }
  }
}

const databaseInstance = new DatabaseConnection();

module.exports = databaseInstance;
export {};

