const mongoose = require("mongoose");
const userService = require("../src/services/userService");
const User = require("../src/models/user");
const bcrypt = require("bcrypt");

describe('user service', () => {
  
  let db;

  beforeAll(async () => {
    mongoose.connect(global.__MONGO_URI__, {useNewUrlParser: true, useUnifiedTopology: true});
    db = mongoose.connection;
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await db.collection("users").deleteMany();
  });

  it("does nothing", () => {});

  it("should not error on empty collection", async () => {
    let result = await userService.getAllUsers();
    expect(result).toMatchObject({ 
      status: "success",
      users: []
    });
  });

  it("should return list of users", async() => {
    let newUser = new User(
      {
          userName: "testuser",
          displayName: "Test User",
          password: "password",
          email: "test@example.com",
          isActive: true,
          authorizationLevel: 0
      }
    );
    await newUser.save();
    let result = await userService.getAllUsers();
    expect(result).toMatchObject({ 
      status: "success"
    });
    expect(result.users.length).toEqual(1);
    expect(result.users[0].userName).toEqual("testuser");
  });

  it("should return finding by name populated collection", async () => {
    let newUser = new User(
      {
          userName: "testuser",
          displayName: "Test User",
          password: "password",
          email: "test@example.com",
          isActive: true,
          authorizationLevel: 0
      }
    );
    await newUser.save();
    let result = await userService.getUserByUserName("testuser");
    expect(result).toMatchObject({
      status: "success"
    });
  });

  it("should error finding by name on empty collection", async () => {
    let result = await userService.getUserByUserName("doesNotExist");
    expect(result).toMatchObject({
      error: "No user with user name doesNotExist found"
    });
  });

  it("should succeed deleting a user", async () => {
    let newUser = new User(
      {
          userName: "testuser",
          displayName: "Test User",
          password: "password",
          email: "test@example.com",
          isActive: true,
          authorizationLevel: 0
      }
    );
    await newUser.save();
    let anotherUser = new User(
      {
          userName: "anotheruser",
          displayName: "Another User",
          password: "password",
          email: "anothertest@example.com",
          isActive: true,
          authorizationLevel: 0
      }
    );
    await anotherUser.save();
    let result = await userService.delete("testuser");
    expect(result).toMatchObject({
      status: "success"
    });
    let deletedResult = await User.findOne({ userName: "testuser" });
    expect(deletedResult).toBeNull();
    let existingResult = await User.findOne({ userName: "anotheruser" });
    expect(existingResult).not.toBeNull();
  });

  it("should error deleting a user that does not exist", async () => {
    let result = await userService.delete("doesNotExist");
    expect(result).toMatchObject({
      error: "User doesNotExist does not exist"
    });
  });

  it("should update a user", async () => {
    let newUser = new User(
      {
          userName: "testuser",
          displayName: "Test User",
          password: "password",
          email: "test@example.com",
          isActive: true,
          authorizationLevel: 0
      }
    );
    await newUser.save();
    let result = await userService.update("testuser", { "displayName": "Edited User" });
    expect(result).toMatchObject({
      status: "success"
    });
    let findResult = await User.findOne({ userName: "testuser" }).exec();
    expect(findResult.displayName).toEqual("Edited User");
  });

  it("should error updating a user that does not exist", async () => {
    let newUser = new User(
      {
          userName: "testuser",
          displayName: "Test User",
          password: "password",
          email: "test@example.com",
          isActive: true,
          authorizationLevel: 0
      }
    );
    await newUser.save();
    let result = await userService.update("wrongUser", { "displayName": "Edited User" });
    expect(result).toMatchObject({
      error: "User wrongUser not found"
    });
  });

  it("should create a user with the specified properties", async () => {
    let result = await userService.create(      {
      userName: "testuser",
      displayName: "Test User",
      password: "password",
      email: "test@example.com",
      isActive: true,
      authorizationLevel: 0
    });
    expect(result).toMatchObject({
      status: "success"
    });
    // Also validate that password is not stored in clear text.
    let user = await User.findOne({userName: "testuser"}).lean();
    expect(user).not.toBeNull();
    expect(user.password).not.toEqual("passowrd");
  });

  it("should error creating a demon that already exists", async () => {
    let newUser = new User(
      {
          userName: "testuser",
          displayName: "Test User",
          password: "password",
          email: "test@example.com",
          isActive: true,
          authorizationLevel: 0
      }
    );
    await newUser.save();
    let result = await userService.create({
      userName: "testuser",
      displayName: "Another Test User",
      password: "password",
      email: "test@example.com",
      isActive: true,
      authorizationLevel: 0
    });
    expect(result).toMatchObject({
      error: "User with user name testuser already exists"
    });
  });

  it("should error creating a user with empty name", async () => {
    let result = await userService.create({
      userName: "",
      displayName: "Another Test User",
      password: "password",
      email: "test@example.com",
      isActive: true,
      authorizationLevel: 0
    });
    expect(result).toMatchObject({
      error: "New user not created - ValidationError: userName: Path `userName` is required."
    });
  });

  it("should authenticate user", async () => {
    let password = "password"
    let hashedPassword = await bcrypt.hash(password, 10);
    let newUser = new User({
      userName: "testuser",
      displayName: "Test User",
      password: hashedPassword,
      email: "nobody@nowhere.com",
      isActive: true,
      authorizationLevel: 0
    });
    await newUser.save();
    let result = await userService.authenticate("testuser", "password");
    expect(result).toMatchObject({
      status: "success"
    });
  });

  it("should error authenticaticating user that does not exist", async () => {
    let password = "password"
    let hashedPassword = await bcrypt.hash(password, 10);
    let newUser = new User({
      userName: "testuser",
      displayName: "Test User",
      password: hashedPassword,
      email: "nobody@nowhere.com",
      isActive: true,
      authorizationLevel: 0
    });
    await newUser.save();
    let result = await userService.authenticate("wronguser", "password");
    expect(result).toMatchObject({
      error: "No user with user name wronguser found"
    });
  });

  it("should error authenticaticating incorrect password", async () => {
    let password = "password"
    let hashedPassword = await bcrypt.hash(password, 10);
    let newUser = new User({
      userName: "testuser",
      displayName: "Test User",
      password: hashedPassword,
      email: "nobody@nowhere.com",
      isActive: true,
      authorizationLevel: 0
    });
    await newUser.save();
    let result = await userService.authenticate("testuser", "wrongPassword");
    expect(result).toMatchObject({
      error: "Password for user testuser does not match"
    });
  });
});