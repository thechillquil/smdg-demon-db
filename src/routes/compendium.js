var express = require('express');
var router = express.Router();
const multer = require("multer");
const uploader = multer({ storage: multer.memoryStorage({}) });

var demonController = require("../controllers/demonController");

router.get("/", demonController.list);

router.get("/demon/new", demonController.default);

router.get("/demon/:name", demonController.details);

router.get("/demon/:name/edit", demonController.edit);

router.post("/demon/upload", uploader.single('uploadFile'), demonController.upload);

router.get("/demons/deleteall", demonController.deleteAllComplete);

module.exports = router;
