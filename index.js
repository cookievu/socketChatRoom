const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
server.listen(process.env.PORT || 3000, () => console.log('server started'));

app.get('/', (req, res) => res.render('home'));

//mang chua username
const users = [];


io.on('connection', socket => {
    //client gui yeu cau dang ky voi username
    socket.on('NEW_USER_SIGN_UP', username => {
        //kiem tra username da ton tai hay chua
        if (users.indexOf(username) === -1 && username !== '') {
            socket.emit('SERVER_CONFIRM_USERNAME', true); //true -> thong bao dang ky thanh cong
            return users.push(username); //push username vao mang users[]
        }
        socket.emit('SERVER_CONFIRM_USERNAME', false); //neu false
    });

    //su ly yeu cau client join room
    socket.on('CLIENT_JOIN_ROOM', room => {
        const { oldRoom, roomName } = room;
        if (oldRoom) {
            socket.leave(oldRoom);
        }
        socket.join(roomName);
        socket.emit('SERVER_WELCOME_TO_ROOM', `Welcome to ${roomName}`);
    });

    socket.on('CLIENT_SEND_MESSAGE', msg => {
        const { username, roomName, message } = msg;
        socket.to(roomName).emit('GOT_CLIENT_MWSSAGE', { username, message });
    });
});

//emit, on. on
