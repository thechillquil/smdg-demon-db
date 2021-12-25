var express = require('express');
var router = express.Router();

var apiController = require("../controllers/apiController");

router.get("/demons", apiController.all);

router.get("/demon/:name", apiController.retrieve);

router.post("/demon", apiController.create);

router.put("/demon/:name", apiController.update);

router.delete("/demon/:name", apiController.delete);

router.delete("/demons", apiController.purge);

module.exports = router;
