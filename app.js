const express = require("express");
const app = express();
const session = require("express-session");
var bodyParser = require("body-parser");
//const MongoStore = require("connect-mongo")(session);
var routes = require("./routes/routes.js");
var gateway = require("./routes/gateway.js");
var passport = require("./config/passport");
var passportroutes = require("./routes/authentication");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "foo",
    cookie: { maxAge: 10 * 60 * 1000 }
    //store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// Passport init
app.use(passport.initialize());
app.use(passport.session());

app.use("/", routes);
app.use("/", passportroutes);
app.use("/", gateway);

app.listen("3000", () => {
  console.log("started");
});
