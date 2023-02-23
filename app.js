/* IMPORTS */

const passport = require("passport");
require("dotenv").config();

//Express framework for servers
const express = require("express");
const cookieParser = require("cookie-parser");

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

//Initilaizing socket server with the http server.
const io = new Server(server);

//Defining a namespace (endpoint) for the socket server
const roomNameSpace = io.of("/room"); //roomNameSpace is the 'parent namespace'

/*
 * -------------- VIEW ENGINE SETUP -----------------
 */

//Setting up the (view) template engine.
//Specifying the value 'views' to the directory where template are stored.
app.set("views", path.join(__dirname, "views"));

//Specifying the value 'view engine' to the template library 'pug'.
app.set("view engine", "pug");

/*
 * ---------------- MIDDLEWARE ------------------
 */

//Parse http headers, bodies, and adds it to the req object
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Makes express serve all the static files in ./public.
app.use(express.static(path.join(__dirname, "public")));

/**
 * ----------- PASSPORT AUTHENTICATION ------------
 */

// Pass the global passport object into the configuration file
require("./config/passport")(passport);

// Initialize the passport object on every request
app.use(passport.initialize());

/**
 * ----------------- ROUTES ---------------------
 */

app.use("/", indexRouter);
app.use("/", authRouter);
app.use("/room", roomRouter);

//End of request handling chain

/**
 * ----------------- SOCKET CONNECTION -------------------
 */

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
