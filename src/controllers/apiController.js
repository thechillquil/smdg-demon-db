const demonService = require("../services/demonService");

// GET list of all demons
exports.all = async function(req, res) {
    let result = await demonService.getAllDemons();
    if ("error" in result) {
        res.status(404).send(JSON.stringify(result));
        return;
    }
    res.send(JSON.stringify(result["demons"]));
};

// GET specific demon by name
exports.retrieve = async function(req, res) {
    let result = await demonService.getDemonByName(req.params.name);
    if ("error" in result) {
        res.status(404).send(JSON.stringify(result));
        return;
    }
    res.send(JSON.stringify(result["demon"]));
};

// POST create new demon
exports.create = async function(req, res) {
    let result = await demonService.createDemon(req.body);
    if ("error" in result) {
        res.status(400).send(JSON.stringify(result));
        return;
    }
    res.send(JSON.stringify(result));
};

// PUT update demon
exports.update = async function(req, res) {
    if (!req.body) {
        res.status(400).send("{\"error\": \"No request body\"}")
    }
    let result = await demonService.updateDemon(req.params.name, req.body);
    if ("error" in result) {
        res.status(404).send(JSON.stringify(result));
        return;
    }
    res.send(JSON.stringify(result));
};

// DELETE delete demon
exports.delete = async function(req, res) {
    res.send(await demonService.deleteDemon(req.params.name));
};

// DELETE delete all demons
exports.purge = async function(req, res) {
    res.send(await demonService.deleteAllDemons());
};
