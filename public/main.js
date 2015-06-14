$(document).ready(function() {
    var socket = io();
    var input = $('input');
    var messages = $('#messages');
    var name = "";

    var addMessage = function(msgObject) {
        messages.append('<div>' + msgObject.name +": " + msgObject.message + '</div>');
        $("#isTyping").empty();
    };
  
    var updateUserTyping = function(user){
      $("#isTyping").text(user + " is typing");
    }
    
    var updateUsers = function(users){
      console.log("in updateUsers", users);
      $("#header").text(users.length + " users");  //Update count
      $("#users").empty();
      $.each(users, function(index, user){        //update user list
          $("#users").append("<li id='" + user +"'>" + user + "</li>");        
      });
    }

    var firstTimeThrough = true;
    input.on('keydown', function(event) {
        if (event.keyCode != 13) {
            if (!firstTimeThrough){
              socket.emit('typing', name);
            }
            return;
        }
      
        if (firstTimeThrough){
           name = input.val();
           input.val('');           
           socket.emit('addUser', name);
           firstTimeThrough = false;
        } else { 
           var message = input.val();
           addMessage({name: name, message: message});
           socket.emit('message', {name: name, message: message});
           input.val('');
        }
    });
  
    socket.on('message', addMessage);
    socket.on('userTyping', updateUserTyping);
    socket.on('updateUsers', updateUsers);
});