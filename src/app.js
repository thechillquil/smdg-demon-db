// Set up global modules for express.js
const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Get global configuration
const config = require("./config");

// Set up paths for static files
app.use("/public", express.static(path.join(__dirname, "public")));

// Set up routes for modules
const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");
const compendiumRouter = require("./routes/compendium");
const userRouter = require("./routes/users");

app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/compendium", compendiumRouter);
app.use("/users", userRouter);

// Set up database connection
const mongodb = config.SMDG_MONGODB_URI;
const mongoose = require("mongoose");
mongoose.connect(mongodb, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Set up views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Start server listening
const port = config.SMDG_PORT || 3000;
app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`)
});
