var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var UserSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    authorizationLevel: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("User", UserSchema);
