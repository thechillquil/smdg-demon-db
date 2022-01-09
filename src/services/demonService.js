const Demon = require("../models/demon");

exports.getAllDemons = async function() {
    let demons = await Demon.find()
        .sort({ level: "asc", name: "asc" })
        .populate({ path: "evolvesToReference", select: "displayName name" })
        .lean();
    return { "status": "success", "demons": demons };
};

exports.getDemonByName = async function(name) {
    let demon = await Demon.findOne({name: name}).lean();
    if (demon === null) {
        return { "error": "Demon " + name + " not found" };
    }
    return { "status": "success", "demon": demon };
};

exports.getDemonsByLevelRange = async function(level) {
    return await Demon.find({level: {$gt: level}}, "name displayName level")
        .sort({level: "asc", name: "asc"})
        .lean();
};

exports.getNewDemon = function() {
    return new Demon();
};

exports.createDemon = async function(demonToCreate) {
    return await populateNewDemon(demonToCreate);
};

exports.bulkCreateDemons = async function(demonsToAdd) {
    added = 0;
    await Promise.all(demonsToAdd.map(async (demonToAdd) => {
        result = await populateNewDemon(demonToAdd);
        if ("status" in result && result["status"] == "success") {
            added++;
        }
    }));
    return { "status": "success", "data": added };
};

exports.updateDemon = async function(demonName, demonData) {
    let demon = await Demon.findOneAndUpdate({ name: demonName }, demonData);
    if (demon === null) {
        return { "error": "Demon " + demonName + " not found" };
    } else {
        return { "status": "success" };
    }
};

exports.deleteDemon = async function(name) {
    let result = await Demon.findOneAndDelete({name: name});
    if (result === null) {
        return { "error": "Demon " + name + " does not exist" };
    }
    return { "status": "success" };
}

exports.deleteAllDemons = async function() {
    let deleted = await Demon.deleteMany({});
    return { "status": "success", "data": deleted.deletedCount };
};

exports.getFusionDemons = async function(inputDemonNames, playerLevel, playerArcana, moonPhase) {
    inputDemonNames = inputDemonNames || [];
    playerLevel = playerLevel || 0;
    playerArcana = playerArcana || [];
    moonPhase = moonPhase || 0;

    if (inputDemonNames.length < 2 || inputDemonNames.length > 6) {
        return { error: "Requested fusion with " + inputDemonNames.length + " inputs; only valid for between 2 and 6 inputs" };
    }

    if (playerArcana.length === 0) {
        return { error: "Player must have at least one arcana" };
    }

    let result = {
        demons: [],
        accidentChance: 0,
        affinityIncreases: 0
    };

    const inputDemons = await Demon.find({ name: { $in: inputDemonNames } });

    // Affinity tier increases is based solely on the number of inputs.
    if (inputDemons.length >= 3) {
        result.affinityIncreases = inputDemons.length - 2;
    }
    
    // Examine all input demons, and flag if any are treasure demons,
    // or if there are duplicate arcana in the input.
    inputDemons.every((demon) => {
        if (demon.isTreasure) {
            inputDemons.forEach((demon) => {
                if (!demon.isTreasure) {
                    result.demons.push({
                        name: demon.name,
                        displayName: demon.displayName,
                        level: demon.level,
                        arcana: demon.arcana,
                        skills: demon.skills
                    });
                }
            });
            return false;
        }
        return true;
    });

    // If there are demons in the result at this point, that implies
    // presence of treasure demons, and means the result should be returned
    // immediately.
    if (result.demons.length > 0) {
        return { status: "success", data: result };
    }

    // Examine all input demons, and flag if there are duplicate arcana in the
    // input, return only the list of element demons.
    let hasDuplicateArcana = false;
    let inputArcana = [];
    inputDemons.every((demon) => {
        if (inputArcana.includes(demon.arcana)) {
            hasDuplicateArcana = true;
            return false;
        }
        inputArcana.push(demon.arcana);
        return true;
    });

    // If there are inputs with duplicate arcana, get the element
    // demons and the result should be returned immediately.
    if (hasDuplicateArcana) {
        const elementDemons = await Demon.find({ isElement: true });
        elementDemons.forEach((demon) => {
            result.demons.push({
                name: demon.name,
                displayName: demon.displayName,
                level: demon.level,
                arcana: demon.arcana,
                skills: demon.skills
            });
        });

        // NOTE: Affinity tier increasee must be set to zero, regardless
        // of the number of inputs when returning element demons.
        result.affinityIncreases = 0;
        return { status: "success", data: result };
    }

    const specialArcana = ["Councillor", "Faith", "Fool", "Hunger", "World"];
    let specialArcanaBonus = 0;
    if (moonPhase > 0) {
        specialArcanaBonus += 5;
    }
    if (inputDemons.length >= 3) {
        specialArcanaBonus += 5;
    }

    // Find demons eligible for fusion meeting the appropriate criteria:
    // Demon is NOT a treasure demon
    // AND Demon arcana is NOT in the set of arcana for input demons
    // AND Demon level is:
    //    less than or equal to the player level;
    //    OR less than or equal to the player level + 5 if the demon arcana is in the set of the player's arcana
    //    OR less than or equal to the player level + the special arcana bonus if the demon arcana is a demon-only arcana
    let filterDemons = await Demon.find({ 
        $and: [
            {
                isTreasure: false,
            },
            {
                arcana: {
                    $not: {
                        $in: inputArcana
                    }
                }        
            },
            {
                $or: [
                    {
                        level: { $lte: playerLevel }
                    },
                    {
                        arcana: { $in: playerArcana },
                        level: { $lte: playerLevel + 5 }
                    },
                    {
                        arcana: { $in: specialArcana },
                        level: { $lte: playerLevel + specialArcanaBonus }
                    }
                ]
            }
        ]
    }).sort({ level: "asc", name: "asc" });
    filterDemons.forEach((demon) => {
        result.demons.push({
            name: demon.name,
            displayName: demon.displayName,
            level: demon.level,
            arcana: demon.arcana,
            skills: demon.skills
        });
    });

    // Calculate fusion accident chance based on moon phase.
    if (moonPhase === 1) {
        // Moon phase is FULL
        result.accidentChance = 0.1;
    } else if (moonPhase === 2) {
        // Moon phase is NEW
        result.accidentChance = 0.025;
    } else {
        // Moon phase is HALF or NONE
        result.accidentChance = 0.05;
    }

    return { status: "success", data: result };
};

async function populateNewDemon(demonToAdd) {
    try {
        let demon = new Demon(demonToAdd);
        if (demon.name === "") {
            return { "error": "New demon not created: Empty demon name."};
        }
        existingDemons = await Demon.find({name: demon.name});
        let exists = existingDemons.length !== 0;
        if (exists) {
            return { "error": "Demon '" + demon.name + "' already exists" };
        } else {
            await demon.save();
            return { "status": "success" };
        }
    } catch (err) {
        return { "error": "New demon not created - " + err };
    }
};
