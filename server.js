var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var users=[];

io.on('connection', function (socket) {
    console.log('Client connected');

    socket.on('message', function(msgObject) {
        console.log('Received message:', msgObject.name + ":" + msgObject.message);
        socket.broadcast.emit('message', msgObject);      
    });

     socket.on('addUser', function(name){
       console.log('Client: ' + name);
       users.push(name);
       io.sockets.emit('updateUsers', users); //use io.sockets.emit to send to all (including sender)
       socket.user = name;     
    });

    socket.on('typing', function(name){
       socket.broadcast.emit('userTyping', name);  //use socket.broadcast.emit to send to all expect sender
    });
  
   socket.on('disconnect', function(){
      console.log('Client disconnected: ' + socket.user);
      for (var i=0; i<users.length; i++){
        if (users[i] === socket.user){
          users.splice(i, 1);
          break;
        }
      }
      socket.broadcast.emit('updateUsers', users);
   });
});

server.listen(8080);
