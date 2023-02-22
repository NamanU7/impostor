/* IMPORTS */

const session = require("express-session");
const SQLiteStore = require("connect-sqlite3")(session);
const passport = require("passport");

//Express framework for servers
const express = require("express");

//Node.js standard library modules for http and path for parsing file and dir paths.
const http = require("http");
const path = require("path");

//Routers imported from the routes dir which handle the routes for specified endpoints.
const indexRouter = require("./routes/index.js");
const roomRouter = require("./routes/room.js");
const authRouter = require("./routes/auth.js");

//Initializing the server object from our express import.
const app = express();

//Setup an http server with app as the function handler.
const server = http.createServer(app);

//Importing socket.io module
const { Server } = require("socket.io");

//Initilaizing server with the http server.
const io = new Server(server);

//Defining a namespace (endpoint) for the socket server
const roomNameSpace = io.of("/room"); //roomNameSpace is the 'parent namespace'

/* VIEW ENGINE SETUP */

//Setting up the (view) template engine.
//Specifying the value 'views' to the directory where template are stored.
app.set("views", path.join(__dirname, "views"));

//Specifying the value 'view engine' to the template library 'pug'.
app.set("view engine", "pug");

/* MIDDLEWARE */

//Parse json in the req body.
app.use(express.json());

//Parse urlencoded bodies of req objects.
app.use(express.urlencoded({ extended: false }));

//Makes express serve all the static files in ./public.
app.use(express.static(path.join(__dirname, "public")));

//Add session support to the app
const sessionStore = new SQLiteStore({ db: "sessions.db", dir: "./db" });
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

/**
 * ----------- PASSPORT AUTHENTICATION ------------
 */

//requiring the configed passport with the local strategy so that app.js knows about it.
require("./config/passport");

//TODO
app.use(passport.initialize());
app.use(passport.session());

/**
 * Custom middle ware for debugging
 */

app.use((req, res, next) => {
  console.log(req.session); //created by express-session
  console.log(req.user); //created by passport
  next();
});

//Authenticate the session
//This will be handeled for, specific endpoints in the app.
// app.use(passport.authenticate("session")); //adds the logout function to req obj

/**
 * ----------------- ROUTES ---------------------
 */

app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/room", roomRouter);

//End of request handling chain

//Socket Connection
roomNameSpace.on("connection", async (socket) => {
  console.log(`User ${socket.id} connected`);

  //Emits the event to all those connected besides the sender of the event (the one who sent this event)
  socket.on("chat message", (msg) => {
    socket.broadcast.emit("chat message", msg);
    // roomNameSpace.emit('chat message', msg);
  });

  socket.on("disconnect", () => {
    console.log(`User ${socket.id} disconnected`);
  });
});

server.listen(3000, () => {
  console.log("Listening on port 3000...");
});

//Must make 3 different namespaces, 1 for each level, the first level being accesible to all.

let firstLevel = io.of("/level1");
