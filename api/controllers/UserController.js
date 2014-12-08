/**
 * UserController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

  index: function(req, res) {

    User.find().exec(function(err, users){

      return res.view('user/index', {users: users });

    })
  },

  new: function(req, res) {
    return res.view('user/new');
  },

  create: function(req, res) {
      var username = req.param("username")
      var password = req.param("password")
      var email =    req.param("email")

      User.findByUsername(username).exec(function(err, existingUser){

          if (err) {
              req.session.alert = { type: "danger", msg: "DB Error" }
              return res.view('user/new', { username: username, password: req.param("password"), email: email })
          } else if (existingUser.length > 0) {
              req.session.alert = { type: "danger", msg: "Username already taken." }
              return res.view('user/new', { username: username, password: req.param("password"), email: email })
          } else {

              var hasher = require("password-hash");
              password = hasher.generate(password);

              User.create({username: username, password: password, email: email}).exec(function(error, user) {
                  if (error) {
                      req.session.alert = { type: "danger", msg: "DB Error" }
                      return res.view('user/new', { username: username, password: req.param("password"), email: email })
                  } else {

                      req.session.alert = { type: "success", msg: "User created successfully!" }

                      User.find().exec(function(err, users) {
                          return res.view('user/index', { users: users })
                      })

                  }
              });
          }
      })
    },

    login: function(req, res) {

        var username = req.param("username");
        var password = req.param("password");

        User.findOneByUsername(username).exec(function(err, user) {
            if (err) {
                req.session.alert = { type: "danger", msg: "DB Error" }
                return res.redirect('back')
            } else {
                if (user) {

                    var hasher = require("password-hash");
                    if (hasher.verify(password, user.password)) {
                        req.session.user = user;
                        req.session.alert = { type: "success", msg: 'Welcome <strong>'+user.username+'</strong>!' }
                        return res.redirect('back')
                    }
                }

                req.session.alert = { type: "danger", msg: "Login failed." }
                return res.redirect('back')
            }
        });

    },

    logout: function(req, res) {

        if (req.session.user) {
            req.session.alert = { type: "success", msg: "Logout successful, see you <strong>" + req.session.user.username + "</strong>!"  }
            req.session.user = null;
        }

        return res.redirect('/')
     },

    setPrimaryLang: function (req, res) {

        res.header('Access-Control-Allow-Credentials', 'true');

        Language.findOne({name: req.param("primaryLang")}).exec(function(err, primaryLang) {

            var alert = { type: "fail", msg: 'Unable to set primary language.' }

            if (primaryLang) {
                req.session.primaryLanguage = primaryLang;
                alert = { type: "success", msg: 'Primary language set to <strong>'+primaryLang.label+'</strong>.' }
            }

            if (req.wantsJSON) {
                // session should be saved when using ajax
                console.log("session saved")
                req.session.save();
                return res.json(alert);
            } else {
                req.session.alert = alert;
            }

            return res.redirect("back")
        })

    },
};
