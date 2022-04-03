const cells = document.querySelectorAll(".cell");
var piece = 0;
const w = 1, b = 2;
const scoreBlack = document.getElementById('score-black');
const scoreWhite = document.getElementById('score-white');
const active = document.getElementById('active-player').childNodes[1]
const turn = document.getElementById('turn').childNodes[1]
var resetKey = 0;

for (let i = 0; i < cells.length; i++) {
    cells[i].addEventListener('click', () => {
        placePiece(i);
    })
}

function updateTable(newCells) {
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerHTML = '';
        if (newCells[i] == w) {
            let white = document.createElement("p");
            white.className = "white-piece";
            cells[i].appendChild(white);
        } else if (newCells[i] == b) {
            let black = document.createElement("p");
            black.className = "black-piece";
            cells[i].appendChild(black);
        }
    }
}


function selectPiece(piece) {
    if (piece == 'black-piece' || piece == 'white-piece' || piece == '')
        socket.emit('selectPiece', piece);
}

socket.on('winner', (winner) => {
    if (winner == 'white-piece') {
        alert("Le joueur blanc a gagné!")
    }
    else if (winner == 'black-piece') {
        alert("Le joueur noir a gagné!")
    }
    else {
        alert('Match nul!');
    }
});

socket.on('playingUsersUpdated', (bUsername, wUsername) => {
    console.log('Nom des joueurs blanc et noir');
})

socket.on('playerStatusUpdated', (pieceName) => {
    if (pieceName.length == 0) {
        active.className = ''
        piece = 0;
    } else if (pieceName == "black-piece") {
        active.className = 'black-piece'
        piece = b;
    } else {
        active.className = 'white-piece'
        piece = w;
    }
});

socket.on('updatedScore', (wScore, bScore) => {
    scoreBlack.textContent = bScore;
    scoreWhite.textContent = wScore;
})

function placePiece(index) {
    let pieceName = "";
    if (piece == b) {
        pieceName = "black-piece";
    } else if (piece == w) {
        pieceName = "white-piece";
    }
    socket.emit('placePiece', index, pieceName);
}

socket.on('updatedCells', (whose_turn, newCells) => {
    whose_turn == 1 ? turn.className = 'white-piece' : turn.className = 'black-piece'
    updateTable(newCells);
})

socket.on('askResetConfirmation', (confirmationTicket) => {
    var txt;
    if (confirm("Voulez-vous rejouer?")) {
        socket.emit('resetConfirmed', confirmationTicket);
    } else {
        console.log('Vous avez refusé de rejouer')
    }
})

function askReset() {
    socket.emit('askReset');
}
