var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// Environment Variables
let user = process.env.MONGO_USER;
let pass = process.env.MONGO_PASS;
let client = process.env.CLIENT_URL;

// Routes
var indexRouter = require("./routes/index");
const signUpRouter = require("./routes/signUp");
const logInRouter = require("./routes/logIn");

var app = express();

const mongoDb = `mongodb+srv://${user}:${pass}@cluster0.eymioyp.mongodb.net/?retryWrites=true&w=majority`;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

require("./auth");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: client,
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/sign-up", signUpRouter);
app.use("/log-in", logInRouter);

module.exports = app;
