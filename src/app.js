const express = require('express');
const app = express();
const port = 3000;

const config = require('./config');
console.log(process.cwd());
var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api");
var compendiumRouter = require("./routes/compendium");

app.use("/", indexRouter);
app.use("/api", apiRouter);
app.use("/compendium", compendiumRouter);

var mongoose = require("mongoose");
var mongodb = config.SMDG_MONGODB_URI;
mongoose.connect(mongodb, {useNewUrlParser: true, useUnifiedTopology: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.set('view engine', 'ejs');

app.listen(port, function() {
  console.log(`Example app listening on port ${port}!`)
});
