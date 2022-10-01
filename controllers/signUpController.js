const bcrypt = require("bcryptjs");
const User = require("../schemas/UserSchema");
const { body, validationResult } = require("express-validator");

exports.register = [
  body("email")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Email cannot be empty")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) return Promise.reject("Email already taken");
    }),
  body("username")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Username cannot be empty")
    .matches(/^[A-Za-z0-9\-\_]+$/)
    .withMessage(
      "Usernames can only contain letters, numbers, dashes and underscores"
    )
    .custom(async (value) => {
      const user = await User.findOne({ username: value });
      if (user) return Promise.reject("Username already taken");
    }),
  body("password")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 5 })
    .withMessage("Passwords must be at least 5 characters in length"),
  body("confirmPassword")
    .trim()
    .escape()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
  async (req, res) => {
    const errors = validationResult(req);

    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });

    if (!errors.isEmpty()) {
      return res.status(400).json({ user, errors });
    }

    try {
      user.password = await bcrypt.hash(user.password, 10);

      await user.save();

      return res.sendStatus(200);
    } catch (err) {
      return res.sendStatus(500);
    }
  },
];
