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
        console.log('joining room:', room);
        socket.join(room);
    });

    socket.on('clients', function(){
        const i = clients.indexOf(socket.id.valueOf())
        clients.splice(i)
        console.log('getting clients:', clients);
        io.emit('get-clients', clients);
    })

    socket.on('new-message', (data) =>{
        console.log('sending room:', data.room);
        io.to(data.room).emit('new-message', data);
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