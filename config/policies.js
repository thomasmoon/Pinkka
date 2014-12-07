/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!documentation/
 */


module.exports.policies = {

    // Default policy for all controllers and actions
    // (`true` allows public access)
    '*': ['init', 'navigation', 'collections', 'actions', 'jumbotron'],

    CollectionController: {
        '*': ['init', 'collections', 'navigation', 'collections', 'currentCollection', 'actions', 'jumbotron'],
        'edit': ['isAdmin', 'init', 'navigation', 'collections', 'currentCollection', 'actions', 'jumbotron'],
        'destroy': ['isAdmin', 'init', 'navigation', 'collections', 'currentCollection', 'actions', 'jumbotron'],
        'new': ['isAdmin', 'init', 'navigation', 'collections', 'currentCollection', 'actions', 'jumbotron'],
        'create': ['isAdmin', 'init', 'navigation', 'collections', 'currentCollection', 'actions', 'jumbotron'],
        'editcard': ['isAdmin', 'init', 'navigation', 'collections', 'currentCollection', 'actions', 'jumbotron'],
        'destroycard': ['isAdmin', 'init', 'navigation', 'collections', 'currentCollection', 'actions', 'jumbotron'],
        'newcard': ['isAdmin', 'init', 'navigation', 'collections', 'currentCollection', 'actions', 'jumbotron'],
        'createcard': ['isAdmin', 'init', 'navigation', 'collections', 'currentCollection', 'actions', 'jumbotron']
    },

    UserController: {
        '*': ['init', 'navigation', 'collections', 'actions'],
        'create': 'isAdmin',
        'index': ['isAdmin', 'init', 'navigation', 'collections', 'actions'],
        'new': 'isAdmin'
    }
};
