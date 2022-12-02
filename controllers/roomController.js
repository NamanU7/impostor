//Model for messages
messages = ['hi', 'bye'];
exports.user_create_get = (req, res, next) => {
    res.render('room.pug', { name: "robertson", messages: messages });
};