import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const socket = io('/room');
console.log("yeah man");

socket.on('connect', () => {
    console.log('Connected');
});
