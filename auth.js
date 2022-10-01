const secret = process.env.SECRET;
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("./schemas/UserSchema");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          // passwords match, log user in
          return done(null, user);
        } else {
          // passwords do not match
          return done(null, false);
        }
      });
    });
  })
);

passport.use(
  new JWTstrategy(
    {
      secretOrKey: secret,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (jwtPayload, done) => {
      try {
        const user = await User.findOne({ _id: jwtPayload.id });

        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

module.exports = passport;
