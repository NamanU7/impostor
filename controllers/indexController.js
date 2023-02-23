//Display the index page when GET method on home path
exports.homepage_get = (req, res, next) => {
  // console.log(req.session);
  res.cookie("name", "testing").render("index.pug");
};

// exports.homepage_post = (req, res, next) => {

// }
