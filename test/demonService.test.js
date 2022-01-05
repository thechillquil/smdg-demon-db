const mongoose = require("mongoose");
const demonService = require("../src/services/demonService");
const Demon = require("../src/models/demon");

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
});