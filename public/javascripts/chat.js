$(document).ready(function () {
    const socket = io();
    const messageForm = document.querySelector('#message-form');
    const inputMsg = document.querySelector('#msg');
    const senderMsg = document.querySelector('#sender');
    const sender = senderMsg.value;
    const senderImage = document.querySelector('#senderImage');
    const userImage = senderImage.value;
    const chat = document.querySelector('#messages');


    socket.on('connect', function () {
        console.log('Client connected');
        let params = {
            name: sender
        }

        socket.emit('join', params, function () {
            console.log('User has joined!');
        });
    });

    socket.on('new user', function (users) {
        console.log(users.userlist);
        let ol = $('<ol></ol>');

        for (let i = 0; i < users.userlist.length; i++) {
            ol.append('<p>' + users.userlist[i] + '</p>');
        }

        $('#users').html(ol);
    });

    socket.on('new message', data => {
        console.log(data);

        const messageWrap = document.createElement('div');
        messageWrap.setAttribute('class', 'message');
        const html = `
        <li class="left">
            <span class="chat-img1 pull-left">
                <img src="/uploads/${data.profileimage}" class"img-circle" alt="userImage" height="32px">
                <h4 class="from">${data.from}</h4>
            </span>
            <div class="from-details flex items-end">
                <time datetime="${data.time}" class="time">${new Date(data.time).toLocaleString()}</time>
                <p>${data.msg}</p>
            </div>
        </li>
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
            username: sender,
            userProfileimage: userImage
        });
        inputMsg.value = '';
    })
});