const express = require("express");

const router = express.Router();
const { isLoggedIn } = require("../middleware/checkAuth");

const dashboardController = require("../controllers/dashboardController");

//DASHBOARD routes
router.get("/dashboard", isLoggedIn, dashboardController.dashboardPage);
router.get("/dashboard/item/:id", isLoggedIn, dashboardController.viewNotePage);
router.put(
  "/dashboard/item/:id",
  isLoggedIn,
  dashboardController.viewNoteUpdatePage
);

router.delete(
  "/dashboard/item-delete/:id",
  isLoggedIn,
  dashboardController.deleteNote
);

router.get("/dashboard/add", isLoggedIn, dashboardController.addNewNote);

router.post("/dashboard/add", isLoggedIn, dashboardController.addNoteSubmit);

router.get("/dashboard/search", isLoggedIn, dashboardController.searchNote);
router.post(
  "/dashboard/search",
  isLoggedIn,
  dashboardController.searchNoteSubmit
);

module.exports = router;
