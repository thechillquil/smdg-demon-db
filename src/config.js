const dotenv = require("dotenv")

const result = dotenv.config({ "path": __dirname + "/.env" });

let config;

if (!("error" in result)) {
    config = result.parsed;
} else {
    for (const key in process.env) {
        if (key.startsWith("SMDG")) {
            config[key] = process.env[key];
        }
    }
}

module.exports = config;