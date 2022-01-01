const User = require("../models/user");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../config");

exports.getAllUsers = async function() {
    let allUsers = await User.find({}).lean();
    return { "status": "success", "users": allUsers };
};

exports.getUserByUserName = async function(name) {
    let user = await User.findOne({userName: name}).lean();
    if (user === null) {
        return { "error": "No user with user name " + name + " found" };
    }
    return { "status": "success", "user": user };
};

exports.delete = async function(name) {
    let result = await User.findOneAndDelete({userName: name});
    return { "status": "success" };
};

exports.newUser = async function() {
    let userCount = await User.countDocuments({isActive: true});
    let newUser = new User();
    return { "status": "success", "user": newUser, "userCount": userCount };
};

exports.update = async function(userName, userData) {
    let user = await User.findOneAndUpdate({ userName: userName }, userData);
    if (user === null) {
        return { "error": "User " + userName + " not found" };
    } else {
        return { "status": "success" };
    }
};

exports.create = async function(user) {
    let userCount = await User.countDocuments({isActive: true});
    let existingUsers = await User.find({userName: user.userName});
    let userExists = existingUsers.length !== 0;
    if (userExists) {
        return { "error": "User with user name " + user.userName + " already exists" };
    }
    let password = await bcrypt.hash(user.password, 10);
    try {
        let newUser = new User(
            {
                userName: user.userName,
                displayName: user.displayName || user.userName,
                password: password,
                email: user.email.toLowerCase(),
                isActive: true,
                authorizationLevel: userCount === 0 ? 2 : 0
            }
        );
        await newUser.save();
        return { "status": "success" }
    } catch (err) {
        return { "error": "New user not created - " + err };
    }
};

exports.authenticate = async function(userName, password) {
    let user = await User.findOne({userName: userName}).lean();
    if (user === null) {
        return { "error": "No user with user name " + userName + " found" };
    }
    if (!(await bcrypt.compare(password, user.password))) {
        return { "error": "Password for user " + userName + "does not match" };
    }
    let token = jwt.sign(
        {
            userName: user.userName,
            displayName: user.displayName,
            email: user.email,
            isActive: user.isActive,
            authorizationLevel: user.authorizationLevel
        },
        config.SMDG_SECRET_KEY,
        { 
            expiresIn: "2h"
        }
    );
    return { "status": "success", "token": token };
};
