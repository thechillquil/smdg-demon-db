var express = require('express');
var router = express.Router();
const multer = require("multer");
const uploader = multer({ storage: multer.memoryStorage({}) });

var demon_controller = require("../controllers/demonController");

router.get("/", demon_controller.list);

router.get("/demon/:name", demon_controller.details);

router.post("/demon", demon_controller.create);

router.post("/demon/:name/delete", demon_controller.delete);

router.post("/demon/:name/update", demon_controller.update);

router.post("/demon/upload", uploader.single('uploadFile'), demon_controller.upload);

router.get("/demons/deleteall", demon_controller.purge);

module.exports = router;
