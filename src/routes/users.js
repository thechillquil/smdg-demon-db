const express = require('express');
const router = express.Router();

const userController = require("../controllers/userController");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeAdminPermissions = require("../middleware/authorizeAdminPermissions")

router.get("/", authenticateToken, authorizeAdminPermissions, userController.list);
router.get("/:userName/edit", authenticateToken, authorizeAdminPermissions, userController.edit);
router.get("/new", userController.add);

module.exports = router;
