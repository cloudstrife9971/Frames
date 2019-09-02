const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  FacebookStrategy = require("passport-facebook").Strategy,
  GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
let User = require("../models/user");

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(
  "local-signup",
  new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, existingUser) {
      if (err) {
        return done(err);
      }
      if (existingUser) {
        return done(
          null,
          false
          //   req.flash("signupMessage", "That email is already taken.")
        );
      }
      // if (req.user) {
      //   var user = req.user;
      //   user.local.email = email;
      //   user.local.password = user.generateHash(password);
      //   user.save(function(err) {
      //     if (err) throw err;
      //     return done(null, user);
      //   });
      // }
      else {
        var newUser = new User();
        newUser.username = username;
        newUser.password = newUser.generateHash(password);
        newUser.save(function(err, doc) {
          if (err) throw err;
          // console.log(doc);
          return done(null, newUser);
        });
      }
    });
  })
);

passport.use(
  "local-login",
  new LocalStrategy(function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, user);
    });
  })
);

passport.use(
  new FacebookStrategy(
    {
      clientID: "260800991259180",
      clientSecret: "f221e3a07cdebc34157d44d0e19c6845",
      callbackURL: "/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(profile);
      user.findOrCreate({ facebookId: profile.id }, function(err, user) {
        if (err) {
          return done(err);
        }
        done(null, user);
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "145099764214-1l17qlvcjo01440ug1jipr4nnnh2jqhr.apps.googleusercontent.com",
      clientSecret: "q6rHg0R95O0JFb3xbClt4J0j",
      callbackURL: "/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOrCreate({ googleId: profile.id }, function(err, user) {
        return done(err, user);
      });
    }
  )
);

module.exports = passport;

// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//   User.getUserById(id, function(err, user) {
//     done(err, user);
//   });
// });

// // -----------------------------------LOCAL---------------------------------------------------
// passport.use(
//   new LocalStrategy(function(username, password, done) {
//     User.getUserByUsername(username, function(err, user) {
//       if (err) throw err;
//       if (!user) {
//         return done(null, false, { message: "Unknown User" });
//       }

//       User.comparePassword(password, user.password, function(err, isMatch) {
//         if (err) throw err;
//         if (isMatch) {
//           return done(null, user);
//         } else {
//           return done(null, false, { message: "Invalid password" });
//         }
//       });
//     });
//   })
// );

// // ---------------------------------FACEBOOK--------------------------------------------------
// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: "986246551559936",
//       clientSecret: "68687d1c29347caeb65f5edb1394dd40",
//       callbackURL: "http://localhost:3000/auth/facebook/callback"
//     },
//     function(accessToken, refreshToken, profile, done) {
//       console.log(profile);
//       User.findOne({ "facebook.id": profile.id }, function(err, user) {
//         if (err) return done(err);
//         if (user) return done(null, user);
//         else {
//           // if there is no user found with that facebook id, create them
//           var newUser = new User();

//           // set all of the facebook information in our user model
//           newUser.facebook.id = profile.id;
//           newUser.facebook.token = accessToken;
//           newUser.facebook.name = profile.displayName;
//           if (typeof profile.emails != "undefined" && profile.emails.length > 0)
//             newUser.facebook.email = profile.emails[0].value;

//           // save our user to the database
//           newUser.save(function(err) {
//             if (err) throw err;
//             return done(null, newUser);
//           });
//         }
//       });
//     }
//   )
// );
// // ----------------------------------GOOGLE-----------------------------------------------------
// passport.use(
//   new GoogleStrategy(
//     {
//       // options for google strategy
//       clientID:
//         "226276374554-78snhbpo4gu86am4lj195qfe4ktm7u8s.apps.googleusercontent.com",
//       clientSecret: "mamR5A_hDCLq08ipBpjBC2eh",
//       callbackURL: "http://localhost:3000/auth/google/callback"
//     },
//     (accessToken, refreshToken, profile, done) => {
//       console.log(profile);
//       User.findOne({ googleId: profile.id }, function(err, user) {
//         if (err) return done(err);
//         if (user) return done(null, user);
//         else {
//           // if there is no user found with that facebook id, create them
//           var newUser = new User();

//           // set all of the facebook information in our user model
//           newUser.google.id = profile.id;
//           newUser.google.token = accessToken;
//           newUser.google.name = profile.displayName;
//           if (typeof profile.emails != "undefined" && profile.emails.length > 0)
//             newUser.google.email = profile.emails[0].value;

//           // save our user to the database
//           newUser.save(function(err) {
//             if (err) throw err;
//             return done(null, newUser);
//           });
//         }
//       });
//     }
//   )
// );

// module.exports = passport;
