var express = require('express');
var router = express.Router();

var demon_controller = require("../controllers/demonController");

router.get("/demons", demon_controller.all);

router.get("/demon/:name", demon_controller.retrieve);

router.post("/demon", demon_controller.create);

router.put("/demon/:name", demon_controller.update);

router.delete("/demon/:name", demon_controller.delete);

module.exports = router;
