const querystring = require("querystring");

const demonService = require("../services/demonService");
const config = require("../config");

exports.login = function(req, res) {
    res.render("login");
};

exports.logout = function(req, res) {
    if ("smdg-db-token" in req.cookies) {
        res.cookie("smdg-db-token", "", {
            httpOnly: true,
            secure: config.SMDG_RUNTIME_ENVIRONMENT !== "development",
            expires: new Date(0)
        });
    }
    res.send(JSON.stringify({"status": "success"}));
};

// GET list of all demons
exports.list =  async function(req, res) {
    let demons = await demonService.getAllDemons();
    if ("error" in demons) {
        res.status(404).send("No demons found");
        return;
    }

    res.render("index", { data: demons["demons"], user: req.user });
};

// GET show specific demon by name
exports.details = async function(req, res) {
    let result = await demonService.getDemonByName(req.params.name);
    if ("error" in result) {
        res.send(JSON.stringify(result));
        return;
    }
    res.render("details", { data: result["demon"], user: req.user });
};

// GET edit form for specific demon by name
exports.edit = async function(req, res) {
    let result = await demonService.getDemonByName(req.params.name);
    if ("error" in result) {
        res.send(JSON.stringify(result));
        return;
    }
    let demon = result["demon"];
    let evolution = await demonService.getDemonsByLevelRange(demon.level);
    res.render("edit", { data: demon, evolutionTargets: evolution, user: req.user });
};

exports.add = async function(req, res) {
    let demon = demonService.getNewDemon();
    let evolution = await demonService.getDemonsByLevelRange(0);
    res.render("edit", { data: demon, evolutionTargets: evolution, user: req.user });
};

// POST bulk create demons via JSON file upload
exports.upload = async function(req, res) {
    if (req.file) {
        uploadedObject = JSON.parse(req.file.buffer);
        if (uploadedObject.hasOwnProperty("demons")) {
            demonsToAdd = uploadedObject.demons;
            result = await demonService.bulkCreateDemons(demonsToAdd);
            if ("error" in result) {
                res.send("Error in creating demons");
            } else {
                res.render("uploadComplete", { data: result["data"] });
            }
        } else {
            res.send("No demons in uploaded file.");
        }
    } else {
        res.send("No file uploaded");
    }
};

exports.deleteAllComplete = function(req, res) {
    res.render("deleteAllComplete", { data: req.query.deletedCount });
};
