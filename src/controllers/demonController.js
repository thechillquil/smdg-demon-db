const querystring = require("querystring");

const demonService = require("../services/demonService");

// GET list of all demons
exports.list =  async function(req, res) {
    let demons = await demonService.getAllDemons();
    if ("error" in demons) {
        res.status(404).send("No demons found");
        return;
    }

    res.render("index", { data: demons["demons"] });
};

// GET show specific demon by name
exports.details = async function(req, res) {
    let result = await demonService.getDemonByName(req.params.name);
    if ("error" in result) {
        res.send(JSON.stringify(result));
        return;
    }
    res.render("details", { data: result["demon"] });
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
    res.render("edit", {data: demon, evolutionTargets: evolution});
};

exports.default = async function(req, res) {
    let demon = demonService.getNewDemon();
    let evolution = await demonService.getDemonsByLevelRange(0);
    res.render("edit", {data: demon, evolutionTargets: evolution});
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
