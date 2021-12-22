var express = require('express');
var router = express.Router();

var demonController = require("../controllers/demonController");

router.get("/demons", demonController.all);

router.get("/demon/:name", demonController.retrieve);

router.post("/demon", demonController.create);

router.put("/demon/:name", demonController.update);

router.delete("/demon/:name", demonController.delete);

router.delete("/demons", demonController.purge);

module.exports = router;
