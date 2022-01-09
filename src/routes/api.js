const express = require('express');
const router = express.Router();

const apiController = require("../controllers/apiController");
const authenticateToken = require("../middleware/authenticateToken");
const authorizeEditPermissions = require("../middleware/authorizeEditPermissions");
const authorizeAdminPermissions = require("../middleware/authorizeAdminPermissions");

router.get("/demons", apiController.all);

router.get("/demon/:name", apiController.retrieve);

router.post("/demon", authenticateToken, authorizeEditPermissions, apiController.create);

router.put("/demon/:name", authenticateToken, authorizeEditPermissions, apiController.update);

router.delete("/demon/:name", authenticateToken, authorizeEditPermissions, apiController.delete);

router.delete("/demons", authenticateToken, authorizeEditPermissions, apiController.purge);

router.post("/demons/fusion", authenticateToken, authorizeEditPermissions, apiController.fuse);

router.post("/login", apiController.login);

router.post("/user", apiController.register);

router.put("/user/:userName", authenticateToken, authorizeAdminPermissions, apiController.updateUser);

router.delete("/user/:userName", authenticateToken, authorizeAdminPermissions, apiController.deleteUser);

module.exports = router;
