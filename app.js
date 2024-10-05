require("dotenv").config();

const express = require("express");

const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");

const connectDB = require("./server/config/db");

const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo");

const app = express();

const port = 5000 || process.env.PORT;

app.use(
  session({
    secret: "nihilo notesapp",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    //new Date(Date.now() + 3600000)
    //7 days -604800000
    //Date.now() - days*24*60*60*1000
  })
);
//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//middleware- to pass data from forms/to different pages/ to databases
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
//connecting to DATABASE
connectDB();

//to generate static files
app.use(express.static("public"));

//templete engine
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/main");

//sample routes. all routes moved to routes folder.
// app.get("/", function (req, res) {
//   const locals = {
//     title: "Nodejs <> Notes",
//     description: "Free Nodejs Notes App.",
//   };
//   res.render("index", locals);
// });

//ROUTES
app.use("/", require("./server/routes/auth"));
app.use("/", require("./server/routes/index"));
app.use("/", require("./server/routes/dashboard"));

//Error Page, handle 404
app.get("*", function (req, res) {
  // res.status(404).send("404 Page not found.");

  res.status(404).render("404");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}.`);
});
