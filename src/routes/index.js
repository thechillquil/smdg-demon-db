var express = require('express');
var router = express.Router();

var indexController = require("../controllers/indexController");

// GET homepage
router.get('/', indexController.index);

router.put("/logout", indexController.logout);

module.exports = router;
