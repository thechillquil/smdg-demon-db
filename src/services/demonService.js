var Demon = require("../models/demon");

exports.getAllDemons = async function getDemons() {
    let demons = await Demon.find().sort({level: "asc", name: "asc"}).populate({
        path: "evolvesToReference", select: "displayName name"
    }).lean();
    if (demons === null) {
        return { "error": "No demons found" };
    }
    return { "status": "success", "demons": JSON.parse(JSON.stringify(demons)) };
};

exports.getDemonByName = async function findDemon(name) {
    return await Demon.findOne({name: name}).lean();
};

exports.getEvolutionTargets = async function getEvolutions(level) {
    return await Demon.find({level: {$gt: level}}, "name displayName level").sort({level: "asc", name: "asc"}).lean();
};

exports.createDemon = async function createDemon(demonToCreate) {
    return await addNewDemon(demonToCreate);
};

exports.bulkCreateDemons = async function(demonsToAdd) {
    console.log("Adding " + demonsToAdd.length + " demons");
    added = 0;
    await Promise.all(demonsToAdd.map(async (demonToAdd) => {
        result = await addNewDemon(demonToAdd);
        if ("status" in result && result["status"] == "success") {
            added++;
        }
    }));
    return { "status": "success", "data": added };
};

exports.deleteAllDemons = async function() {
    let deleted = await Demon.deleteMany({});
    return { "status": "success", "data": deleted.deletedCount };
};

exports.updateDemon = async function(demonName, demonData) {
    let demon = await Demon.findOneAndUpdate({name:demonName}, demonData);
    if (demon == null) {
        return { "error": "Demon " + demonName + " not found" };
    } else {
        return { "status": "success" };
    }
};

async function addNewDemon(demonToAdd) {
    try {
        let demon = new Demon(demonToAdd);
        console.log("creating " + demon.name);
        if (demon.name === "") {
            return { "error": "New demon not created: Empty demon name."};
        }
        existingDemons = await Demon.find({name: demon.name});
        let exists = existingDemons.length !== 0;
        if (exists) {
            return { "error": "Demon '" + demon.name + "' already exists." };
        } else {
            await demon.save();

            return { "status": "success" };
        }
    } catch (err) {
        return { "error": "New demon not created - " + err };
    }
};