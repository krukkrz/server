let express = require('express');
let app = express();

let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

const port = process.env.PORT || 3000;

var clients = [];


io.on('connection', (socket) => {
    console.log('user connected');
    clients.push(socket.id)
    console.log('sockets: ', clients);
        
    socket.on('subscribe', function(room){
        console.log('joining room', room);
        socket.join(room);
    });

    socket.on('clients', function(){
        console.log('getting clients');
        io.emit('get-clients', clients);
    })

    socket.on('new-message', (data) =>{
        console.log('sending room:', data.room);
        io.in(data.room).emit('new-message', data.message);
    })

    socket.on('disconnect', function () {
        console.log('disconnected');     
        clients = removeClient(socket)
        console.log('sockets: ', clients);
    });
});



server.listen(port, () => {
    console.log(`started on port: ${port}`);
});

function removeClient(socket) {
    return clients.filter(function (value, index, arr) {
        return value != socket.id;
    });
}

function removeRoom(room) {
    return rooms.filter(function (value, index, arr) {
        return value != room;
    });
}