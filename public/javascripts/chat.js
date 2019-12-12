$(document).ready(function () {
    const socket = io();
    const messageForm = document.querySelector('#message-form');
    const inputMsg = document.querySelector('#msg');
    const senderMsg = document.querySelector('#sender');
    const sender = senderMsg.value;
    const senderImage = document.querySelector('#senderImage');
    const userImage = senderImage.value;
    const chat = document.querySelector('#messages');
    const room = document.querySelector('#room').value;

    socket.on('connect', function () {
        console.log('Client connected');
        let params = {
            room: room,
            name: sender
        }

        socket.emit('join', params, function () {
            console.log('User has joined this channel!');
        });
    });

    socket.on('new user', function (users) {
        console.log(users);
        let ol = $('<ol></ol>');

        for (let i = 0; i < users.length; i++) {
            ol.append('<p>' + users[i] + '</p>');
        }
        $('#onlineNum').text('(' + users.length + ')');
        $('#users').html(ol);
    });

    socket.on('new message', data => {
        console.log(data);

        const messageWrap = document.createElement('div');
        messageWrap.setAttribute('class', 'message');
        const html = `
        
        <ul class="list-unstyled">
            <li class="clearfix">
                <div class="chat-avatar">
                   <img src="/uploads/${data.profileimage}" class"img-circle" alt="userImage" height="32px">
                   <i> <time datetime="${data.time}" class="time">${new Date(data.time).toLocaleString()}</time></i>
                </div>
                <div class="conversation-text">
                        <h4 class="from">${data.from}</h4>
                            <p>${data.msg}</p>
                </div>
            </li>
        </ul>
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
            room: room,
            username: sender,
            userProfileimage: userImage
        });
        inputMsg.value = '';
    })
});