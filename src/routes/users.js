var express = require('express');
var router = express.Router();

var userController = require("../controllers/userController");
const tokenAuthentication = require("../middleware/tokenAuthentication");

router.get("/", tokenAuthentication, userController.list);
router.get("/:userName/edit", tokenAuthentication, userController.edit);
router.get("/new", userController.add);

module.exports = router;
