const express = require("express"),
  router = express.Router(),
  passport = require("passport");
require("./routes");

// --------------------------------------LOCAL-----------------------------------------------
router.get("/signup", (req, res) => {
  res.render("signup", {
    link: req.query.referer
  });
});

router.post("/signup", passport.authenticate("local-signup"), (req, res) => {
  res.redirect(req.query.referer);
});

router.get("/login", (req, res) => {
  res.render("login", {
    link: req.query.referer
  });
});

router.post("/login", passport.authenticate("local-login"), (req, res) => {
  res.redirect(req.query.referer);
});

// -------------------------------------FACEBOOK---------------------------------------------

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/success",
    failureRedirect: "/failure"
  })
);

// --------------------------------------GOOGLE---------------------------------------------------
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login"]
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/failure" }),
  function(req, res) {
    res.redirect("/success");
  }
);
// ---------------------------------------------------------------------------------------------------

router.get("/logout", function(req, res) {
  req.logout();
  if (req.query.referer == "/pay") {
    return res.redirect("/");
  } else {
    return res.redirect(req.query.referer);
  }
});

router.get("/failure", function(req, res) {
  console.log("failure");
  res.end();
});

router.get("/success", function(req, res) {
  console.log("/success");
  res.end();
});

router.get("/User", function(req, res) {
  console.log(req.isAuthenticated());
  console.log(req.user);
  res.end();
});

router.get("/session", function(req, res) {
  console.log(req.isAuthenticated());
  console.log(req.session);
  res.end();
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  // res.redirect('/');
  res.send("teri");
}

function isUserAuthenticated(req, res, next) {
  if (req.user) {
    next();
  } else {
    res.send("You must login!");
  }
}

module.exports = router;
