require('dotenv').config();

export const environment = {
  mongoConnect: process.env.MONGO_CONNECT,
  port: process.env.PORT,
};
