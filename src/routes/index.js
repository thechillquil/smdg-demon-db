const express = require('express');
const router = express.Router();

const indexController = require("../controllers/indexController");

// GET homepage
router.get('/', indexController.index);

router.put("/logout", indexController.logout);

module.exports = router;
