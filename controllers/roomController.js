//Model for messages

const messages = ["hey", "hello", "what's up", "nm, you?"];


exports.user_create_get = (req, res, next) => {
    res.render('room.pug', { name: "robertson", messages: messages });
}

exports.user_create_post = (req, res, next) => {
    messages.append('new message bro!');
    res.render('room.pug', messages);
}