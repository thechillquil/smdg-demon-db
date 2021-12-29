const userService = require("../services/userService");

exports.list =  async function(req, res) {
    let users = await userService.getAllUsers();
    if ("error" in users) {
        res.status(404).send("No users found");
        return;
    }

    res.render("users", { "data": users["users"], "user": req.user });
};

exports.edit = async function(req, res) {
    let user = await userService.getUserByUserName(req.params.userName);
    res.render("editUser", {
        "data": user["user"],
        "activeUserCount": 1,
        "user": req.user
    });
};

exports.add = async function(req, res) {
    let newUserResult = await userService.newUser();
    res.render("editUser", {
        "data": newUserResult["user"],
        "activeUserCount": newUserResult["userCount"],
        "user": null
    });
};