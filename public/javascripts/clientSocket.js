import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

//dedfining thd /room namespace
const socket = io('/room');

socket.on('connect', () => {
    console.log('Connected');
});

const input = document.getElementById('text_message');
const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

socket.on('chat message', (msg) => {
    const list = document.querySelector('ul');
    const item = document.createElement('li');
    item.textContent = msg;
    list.appendChild(item);
});
