/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on routes, check out:
 * http://links.sailsjs.org/docs/config/routes
 */

module.exports.routes = {

    '/':              'IntroController',
    '/About':         'IntroController',
    '/Development':   'DevelopmentController',
    '/Admin':         'UserController',
    '/Feedback':      'FeedbackController',

    '/user':          'UserController',
    '/user/new': {
        controller: 'user',
        action: 'new'
    },

    '/user/setPrimaryLang': {
        controller: 'user',
        action: 'setPrimaryLang'
    },


    '/image/resize': {
        controller: 'image',
        action: 'resize'
    },

    '/image/update/:id': {
        controller: 'image',
        action: 'update'
    },

    '/image/create/': {
        controller: 'image',
        action: 'create'
    },

    '/listCards/': {
        controller: 'collection',
        action: 'listCards'
    },

    '/listCards/:collection': {
        controller: 'collection',
        action: 'listCards'
    },

    '/card/:id': {
        controller: 'collection',
        action: 'find'
    },

    /*
     '/Insects':       'InsectController',
     '/Moss':          'MossController',
     '/Birds':         'BirdController',
     '/Trees':         'TreeController',
     '/Plants':        'PlantController',
     '/Pathology':     'PathologyController',
     '/Fungi':         'FungusController',

     All replaced by this:
     */

    '/:collection': {
        controller: 'collection',
        action: 'index'
    },

    '/:collection/new': {
        controller: 'collection',
        action: 'new'
    },

    '/:collection/create': {
        controller: 'collection',
        action: 'create'
    },


    '/:collection/card/new': {
        controller: 'collection',
        action: 'newcard'
    },

    '/:collection/card/create': {
        controller: 'collection',
        action: 'createcard'
    },

    '/:collection/card/edit/:id': {
        controller: 'collection',
        action: 'editcard'
    },

    '/:collection/card/update/:id': {
        controller: 'collection',
        action: 'updatecard'
    },

    '/:collection/card/destroy/:id': {
        controller: 'collection',
        action: 'destroycard'
    },

    '/:collection/card/:id': {
        controller: 'collection',
        action: 'find'
    },

    '/:collection/setPrimaryLanguage': {
        controller: 'collection',
        action: 'setPrimaryLanguage'
    }

};
