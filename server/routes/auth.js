const express = require("express");

const router = express.Router();

const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/User");

// need to get client id and client secret from google and call back url
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },

    //here we only using profile and cb
    async function (accessToken, refreshToken, profile, done) {
      // note:cb changes to done after created model

      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.familyName,
        lastName: profile.name.givenName,
        ProfileImage: profile.photos[0].value,
      };

      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          done(null, user);
        } else {
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (err) {
        console.log(err);
      }

      //how can we actually get user data
      //   console.log(profile);
      //here, we are  gonna only going to getting the password authentication scope profile.
      //But it is also helpful to get email too

      //when i click login, i want to display user object. When i click login, it moves to
      //oauth google

      //     //find or create user- we are going to so slightly different
      //   User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //     return cb(err, user);
      //   });
    }
  )
);

//Google login route
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

//Retrieve user data
router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login-failure",
    successRedirect: "/dashboard",
  })
  //   function (req, res) {
  //     // Successful authentication, redirect home.
  //     res.redirect("/");
  //}
);

//Route this if something goes wrong
router.get("/login-failure", (req, res) => {
  res.send("Something went wrong...");
});

//Destroy user session
router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
      res.send("Error logging out");
    } else {
      res.redirect("/");
    }
  });
});

//persist user data after successful authentication
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//Retrieve user data from session.
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }

  // UserActivation.FindById(id, function (err, user) {
  //   done(err, user);
  // });
});

//error throwing below code
// passport.deserializeUser(function (id, done) {
//   UserActivation.FindById(id, function (err, user) {
//     done(err, user);
//   });
// });
module.exports = router;
