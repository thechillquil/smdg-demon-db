var Demon = require("../models/demon");

var demonService = require("../services/demonService");

// GET list of all demons
exports.all =  async function(req, res) {
    let demons = await demonService.getAllDemons();
    if ("error" in demons) {
        res.status(404).send("No demons found");
        return;
    }

    res.send(demons["demons"]);
};

// GET specific demon by name
exports.retrieve = async function(req, res) {
    let demon = await(findDemon(req.params.name));
    if (demon == null) {
        res.status(404).send("{\"error\": \"Demon " + req.params.name + " not found\"}");
    } else {
        res.send(JSON.stringify(demon));
    }
};

// POST create new demon
exports.create = async function(req, res) {
    try {
        let demon = new Demon(req.body);
        if (demon.name === "") {
            res.status(400).send("{\"error\": \"New demon not created: Empty demon name.\"}");
        }
        let exists = (await Demon.find({name: req.body.name})) !== null;
        if (exists) {
            res.status(400).send("{\"error\": \"Demon '" + req.body.name + "' already exists.\"}");
        } else {
            await demon.save();
            res.send("{\"status\": \"successful\"}");
        }
    } catch (err) {
        res.status(400).send("{\"error\": \"New demon not created\"}");
    }
};

// DELETE delete demon
exports.delete = async function(req, res) {
    await Demon.findOneAndDelete({name: req.params.name});
    res.send("{\"status\": \"successful\"}");
};

// PUT update demon
exports.update = async function(req, res) {
    if (!req.body) {
        res.status(400).send("{\"error\": \"No request body\"}")
    }
    let demon = await Demon.findOneAndUpdate({name:req.params.name}, req.body);
    if (demon == null) {
        res.status(404).send("{\"error\": \"Demon " + req.params.name + " not found\"}");
    } else {
        res.send("{\"status\": \"successful\"}");
    }
};

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
    let demon = await(findDemon(req.params.name));
    if (demon == null) {
        res.send("Demon " + req.params.name + " not found");
    } else {
        res.render("details", {data: demon});
    }
};

// GET edit form for specific demon by name
exports.edit = async function(req, res) {
    let demon = await(findDemon(req.params.name));
    if (demon == null) {
        res.send("Demon " + req.params.name + " not found");
    } else {
        let evolution = await(getEvolutions(demon.level));
        res.render("edit", {data: demon, evolutionTargets: evolution});
    }
};

exports.default = async function(req, res) {
    let demon = new Demon();
    let evolution = await(getEvolutions(0));
    res.render("edit", {data: demon, evolutionTargets: evolution});
}

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

// POST build delete all demons
exports.purge = async function(req, res) {
    // let result = await demonService.deleteAllDemons();
    // console.log(result);
    // if ("error" in result) {
    //     res.send("An error occurred deleting all demons");
    //     return;
    // } else {
    //     console.log("should render me: " + result["data"]);
    // }
    // res.render("deleteAllComplete", { data: result["data"] });
    let deleted = await Demon.deleteMany({});
    res.render("deleteAllComplete", { data: deleted.deletedCount });
};

async function findDemon(name) {
    return await Demon.findOne({name: name}).lean();
};

async function getEvolutions(level) {
    return await Demon.find({level: {$gt: level}}, "name displayName level").sort({level: "asc", name: "asc"}).lean();
};
