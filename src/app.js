const express = require("express");
const app = express();
const port = 3000;
const path = require("path");

const config = require("./config");
const indexRouter = require("./routes/index");
const apiRouter = require("./routes/api");
const compendiumRouter = require("./routes/compendium");
const userRouter = require("./routes/users");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use("/public", express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/compendium", compendiumRouter);
app.use("/users", userRouter);

const mongoose = require("mongoose");
const { urlencoded } = require('express');
const mongodb = config.SMDG_MONGODB_URI;
mongoose.connect(mongodb, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`)
});
