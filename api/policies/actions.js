/**
 * Allow any authenticated user.
 */
module.exports = function(req, res, next) {

        var actions = []

        switch (req.options.controller) {

            case 'user':

                actions.push({
                    name: 'New user',
                    path: '/user/new',
                    icon: 'user'
                })

                break

            case 'collection':

                if (null!=sails.config.collection) {

                actions.push({
                    name: 'New card',
                    path: '/'+ sails.config.collection.path +'/card/new',
                    icon: 'plus'
                })

                actions.push({
                    name: 'New collection',
                    path: '/collection/new',
                    icon: 'open'
                })

                }

                break;

            case 'moss':

                actions.push({
                    name: 'New card',
                    path: '/moss/new',
                    icon: 'plus'
                })

                actions.push({
                    name: 'New collection',
                    path: '/collection/new',
                    icon: 'open'
                })

                break;

            case 'bird':

                actions.push({
                    name: 'New card',
                    path: '/bird/new',
                    icon: 'plus'
                })

                actions.push({
                    name: 'New collection',
                    path: '/collection/new',
                    icon: 'open'
                })

                break

            default:

                actions.push({
                    name: 'New card',
                    path: '/insect/new',
                    icon: 'plus'
                })

                actions.push({
                    name: 'New collection',
                    path: '/collection/new',
                    icon: 'open'
                })

        }

        actions.push({
            name: 'Logout',
            path: '/user/logout',
            icon: 'log-out'
        })

        sails.config.actions = actions;

        next()
};