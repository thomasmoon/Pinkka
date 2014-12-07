/**
 * Allow any authenticated user.
 */
module.exports = function(req, res, next) {

        sails.config.navigation = ['About', 'Development', 'Feedback']

        if (req.session.user) {
            sails.config.navigation.push('Admin')
        }

        next()
};