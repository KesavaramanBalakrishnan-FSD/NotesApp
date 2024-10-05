/*

GET request
 HOME PAGE
 */

exports.homePage = async (req, res) => {
  const locals = {
    title: "Nodejs <> Notes",
    description: "Free Nodejs Notes App.",
  };
  res.render("index", {
    locals,
    layout: "../views/layouts/front-page",
  });
};

/*

GET request
 About PAGE
 */
exports.aboutPage = async (req, res) => {
  const locals = {
    title: "About - Nodejs <> Notes",
    description: "Free Nodejs Notes App.",
  };
  res.render("about", locals);
};
