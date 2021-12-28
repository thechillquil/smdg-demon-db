const jwt = require("jsonwebtoken");
const config = require("../config");

module.exports = async (req, res, next) => {
    let token = null;
    req.user = null;
    // The JWT can be in different places, depending on the request type.
    // Methods of transmission not explicitly enumerated in the below code
    // are not supported.
    if ("token" in req.body) {
        // Token is part of a form submitted by the user. If the
        // token is founc as part of a form sumbission, move it to
        // an http-only cookie so future UI requests can access it.
        token = req.body.token;
        res.cookie("smdg-db-token", token, {
            httpOnly: true,
            secure: config.SMDG_RUNTIME_ENVIRONMENT !== "development"
        });
    } else if ("smdg-db-token" in req.cookies) {
        // Token is stored as an http-only cookie. This is the usual
        // method used by UI requests.
        token = req.cookies["smdg-db-token"];
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        // Token is sent in the request authorizaation header. This
        // is usually the method of transmission from an external API
        // clients.
        token = req.headers.authorization.split(" ")[1];
    }

    if (token !== null) {
        try {
            let decoded = await jwt.verify(token, config.SMDG_SECRET_KEY);
            req.user = { 
                userName: decoded.userName,
                displayName: decoded.displayName,
                email: decoded.email,
                authorizationLevel: decoded.authorizationLevel
            };
        } catch (err) {
            if (err.name !== "TokenExpiredError") {
                res.status(401).send("{ \"error\": \"Invalid token - \"" + JSON.stringify(err) + "\" }");
                return;
            }
        }
    }
    next();
};