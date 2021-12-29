module.exports = async (req, res, next) => {
    if (req.user === null) {
        res.status(403).send(JSON.stringify({ "error": "Cannot perform operation without logging in." }));
        return;
    }
    if (!req.user.isActive) {
        res.status(403).send(JSON.stringify({ "error": "User is not active" }));
        return;
    }
    if (req.user.authorizationLevel < 1) {
        res.status(403).send(JSON.stringify({ "error": "Logged in user does not have permission for this operation" }));
        return;
    }
    next();
};