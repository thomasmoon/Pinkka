/**
 * Allow any authenticated user.
 */
module.exports = function(req, res, next) {

       if (req.session.alert) {
           sails.alert = req.session.alert
           req.session.alert = null
       } else {
           sails.alert = null
       }

        // Load image types
        sails.config.imageTypes = Image.imageTypes;

        // Image preference
        if (!req.session.imagePreference) {
            req.session.imagePreference = 'photo';
        }

        // Languages & primaryLanguage
        Language.find().exec(function(err, languages) {

            sails.config.languages = languages

            if (!req.session.primaryLanguage) {
                req.session.primaryLanguage = languages[0]
            }

            next()

        })
};