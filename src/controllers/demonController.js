var Demon = require("../models/demon");

// GET list of all demons
exports.all =  async function(req, res) {
    let demons = await getDemons();
    console.log(JSON.stringify(demons));
    res.send(JSON.stringify(demons));
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
    let demons = await getDemons();
    res.render("index", { data: demons });
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
exports.upload = function(req, res) {
    if (req.file) {
        uploadedObject = JSON.parse(req.file.buffer);
        if (uploadedObject.hasOwnProperty("demons")) {
            demonsToAdd = uploadedObject.demons;
            console.log("Adding " + demonsToAdd.length + " demons");
            demonsToAdd.forEach(async (demonToAdd )=> {
                console.log("Creating " + demonToAdd.name);
                await createDemon(demonToAdd);
            });
            res.render("uploadComplete", { data: demonsToAdd.length });
        } else {
            res.send("No demons in uploaded file.");
        }
    } else {
        res.send("No file uploaded");
    }
};

// POST build delete all demons
exports.purge = async function(req, res) {
    let deleted = await Demon.deleteMany({});
    res.render("deleteAllComplete", { data: deleted.deletedCount });
};

async function getDemons() {
    return await Demon.find().sort({level: "asc", name: "asc"}).populate({
        path: "evolvesToReference", select: "displayName name"
    }).lean();
};

async function findDemon(name) {
    return await Demon.findOne({name: name}).lean();
};

async function getEvolutions(level) {
    return await Demon.find({level: {$gt: level}}, "name displayName level").sort({level: "asc", name: "asc"}).lean();
};

async function createDemon(demonToCreate) {
    await Demon.create(demonToCreate, function(err, demon) {
        if (err) return handleError(err);
    });
};
