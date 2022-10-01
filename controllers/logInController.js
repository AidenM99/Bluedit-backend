const jwt = require("jsonwebtoken");
const passport = require("passport");
const secret = process.env.SECRET;

exports.authenticate = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: "Incorrect username or password",
      });
    }

    req.login(user, { session: false }, (err) => {
      if (err) return res.sendStatus(500);

      const userDetails = { id: user._id };

      const token = jwt.sign(userDetails, secret);

      return res.json({ token });
    });
  })(req, res);
};
