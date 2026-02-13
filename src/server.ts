const { createApp } = require("./app");
const { loadEnvironment, getServerPort } = require("./config/environment");
const { startServer } = require("./bootstrap/startServer");

loadEnvironment();

const app = createApp();
const port = getServerPort();

startServer(app, port);

module.exports = app;
export {};

