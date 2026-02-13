import type { Application } from "express";
import type { Server } from "http";

const databaseInstance = require("../config/database");

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

const startServer = async (app: Application, port: number) => {
  try {
    console.log("Starting Notes Application server");
    await databaseInstance.connect();

    const server: Server = app.listen(port, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
      console.log(`API URL: http://localhost:${port}`);
    });

    server.on("error", (error: unknown) => {
      console.error("Server error:", getErrorMessage(error));
      process.exit(1);
    });

    process.on("SIGTERM", async () => {
      console.log("SIGTERM received. Closing server.");
      server.close(async () => {
        await databaseInstance.disconnect();
        process.exit(0);
      });
    });

    process.on("SIGINT", async () => {
      console.log("SIGINT received. Closing server.");
      server.close(async () => {
        await databaseInstance.disconnect();
        process.exit(0);
      });
    });
  } catch (error: unknown) {
    console.error("Failed to start server:", getErrorMessage(error));
    process.exit(1);
  }
};

module.exports = {
  startServer
};
export {};

