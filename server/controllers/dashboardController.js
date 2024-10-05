const mongoose = require("mongoose");
const Note = require("../models/Notes");

/*


//this is throwing an error
GET request
 DASHBOARD PAGE
 */

// exports.dashboardPage = async (req, res) => {
//   const locals = {
//     title: "Dashboard page",
//     description: "Free Nodejs Notes App.",
//   };
//   res.render("dashboard/index", {
//     locals,
//     layout: "../views/layouts/dashboard",
//   });
// };

//GET dashboard
/**
 * GET /
 * Dashboard
 */
exports.dashboardPage = async (req, res) => {
  //this is moved to checkAuth.js
  // if (!req.user || !req.user.id) {
  //   return res.status(401).send("User not authenticated");
  // }
  let perPage = 12;
  let page = parseInt(req.query.page) || 1;

  const locals = {
    title: "Dashboard",
    description: "Free NodeJS Notes App.",
  };

  try {
    //   // Mongoose "^7.0.0 Update
    const notes = await Note.aggregate([
      { $sort: { updatedAt: -1 } },
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $project: {
          title: { $substr: ["$title", 0, 30] },
          body: { $substr: ["$body", 0, 100] },
        },
      },
    ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Note.countDocuments();

    res.render("dashboard/index", {
      userName: req.user.lastName,
      locals,
      notes,
      layout: "../views/layouts/dashboard",
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
  }
};

//Replaced above with update version mongodb , code from raddy utube

/*

  GET Route
  View specific Note
*/
exports.viewNotePage = async (req, res) => {
  // res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
  const note = await Note.findById({ _id: req.params.id })
    .where({ user: req.user.id })
    .lean();

  if (note) {
    res.render("dashboard/view-note", {
      noteID: req.params.id,
      note,
      layout: "../views/layouts/dashboard",
    });
  } else {
    res.send("Something went wrong!");
  }
};

/*
PUT route
update specific Note
*/
exports.viewNoteUpdatePage = async (req, res) => {
  try {
    await Note.findOneAndUpdate(
      { _id: req.params.id },
      {
        title: req.body.title,
        body: req.body.body,
        updatedAt: Date.now(),
      }
    ).where({
      user: req.user.id,
    });

    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
};

//DELETE
exports.deleteNote = async (req, res) => {
  try {
    await Note.deleteOne({
      _id: req.params.id,
    }).where({ user: req.user.id });
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
};

//ADD NEW note

exports.addNewNote = async (req, res) => {
  res.render("dashboard/add", {
    layout: "../views/layouts/dashboard",
  });
};

//New Note Submit
exports.addNoteSubmit = async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Note.create(req.body);
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
};

//GET search notes
exports.searchNote = async (req, res) => {
  try {
    res.render("dashboard/search", {
      searchResults: "",
      layout: "../views/layout/dashboard",
    });
  } catch (error) {
    console.log(error);
  }
};

//search Post routes

exports.searchNoteSubmit = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

    const searchResults = await Note.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
      ],
    }).where({ user: req.user.id });

    res.render("dashboard/search", {
      searchResults,
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
  }
};
