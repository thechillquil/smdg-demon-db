var express = require('express');
var router = express.Router();

var apiController = require("../controllers/apiController");
const tokenAuthentication = require("../middleware/tokenAuthentication");
const userValidation = require("../middleware/userValidation");

router.get("/demons", apiController.all);

router.get("/demon/:name", apiController.retrieve);

router.post("/demon", tokenAuthentication, userValidation, apiController.create);

router.put("/demon/:name", tokenAuthentication, userValidation, apiController.update);

router.delete("/demon/:name", tokenAuthentication, userValidation, apiController.delete);

router.delete("/demons", tokenAuthentication, userValidation, apiController.purge);

router.post("/login", apiController.login);

router.post("/user/register", apiController.register);

router.delete("/user/:userName", tokenAuthentication, apiController.deleteUser);

module.exports = router;
