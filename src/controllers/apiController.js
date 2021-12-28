const demonService = require("../services/demonService");
const userService = require("../services/userService");

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
        res.status(400).send("{\"error\": \"No request body\"}");
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

exports.deleteUser = async function(req, res) {
    res.send(await userService.delete(req.params.userName));
}

exports.login = async function(req, res) {
    if (!req.body) {
        res.status(400).send("{\"error\": \"No request body\"}");
        return;
    }
    if (!("userName" in req.body)) {
        res.status(400).send("{\"error\": \"No user name in request body\"}");
        return;
    }
    if (!("password" in req.body)) {
        res.status(400).send("{\"error\": \"No password in request body\"}");
        return;
    }
    let response = await userService.authenticate(req.body.userName, req.body.password);
    if ("error" in response) {
        res.status(401).send(JSON.stringify(response));
        return;
    }
    res.send(JSON.stringify(response));
};

exports.register = async function(req, res) {
    if (!req.body) {
        res.status(400).send("{\"error\": \"No request body\"}");
        return;
    }
    if (!("userName" in req.body)) {
        res.status(400).send("{\"error\": \"No user name in request body\"}");
        return;
    }
    if (!("password" in req.body)) {
        res.status(400).send("{\"error\": \"No password in request body\"}");
        return;
    }
    if (!("email" in req.body)) {
        res.status(400).send("{\"error\": \"No email in request body\"}");
        return;
    }
    let response = await userService.create(req.body);
    if ("error" in response) {
        res.status(400).send(JSON.stringify(response));
        return;
    }
    res.send(JSON.stringify(response));
};

exports.updateUser = async function(req, res) {
    if (!req.body) {
        res.status(400).send("{\"error\": \"No request body\"}");
        return;
    }
    let response = await userService.update(req.params.userName, req.body);
    console.log(response);
    res.send(JSON.stringify(response));
};
