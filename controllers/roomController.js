//Model for messages
exports.user_room_get = (req, res, next) => {
  res.render("room.pug", { name: req.user.name });
};

// exports.user_room_post = (req, res, next) => {
//     res.render('room.pug', { name: "robertson" });
// };
