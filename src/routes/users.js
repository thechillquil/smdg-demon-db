var express = require('express');
var router = express.Router();

var userController = require("../controllers/userController");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeAdminPermissions = require("../middleware/authorizeAdminPermissions")

router.get("/", authenticateToken, authorizeAdminPermissions, userController.list);
router.get("/:userName/edit", authenticateToken, authorizeAdminPermissions, userController.edit);
router.get("/new", userController.add);

module.exports = router;
