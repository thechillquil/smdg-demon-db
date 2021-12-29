const config = require("../config");

exports.index = async function(req, res) {
    res.redirect('/compendium');
}

exports.logout = function(req, res) {
    if ("smdg-db-token" in req.cookies) {
        res.cookie("smdg-db-token", "", {
            httpOnly: true,
            secure: config.SMDG_RUNTIME_ENVIRONMENT !== "development",
            expires: new Date(0)
        });
    }
    res.send(JSON.stringify({"status": "success"}));
};
