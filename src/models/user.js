var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var UserSchema = new Schema({
    userName: {
        type: String,
        default: "",
        required: true,
        unique: true
    },
    displayName: {
        type: String,
        default: "",
        required: true
    },
    email: {
        type: String,
        default: "",
        required: true,
        unique: true
    },
    password: {
        type: String,
        default: "",
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    authorizationLevel: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("User", UserSchema);
