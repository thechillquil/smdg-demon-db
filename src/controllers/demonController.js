var Demon = require("../models/demon");

// GET list of all demons
exports.all =  async function(req, res) {
    let demons = await getDemons({});
    res.send(JSON.stringify(demons));
};

// GET specific demon by name
exports.retrieve = async function(req, res) {
    let demon = await(findDemon(req.params.name));
    if (demon == null) {
        res.send("{\"error\": \"Demon " + req.params.name + " not found\"}");
    } else {
        res.send(JSON.stringify(demon));
    }
};

// POST create new demon
exports.create = function(req, res) {
    res.send("NOT YET IMPLMENTED: Create demon");
};

// DELETE delete demon
exports.delete = function(req, res) {
    res.send("NOT YET IMPLMENTED: Delete demon " + req.params.name);
};

// PUT update demon
exports.update = function(req, res) {
    res.send("NOT YET IMPLEMENTED: Update demon: " + req.params.name);
};

// GET list of all demons
exports.list =  async function(req, res) {
    let demons = await getDemons({});
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
exports.edit = function(req, res) {
    res.send("NOT YET IMPLMENTED: Demon details for " + req.params.name);
};

// POST edit form for specific demon by name
exports.commit = function(req, res) {
    res.send("NOT YET IMPLMENTED: Demon details for " + req.params.name);
};

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
    let deleted = await deleteAllDemons();
    res.render("deleteAllComplete", { data: deleted.deletedCount });
};

async function getDemons(filter) {
    return await Demon.find(filter).sort({level: "asc", name: "asc"}).lean();
};

async function findDemon(name) {
    return await Demon.findOne({name: name}).lean();
}

async function createDemon(demonToCreate) {
    await Demon.create(demonToCreate, function(err, demon) {
        if (err) return handleError(err);
    });
}

async function deleteAllDemons() {
    return await Demon.deleteMany({});
}