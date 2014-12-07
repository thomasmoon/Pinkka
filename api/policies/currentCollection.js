/**
 * Allow any authenticated user.
 */
module.exports = function(req, res, next) {

    Collection.findOne({path: req.param('collection')}).exec(function(err, collection) {

        if (collection) {
            sails.config.collection = collection;
        } else {
            sails.config.collection = null;
        }

        next()

    })

};