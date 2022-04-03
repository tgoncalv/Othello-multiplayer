const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers, getUsernameById } = require('./utils/users');
const { addUser, removeUser, get_bId, get_wId, get_whose_turn, getCells, getScore, place, setPieceUser, resetGame, createResetKey, gameEnd } = require('./utils/tables.js');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const botName = "BOT";

// Run when client connects
io.on('connection', socket => {
    console.log('New web socket connection...')

    socket.on('joinRoom', ({ username, room }) => {
        let user = userJoin(socket.id, username, room);

        socket.join(user.room);
        addUser(user.room);
        var wScore = 0, bScore = 0;
        cells = getCells(user.room);
        whose_turn = get_whose_turn(user.room);
        var scores = getScore(user.room);
        wScore = scores[0];
        bScore = scores[1];
        socket.emit('updatedCells', whose_turn, cells);
        socket.emit('updatedScore', wScore, bScore);
        if (gameEnd(room)) {
            let winner = 'draw';
            if (wScore > bScore) {
                winner = 'white-piece';
            } else if (bScore > wScore) {
                winner = 'black-piece';
            }
            socket.emit('winner', winner);
        }

        // Welcome current user
        socket.emit('message', formatMessage(botName, 'Bienvenue dans la salle de jeu!'))

        // Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(botName, `${user.username} user has joined the chat`));

        // Send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });

        // Runs when client disconnects
        socket.on('disconnect', () => {
            const user = userLeave(socket.id);

            if (setPieceUser(user.room, user.id, "")) {
                let bId = get_bId(user.room);
                let wId = get_wId(user.room);
                let bUsername = getUsernameById(bId);
                let wUsername = getUsernameById(wId);
                io.to(user.room).emit('playingUsersUpdated', bUsername, wUsername);
            }

            removeUser(user.room, socket.id);

            if (user) {
                io.to(user.room).emit('message', formatMessage(botName, `${user.username} user has left the chat`));

                // Send users and room info
                io.to(user.room).emit('roomUsers', {
                    room: user.room,
                    users: getRoomUsers(user.room)
                });
            }
        });

        socket.on('selectPiece', (piece) => {
            const user = getCurrentUser(socket.id);
            if (setPieceUser(user.room, user.id, piece)) {
                socket.emit('playerStatusUpdated', piece);
                let bId = get_bId(user.room);
                let wId = get_wId(user.room);
                let bUsername = getUsernameById(bId);
                let wUsername = getUsernameById(wId);
                io.to(user.room).emit('playingUsersUpdated', bUsername, wUsername);
            }
        });



        socket.on('askReset', () => {
            const user = getCurrentUser(socket.id);
            let bId = get_bId(user.room);
            let wId = get_wId(user.room);
            let confirmationTicket = createResetKey(room);
            if (user.id == wId && bId != null) {
                io.to(bId).emit('askResetConfirmation', confirmationTicket);
            } else if (user.id == bId && wId != null) {

                io.to(wId).emit('askResetConfirmation', confirmationTicket);
            } else if (user.id == wId || user.id == bId) {
                resetGame(user.room, confirmationTicket);
                cells = getCells(user.room);
                whose_turn = get_whose_turn(user.room);
                var scores = getScore(user.room);
                wScore = scores[0];
                bScore = scores[1];
                io.to(user.room).emit('updatedCells', whose_turn, cells);
                io.to(user.room).emit('updatedScore', wScore, bScore);

            }
        });

        socket.on('resetConfirmed', (confirmationTicket) => {
            console.log('I am called');
            const user = getCurrentUser(socket.id);
            let bId = get_bId(user.room);
            let wId = get_wId(user.room);
            if (user.id == bId || user.id == wId) {
                resetGame(user.room, confirmationTicket)
                cells = getCells(user.room);
                whose_turn = get_whose_turn(user.room);
                var scores = getScore(user.room);
                wScore = scores[0];
                bScore = scores[1];
                io.to(user.room).emit('updatedCells', whose_turn, cells);
                io.to(user.room).emit('updatedScore', wScore, bScore);
            }
        })

        socket.on('placePiece', (index, piece) => {
            const user = getCurrentUser(socket.id);
            if (place(user.room, user.id, index, piece)) {
                var wScore = 0, bScore = 0;
                cells = getCells(room);
                whose_turn = get_whose_turn(room);
                var scores = getScore(room);
                wScore = scores[0];
                bScore = scores[1];
                io.to(user.room).emit('updatedCells', whose_turn, cells);
                io.to(user.room).emit('updatedScore', wScore, bScore);
                if (gameEnd(room)) {
                    let winner = 'draw';
                    if (wScore > bScore) {
                        winner = 'white-piece';
                    } else if (bScore > wScore) {
                        winner = 'black-piece';
                    }
                    io.to(user.room).emit('winner', winner);
                }
            }
        });
    });


    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
})

const PORT = 8000 || process.env.PORT;

app.listen();

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

