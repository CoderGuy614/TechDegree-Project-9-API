"use strict";

//Import Dependencies
const express = require("express");
const morgan = require("morgan");
const routes = require("./routes.js");
const { Sequelize } = require("sequelize");

// Connecting to and authenticating the database
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "fsjstd-restapi.db"
});
console.log("Testing the connection to the database...");
async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected to db successfully...");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
const enableGlobalErrorLogging =
  process.env.ENABLE_GLOBAL_ERROR_LOGGING === "true";

//Instantiating the express app
const app = express();
app.use(express.json());

app.use(morgan("dev"));

//Using the routes file for requests to /api
app.use("/api", routes);
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the REST API project!"
  });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: "Route Not Found"
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

//Setting the port
app.set("port", process.env.PORT || 5000);

//Sync the db and listen on the correct port.
sequelize.sync().then(function() {
  const server = app.listen(app.get("port"), () => {
    console.log(`Express server is listening on port ${server.address().port}`);
  });
});
