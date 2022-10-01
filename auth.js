const secret = process.env.SECRET;
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("./schemas/UserSchema");
const JWTstrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });

      if (!user) return done(null, false);

      const compare = await bcrypt.compare(password, user.password);

      if (compare === true) return done(null, user);

      return done(null, false);
    } catch (err) {
      return done(null, false);
    }
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
