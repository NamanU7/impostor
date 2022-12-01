//Display the index page when GET method on home path
exports.homepage_get = (req, res, next) => {
    res.render('index.pug', { title: "Impostor" });
}