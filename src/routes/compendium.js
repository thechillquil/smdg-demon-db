const express = require('express');
const router = express.Router();
const multer = require("multer");
const uploader = multer({ storage: multer.memoryStorage({}) });
const authenticateToken = require("../middleware/authenticateToken");
const authorizeEditPermissions = require("../middleware/authorizeEditPermissions");

const demonController = require("../controllers/demonController");

router.get("/", authenticateToken, demonController.list);

router.post("/", authenticateToken, demonController.list);

router.get("/demon/new", authenticateToken, authorizeEditPermissions, demonController.add);

router.get("/demon/:name", authenticateToken, demonController.details);

router.get("/demon/:name/edit", authenticateToken, authorizeEditPermissions, demonController.edit);

router.post("/demons/upload", authenticateToken, authorizeEditPermissions, uploader.single('uploadFile'), demonController.upload);

router.get("/demons/download", authenticateToken, authorizeEditPermissions, demonController.download);

router.get("/demons/deleteall", authenticateToken, authorizeEditPermissions, demonController.deleteAllComplete);

router.get("/demons/fusion", authenticateToken, authorizeEditPermissions, demonController.fuse);

module.exports = router;
