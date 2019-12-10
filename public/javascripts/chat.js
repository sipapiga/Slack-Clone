$(document).ready(function () {
    const socket = io();
    const messageForm = document.querySelector('#message-form');
    const inputMsg = document.querySelector('#msg');
    const senderMsg = document.querySelector('#sender');
    const sender = senderMsg.value;
    console.log(sender);
    const chat = document.querySelector('#messages')

    socket.on('connect', function () {
        console.log('Client connected');
    });

    socket.on('new message', data => {
        console.log(data);

        const messageWrap = document.createElement('div');
        messageWrap.setAttribute('class', 'message');
        const html = `
        <div class="letter">${data.from}</div>
        <div class="">
            <div class="from-details flex items-end">
                <h3 class="from">${data.from}</h3>
                <time datetime="${data.time}" class="time">${new Date(data.time).toLocaleString()}</time>
            </div>
            <p>${data.msg}</p>
        </div>
    `;
        messageWrap.innerHTML = html;
        chat.appendChild(messageWrap);

    });

    $(messageForm).on('submit', e => {
        e.preventDefault();
        const message = inputMsg.value;
        console.log(message);

        socket.emit('send message', {
            msg: message,
            username: sender
        });
        inputMsg.value = '';
    })
});