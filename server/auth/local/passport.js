var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

exports.setup = function (User, config) {
  passport.use(new LocalStrategy({
      usernameField: 'username',
      passwordField: 'password' // es un campo virtual 
    },
    function(username, password, done) {
      User.findOne({
        username: username.toLowerCase()
      }, function(err, user) {
        if (err) return done(err);

        if (!user) {
          return done(null, false, { message: 'Este nombre de usuario no esta registrado' });
        }
        if (!user.authenticate(password)) {
          return done(null, false, { message: 'La contrasena es invalida' });
        }
        return done(null, user);
      });
    }
  ));
};