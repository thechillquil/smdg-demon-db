const mongoose = require("mongoose");
const demonService = require("../src/services/demonService");
const Demon = require("../src/models/demon");

async function populateFusionDemons() {
  let input1 = new Demon({
    name: "input1",
    level: 5,
    arcana: "Justice"
  });
  await input1.save();
  let input2 = new Demon({
    name: "input2",
    level: 5,
    arcana: "Chariot"
  });
  await input2.save();
  let input3 = new Demon({
    name: "input3",
    level: 5,
    arcana: "Devil"
  });
  await input3.save();
  let duplicate = new Demon({
    name: "duplicate",
    level: 5,
    arcana: "Justice"
  });
  await duplicate.save();
  let treasure = new Demon({
    name: "treasure",
    level: 5,
    arcana: "Councillor",
    isTreasure: true
  });
  await treasure.save();
  let element = new Demon({
    name: "element",
    level: 5,
    arcana: "Death",
    isElement: true
  });
  await element.save();
  let normal = new Demon({
    name: "normal",
    level: 5,
    arcana: "Emperor",
  });
  await normal.save();
  let arcana = new Demon({
    name: "arcana",
    level: 10,
    arcana: "Magician"
  });
  await arcana.save();
  let otherArcana = new Demon({
    name: "other-arcana",
    level: 10,
    arcana: "Fortune"
  });
  await otherArcana.save();
  let low = new Demon({
    name: "low",
    level: 5,
    arcana: "Fool"
  });
  await low.save();
  let medium = new Demon({
    name: "medium",
    level: 10,
    arcana: "Hunger"
  });
  await medium.save();
  let high = new Demon({
    name: "high",
    level: 15,
    arcana: "World"
  });
  await high.save();
}

describe('demon service', () => {
  
  let db;

  beforeAll(async () => {
    mongoose.connect(global.__MONGO_URI__, {useNewUrlParser: true, useUnifiedTopology: true});
    db = mongoose.connection;
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await db.collection("demons").deleteMany();
  });

  it("does nothing", () => {});

  it("should not error on empty collection", async () => {
    let result = await demonService.getAllDemons();
    expect(result).toMatchObject({ 
      status: "success"
    });
    expect(result.demons.length).toEqual(0);
  });

  it("should return list populated collection", async () => {
    let newDemon = new Demon({ "name": "testDemon" });
    await newDemon.save();
    let result = await demonService.getAllDemons();
    expect(result).toMatchObject({
      status: "success"
    });
    expect(result.demons.length).toEqual(1);
  });

  it("should return finding by name populated collection", async () => {
    let newDemon = new Demon({ "name": "testDemon" });
    await newDemon.save();
    let result = await demonService.getDemonByName("testDemon");
    expect(result).toMatchObject({
      status: "success"
    });
  });

  it("should error finding by name on empty collection", async () => {
    let result = await demonService.getDemonByName("doesNotExist");
    expect(result).toMatchObject({
      error: "Demon doesNotExist not found"
    });
  });

  it("should succeed deleting a demon", async () => {
    let newDemon = new Demon({ "name": "testDemon" });
    await newDemon.save();
    let anotherDemon = new Demon({ "name": "anotherDemon" });
    await anotherDemon.save();
    let result = await demonService.deleteDemon("testDemon");
    expect(result).toMatchObject({
      status: "success"
    });
    let deletedResult = await Demon.findOne({ name: "testDemon" });
    expect(deletedResult).toBeNull();
    let existingResult = await Demon.findOne({ name: "anotherDemon" });
    expect(existingResult).not.toBeNull();
  });

  it("should error deleting a demon that does not exist", async () => {
    let result = await demonService.deleteDemon("doesNotExist");
    expect(result).toMatchObject({
      error: "Demon doesNotExist does not exist"
    });
  });

  it("should delete all demons", async () => {
    let newDemon = new Demon({ "name": "testDemon" });
    await newDemon.save();
    let anotherDemon = new Demon({ "name": "anotherDemon" });
    await anotherDemon.save();
    let result = await demonService.deleteAllDemons();
    expect(result).toMatchObject({
      status: "success",
      data: 2
    });
  });

  it("should not error deleting all demons with empty collection", async () => {
    let result = await demonService.deleteAllDemons();
    expect(result).toMatchObject({
      status: "success",
      data: 0
    });
  });

  it("should update a demon", async () => {
    let newDemon = new Demon({ "name": "testDemon", "displayName": "Test Demon" });
    await newDemon.save();
    let result = await demonService.updateDemon("testDemon", { "displayName": "Edited Demon" });
    expect(result).toMatchObject({
      status: "success"
    });
    let findResult = await Demon.findOne({ name: "testDemon" }).exec();
    expect(findResult.displayName).toEqual("Edited Demon");
  });

  it("should error updating a demon that does not exist", async () => {
    let newDemon = new Demon({ "name": "testDemon", "displayName": "Test Demon" });
    await newDemon.save();
    let result = await demonService.updateDemon("wrongDemon", { "displayName": "Edited Demon" });
    expect(result).toMatchObject({
      error: "Demon wrongDemon not found"
    });
  });

  it("should create a demon with the specified properties", async () => {
    let result = await demonService.createDemon({ name: "testDemon", displayName: "Test Demon" });
    expect(result).toMatchObject({
      status: "success"
    });
  });

  it("should error creating a demon that already exists", async () => {
    let newDemon = new Demon({ name: "testDemon", displayName: "Test Demon" });
    await newDemon.save();
    let result = await demonService.createDemon({ name: "testDemon", displayName: "Edited Demon" });
    expect(result).toMatchObject({
      error: "Demon 'testDemon' already exists"
    });
  });

  it("should error creating a demon with empty name", async () => {
    let result = await demonService.createDemon({ name: "", displayName: "Test Demon" });
    expect(result).toMatchObject({
      error: "New demon not created: Empty demon name."
    });
  });

  it("should be able to bulk create multiple demons", async () => {
    let result = await demonService.bulkCreateDemons([
      {
        name: "firstDemon",
        displayName: "First Demon",
        level: 1
      },
      {
        name: "secondDemon",
        displayName: "Second Demon",
        level: 2
      }
    ]);
    expect(result).toMatchObject({
      status: "success",
      data: 2
    });
  });

  it("should return demons by level", async () => {
    let firstDemon = new Demon({
      name: "firstDemon",
      displayName: "First Demon",
      level: 1
    });
    await firstDemon.save();
    let secondDemon = new Demon({
        name: "secondDemon",
        displayName: "Second Demon",
        level: 2
      });
    await secondDemon.save();
    let result = await demonService.getDemonsByLevelRange(1);
    expect(result.length).toEqual(1);
    expect(result[0].name).toEqual("secondDemon");
  });

  it("should fuse demons with inputs containing treasure demon", async () => {
    await populateFusionDemons();
    let result = await demonService.getFusionDemons(["input1", "treasure"], 5, ["Magician"], 0);
    expect(result.status).toEqual("success");
    expect(result.data.accidentChance).toEqual(0);
    expect(result.data.affinityIncreases).toEqual(0);
    let fusionDemons = result.data.demons.map(demon => demon.name);
    expect(fusionDemons).toEqual(["input1"]);
  });

  it("should fuse many demons with inputs containing treasure demon", async () => {
    await populateFusionDemons();
    let result = await demonService.getFusionDemons(["input1", "input2", "treasure"], 5, ["Magician"], 0);
    expect(result.status).toEqual("success");
    expect(result.data.accidentChance).toEqual(0);
    expect(result.data.affinityIncreases).toEqual(1);
    let fusionDemons = result.data.demons.map(demon => demon.name);
    expect(fusionDemons).toEqual(["input1", "input2"]);
  });

  it("should fuse demons with inputs containing duplicate arcana", async () => {
    await populateFusionDemons();
    let result = await demonService.getFusionDemons(["input1", "duplicate"], 5, ["Magician"], 0);
    expect(result.status).toEqual("success");
    expect(result.data.accidentChance).toEqual(0);
    expect(result.data.affinityIncreases).toEqual(0);
    let fusionDemons = result.data.demons.map(demon => demon.name);
    expect(fusionDemons).toEqual(["element"]);
  });

  it("should fuse many demons with inputs containing duplicate arcana", async () => {
    await populateFusionDemons();
    let result = await demonService.getFusionDemons(["input1", "input2", "duplicate"], 5, ["Magician"], 0);
    expect(result.status).toEqual("success");
    expect(result.data.accidentChance).toEqual(0);
    expect(result.data.affinityIncreases).toEqual(0);
    let fusionDemons = result.data.demons.map(demon => demon.name);
    expect(fusionDemons).toEqual(["element"]);
  });

  it("should fuse demons", async() => {
    await populateFusionDemons();
    let result = await demonService.getFusionDemons(["input1", "input2"], 5, ["Faith"], 0);
    expect(result.status).toEqual("success");
    expect(result.data.accidentChance).toEqual(0.05);
    expect(result.data.affinityIncreases).toEqual(0);
    let fusionDemons = result.data.demons.map(demon => demon.name);
    expect(fusionDemons).toEqual(["element", "input3", "low", "normal"]);
  });

  it("should fuse demons with arcana bonus", async() => {
    await populateFusionDemons();
    let result = await demonService.getFusionDemons(["input1", "input2"], 5, ["Magician"], 0);
    expect(result.status).toEqual("success");
    expect(result.data.accidentChance).toEqual(0.05);
    expect(result.data.affinityIncreases).toEqual(0);
    let fusionDemons = result.data.demons.map(demon => demon.name);
    expect(fusionDemons).toEqual(["element", "input3", "low", "normal", "arcana"]);
  });

  it("should fuse demons with arcana bonus for multiple arcana values", async() => {
    await populateFusionDemons();
    let result = await demonService.getFusionDemons(["input1", "input2"], 5, ["Magician", "Fortune"], 0);
    expect(result.status).toEqual("success");
    expect(result.data.accidentChance).toEqual(0.05);
    expect(result.data.affinityIncreases).toEqual(0);
    let fusionDemons = result.data.demons.map(demon => demon.name);
    expect(fusionDemons).toEqual(["element", "input3", "low", "normal", "arcana", "other-arcana"]);
  });

  it("should fuse demons with multiple results in same arcana", async() => {
    await populateFusionDemons();
    let result = await demonService.getFusionDemons(["input2", "input3"], 5, ["Magician"], 0);
    expect(result.status).toEqual("success");
    expect(result.data.accidentChance).toEqual(0.05);
    expect(result.data.affinityIncreases).toEqual(0);
    let fusionDemons = result.data.demons.map(demon => demon.name);
    expect(fusionDemons).toEqual(["duplicate", "element", "input1", "low", "normal", "arcana"]);
  });

  it("should fuse demons with moon phase full", async() => {
    await populateFusionDemons();
    let result = await demonService.getFusionDemons(["input1", "input2"], 5, ["Magician"], 1);
    expect(result.status).toEqual("success");
    expect(result.data.accidentChance).toEqual(0.1);
    expect(result.data.affinityIncreases).toEqual(0);
    let fusionDemons = result.data.demons.map(demon => demon.name);
    expect(fusionDemons).toEqual(["element", "input3", "low", "normal", "arcana", "medium"]);
  });

  it("should fuse demons with moon phase new", async() => {
    await populateFusionDemons();
    let result = await demonService.getFusionDemons(["input1", "input2"], 5, ["Magician"], 2);
    expect(result.status).toEqual("success");
    expect(result.data.accidentChance).toEqual(0.025);
    expect(result.data.affinityIncreases).toEqual(0);
    let fusionDemons = result.data.demons.map(demon => demon.name);
    expect(fusionDemons).toEqual(["element", "input3", "low", "normal", "arcana", "medium"]);
  });

  it("should fuse demons with moon phase half", async() => {
    await populateFusionDemons();
    let result = await demonService.getFusionDemons(["input1", "input2"], 5, ["Magician"], 3);
    expect(result.status).toEqual("success");
    expect(result.data.accidentChance).toEqual(0.05);
    expect(result.data.affinityIncreases).toEqual(0);
    let fusionDemons = result.data.demons.map(demon => demon.name);
    expect(fusionDemons).toEqual(["element", "input3", "low", "normal", "arcana", "medium"]);
  });

  it("should fuse many demons", async() => {
    await populateFusionDemons();
    let result = await demonService.getFusionDemons(["input1", "input2", "input3"], 5, ["Magician"], 0);
    expect(result.status).toEqual("success");
    expect(result.data.accidentChance).toEqual(0.05);
    expect(result.data.affinityIncreases).toEqual(1);
    let fusionDemons = result.data.demons.map(demon => demon.name);
    expect(fusionDemons).toEqual(["element", "low", "normal", "arcana", "medium"]);
  });

  it("should fuse demons with moon phase full", async() => {
    await populateFusionDemons();
    let result = await demonService.getFusionDemons(["input1", "input2", "input3"], 5, ["Magician"], 1);
    expect(result.status).toEqual("success");
    expect(result.data.accidentChance).toEqual(0.1);
    expect(result.data.affinityIncreases).toEqual(1);
    let fusionDemons = result.data.demons.map(demon => demon.name);
    expect(fusionDemons).toEqual(["element", "low", "normal", "arcana", "medium", "high"]);
  });

  it("should fuse demons with moon phase new", async() => {
    await populateFusionDemons();
    let result = await demonService.getFusionDemons(["input1", "input2", "input3"], 5, ["Magician"], 2);
    expect(result.status).toEqual("success");
    expect(result.data.accidentChance).toEqual(0.025);
    expect(result.data.affinityIncreases).toEqual(1);
    let fusionDemons = result.data.demons.map(demon => demon.name);
    expect(fusionDemons).toEqual(["element", "low", "normal", "arcana", "medium", "high"]);
  });

  it("should fuse demons with moon phase half", async() => {
    await populateFusionDemons();
    let result = await demonService.getFusionDemons(["input1", "input2", "input3"], 5, ["Magician"], 3);
    expect(result.status).toEqual("success");
    expect(result.data.accidentChance).toEqual(0.05);
    expect(result.data.affinityIncreases).toEqual(1);
    let fusionDemons = result.data.demons.map(demon => demon.name);
    expect(fusionDemons).toEqual(["element", "low", "normal", "arcana", "medium", "high"]);
  });

  it("should return empty list if no demons match for fusing", async() => {
    await populateFusionDemons();
    let result = await demonService.getFusionDemons(["input1", "input2"], 1, ["Magician"], 0);
    expect(result.status).toEqual("success");
    expect(result.data.accidentChance).toEqual(0.05);
    expect(result.data.affinityIncreases).toEqual(0);
    let fusionDemons = result.data.demons.map(demon => demon.name);
    expect(fusionDemons).toEqual([]);
  });

  it("should error if fusing too few inputs", async() => {
    await populateFusionDemons();
    let result = await demonService.getFusionDemons(["input1"], 5, ["Magician"], 0);
    expect(result.error).toEqual("Requested fusion with 1 inputs; only valid for between 2 and 6 inputs");
  });

  it("should error if fusing too many inputs", async() => {
    await populateFusionDemons();
    let result = await demonService.getFusionDemons(["input1", "input2", "input3", "input4", "input5", "input6", "input7"], 5, ["Magician"], 0);
    expect(result.error).toEqual("Requested fusion with 7 inputs; only valid for between 2 and 6 inputs");
  });

  it("should error no player arcana", async() => {
    await populateFusionDemons();
    let result = await demonService.getFusionDemons(["input1", "input2"], 5);
    expect(result.error).toEqual("Player must have at least one arcana");
  });
});