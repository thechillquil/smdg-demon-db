module.exports = async (req, res, next) => {
    if (req.user === null) {
        res.status(403).send(JSON.stringify({ "error": "Cannot perform operation without logging in." }));
        return;
    }
    next();
};