module.exports = function (req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.send("You Must Be Logged In", 403);
    }
};