var express = require('express');
var router = express.Router();
const multer = require("multer");
const uploader = multer({ storage: multer.memoryStorage({}) });
const tokenAuthentication = require("../middleware/tokenAuthentication");
const userValidation = require("../middleware/userValidation");

var demonController = require("../controllers/demonController");

router.get("/", tokenAuthentication, demonController.list);

router.post("/", tokenAuthentication, demonController.list);

router.get("/demon/new", tokenAuthentication, userValidation, demonController.add);

router.get("/demon/:name", tokenAuthentication, demonController.details);

router.get("/demon/:name/edit", tokenAuthentication, userValidation, demonController.edit);

router.post("/demon/upload", tokenAuthentication, userValidation, uploader.single('uploadFile'), demonController.upload);

router.get("/demons/deleteall", tokenAuthentication, userValidation, demonController.deleteAllComplete);

router.get("/login", demonController.login);

router.put("/logout", demonController.logout);

module.exports = router;
