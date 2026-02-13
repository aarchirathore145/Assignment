const dotenv = require("dotenv");

const loadEnvironment = () => {
  dotenv.config();
};

const getServerPort = () => Number(process.env.PORT);
const getClientEnv = () => process.env.CLIENT_URL;

module.exports = {
  loadEnvironment,
  getServerPort,
  getClientEnv
};
export {};

