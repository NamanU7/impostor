import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

//dedfining thd /room namespace
const socket = io('/room');

socket.on('connect', () => {
    console.log('Connected');
});

const input = document.getElementById('text_message');
const form = document.querySelector('form');
const list = document.querySelector('ul');


function displayMessage({ name, message, time }) {
    const item = document.createElement('li');
    const senderName = document.createElement('p');
    const senderMessage = document.createElement('p');
    const timeSent = document.createElement('p');

    senderName.textContent = name;
    senderMessage.textContent = message;
    timeSent.textContent = time.toString();
    list.appendChild(item);
    item.appendChild(senderName);
    item.appendChild(senderMessage);
    item.appendChild(timeSent);
}



form.addEventListener('submit', (e) => {
    e.preventDefault();
    //setting the message object
    let message = input.value;
    let time = new Date();
    let name = document.querySelector('h3').textContent;

    //checking if the string is emply or not
    if (message) {
        socket.emit('chat message', { name, message, time });
        input.value = '';
        displayMessage({ name, message, time });
    }
});

socket.on('chat message', (msg) => {
    displayMessage(msg);
});
