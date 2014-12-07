/**
 * Allow any authenticated user.
 */
module.exports = function(req, res, next) {

    Collection.find({active: true}).exec(function(err, collections) {

        sails.config.collections = collections

        next()

    })

};