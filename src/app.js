const express = require('express');
const app = express();
const port = 3000;

const config = require('./config');
var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");
var compendiumRouter = require("./routes/compendium");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use("/public", express.static("./public"));

app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/compendium", compendiumRouter);

var mongoose = require("mongoose");
const { urlencoded } = require('express');
var mongodb = config.SMDG_MONGODB_URI;
mongoose.connect(mongodb, {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.set('view engine', 'ejs');

app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`)
});
