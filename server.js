/*
 Name: server.js
 Date: 15/10/2019
 Author: Murugan Pandian
*/


var _ = require('lodash'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io')(server);



io.on('connection', (socket) => {

    /*
     create websocket connection between client and server
    */
    socket.on('register', (data) => {

        if (!_.isEmpty(data.userid)) {
            socket.username = data.userid;
            //Join self room
            socket.join(data.userid);
            socket.emit('ack', { event: 'register', code: 200 })
        } else {
            socket.emit('ack', { event: 'register', code: 204 });
        }
    });


    /*
     create room for WebRTC Conference
    */
    socket.on('createRoom', (data) => {
        if (!_.isEmpty(data.room)) {
            //check if room Lready exists
            let room = io.sockets.adapter.rooms[data.room]
            if (_.isEmpty(room)) {
                //Join self room
                socket.join(data.room);
                socket.room = data.room;
                //set room owner
                io.sockets.adapter.rooms[data.room].owner = socket.username
                socket.emit('ack', { event: 'room', code: 800, owner: socket.username, room: data.room })
            } else {

                let owner = io.sockets.adapter.rooms[data.room].owner;
                console.log(owner)
                if (!owner) {
                    //Join self room
                    socket.join(data.room);
                    socket.room = data.room;
                    //set room owner
                    io.sockets.adapter.rooms[data.room].owner = socket.username
                    socket.emit('ack', { event: 'room', code: 800, owner: socket.username, room: data.room })
                } else {
                    socket.emit('ack', { event: 'room', code: 805 })
                }
            }

        } else {
            socket.emit('ack', { event: 'room', code: 804 });
        }
    });

    /*
     create room for WebRTC Conference
    */
    socket.on('joinRoom', (data) => {
        if (!_.isEmpty(data.room)) {
            //check if room all ready exists
            let room = io.sockets.adapter.rooms[data.room]
            if (!_.isEmpty(room)) {
                if (room.length > 4) {
                    socket.emit('ack', { event: 'room', code: 809 })
                    return;
                }

                //Join self room
                socket.join(data.room);
                //set room owner
                let owner = io.sockets.adapter.rooms[data.room].owner
                socket.emit('ack', { event: 'room', code: 800, owner: owner, room: data.room })
            } else {
                socket.emit('ack', { event: 'room', code: 806 })
            }

        } else {
            socket.emit('ack', { event: 'room', code: 804 });
        }
    });


    //WebRTC SDP Signalling message
    socket.on('msg', function(data) {
        if ((data.msg) && (data.to) && (data.from)) {

            var to = data.to || '9898989857575vbyyugjhg55'
            var room = io.sockets.adapter.rooms[to];
            if ((room) && (room.length > 0)) {

                socket.in(data.to).emit('sdpmsg', data);
            } else {
                if (data.event == 'media') {
                    socket.emit('ack', { event: 'media', code: 909, desc: 'User not found', user: data.to })
                } else {
                    socket.emit('ack', { event: 'msg', code: 707, desc: 'User not found', user: data.to })
                }

            }

        } else {
            socket.emit('ack', { event: 'msg', code: 503 })
        }

    })


    //WebRTC SDP Signalling message
    socket.on('c-msg', function(data) {
        if ((data.msg) && (data.to) && (data.from)) {

            var to = data.to || '9898989857575vbyyugjhg55'
            var room = io.sockets.adapter.rooms[to];
            if ((room) && (room.length > 0)) {

                socket.in(data.to).emit('c-sdpmsg', data);
            } else {
                if (data.event == 'c-media') {
                    socket.emit('c-ack', { event: 'c-media', code: 909, desc: 'User not found', user: data.to })
                } else {
                    socket.emit('c-ack', { event: 'c-msg', code: 707, desc: 'User not found', user: data.to })
                }

            }

        } else {
            socket.emit('ack', { event: 'msg', code: 503 })
        }

    })



    /*
       Send offer request to all participant
    */
    socket.on('initConf', function(data) {
        socket.broadcast.to(data.room).emit('c-ack', { event: 'c-msg', code: 'c-202', myid: socket.username });
    })


    /*
      socket disconnect event
    */
    socket.on('disconnect', function() {
        //delete ownername name from room
        let room = socket.room || 'fcdfgrt3'
        if (!io.sockets.adapter.rooms[room]) {
            return;
        }
        let owner = io.sockets.adapter.rooms[room].owner;
        if (owner == socket.username) {
            delete io.sockets.adapter.rooms[room].owner;
        }
    })




});

server.listen(8989)