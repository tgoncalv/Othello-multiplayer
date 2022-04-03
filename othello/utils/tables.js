var tables = [];
var w = 1;
var b = 2;

function newTable(room) {
    let table = {
        room: room,
        whose_turn: w,
        cells: [
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, w, b, 0, 0, 0,
            0, 0, 0, b, w, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
        ],
        bId: null,
        wId: null,
        nb_Users: 1,
        resetKey: Math.floor(Math.random() * 10000000)
    };
    tables.push(table);
}

function addUser(room) {
    const index = tables.findIndex(table => table.room === room);
    if(index == -1) {
        newTable(room);
        return false;
    } else {
        tables[index].nb_Users += 1;
        return true;
    }
}

function removeUser(room, id) {
    const index = tables.findIndex(table => table.room === room);
    if(index !== -1) {
        tables[index].nb_Users -= 1;
        if(tables[index].nb_Users == 0) {
            tables.splice(index, 1);
        } else if (tables[index].bId === id) {
            tables[index].bId = null;
        } else if (tables[index].wId === id) {
            tables[index].wId = null;
        }
    }
}

function setPieceUser(room, id, piece) {
    const index = tables.findIndex(table => table.room === room);
    update = false;

    if(index !== -1) {
        if(piece == 'black-piece' && tables[index].bId === null){
            tables[index].bId = id;
            update = true;
            if(tables[index].wId === id){
                tables[index].wId = null;
            }
        } else if(piece == 'white-piece' && tables[index].wId === null){
            tables[index].wId = id;
            update = true;
            if(tables[index].bId === id){
                tables[index].bId = null;
            }
        } else if(piece == '') {
            if(tables[index].bId === id){
                tables[index].bId = null;
                update = true;
            } else if(tables[index].wId === id){
                tables[index].wId = null;
                update = true;
            }
        }
    };
    return update;
}

function get_bId(room){
    const index = tables.findIndex(table => table.room === room);
    if(index !== -1) {
        return tables[index].bId;
    }
}

function get_wId(room){
    const index = tables.findIndex(table => table.room === room);
    if(index !== -1) {
        return tables[index].wId;
    }
}

function get_whose_turn(room) {
    const index = tables.findIndex(table => table.room === room);
    if(index !== -1) {
        return tables[index].whose_turn;
    }
}

function getCells(room) {
    const index = tables.findIndex(table => table.room === room);
    if(index !== -1) {
        return tables[index].cells;
    }
}

function getFreeCells(room, piece) {
    const index = tables.findIndex(table => table.room === room);
    let cells = tables[index].cells;
    let freeCells = [];
    
    for (let line=0; line<8; line++) {
        for (let col=0; col<8; col++) {
            let free = true;
            if (cells[8*line+col]!=0){
                free = false;
            }

            if (col <= 5 && cells[8*line+col+1] == 3-piece && free) {
                let j = col+1;
                let candidates = [8*line+j];
                j++;
                while (j <= 6 && cells[8*line+j] == 3-piece) {
                    candidates.push(8*line+j);
                    j++;
                }
                if (cells[8*line+j] == piece) {
                    freeCells.push(8*line+col);
                    free = false;
                }
            }

            if (col >= 2 && cells[8*line+col-1] == 3-piece && free) {
                let j = col-1;
                let candidates = [8*line+j];
                j--;
                while (j >= 1 && cells[8*line+j] == 3-piece) {
                    candidates.push(8*line+j);
                    j--;
                }
                if (cells[8*line+j] == piece) {
                    freeCells.push(8*line+col);
                    free = false;
                }
            }

            if (line <= 5 && cells[8*(line+1)+col] == 3-piece && free) {
                let i = line+1;
                let candidates = [8*i+col];
                i++;
                while (i <= 6 && cells[8*i+col] == 3-piece) {
                    candidates.push(8*i+col);
                    i++;
                }
                if (cells[8*i+col] == piece) {
                    freeCells.push(8*line+col);
                    free = false;
                }
            }

            if (line >= 2 && cells[8*(line-1)+col] == 3-piece && free) {
                let i = line-1;
                let candidates = [8*i+col];
                i--;
                while (i >= 1 && cells[8*i+col] == 3-piece) {
                    candidates.push(8*i+col);
                    i--;
                }
                if (cells[8*i+col] == piece) {
                    freeCells.push(8*line+col);
                    free = false;
                }
            }

            if (line >= 2 && col >= 2 && cells[8*(line-1)+col-1] == 3-piece && free){
                let i=line-1, j=col-1;
                let candidates = [8*i+j];
                i--; j--;
                while (i >= 1 && j >= 1 && cells[8*i+j] == 3-piece) {
                    candidates.push(8*i+j);
                    i--; j--;
                }
                if (cells[8*i+j] == piece) {
                    freeCells.push(8*line+col);
                    free = false;
                }
            }

            if (line >= 2 && col <= 5 && cells[8*(line-1)+col+1] == 3-piece && free){
                let i=line-1, j=col+1;
                let candidates = [8*i+j];
                i--; j++;
                while (i >= 1 && j <= 6 && cells[8*i+j] == 3-piece) {
                    candidates.push(8*i+j);
                    i--; j++;
                }
                if (cells[8*i+j] == piece) {
                    freeCells.push(8*line+col);
                    free = false;
                }
            }

            if (line <= 5 && col >= 2 && cells[8*(line+1)+col-1] == 3-piece && free){
                let i=line+1, j=col-1;
                let candidates = [8*i+j];
                i++; j--;
                while (i <= 6 && j >= 1 && cells[8*i+j] == 3-piece) {
                    candidates.push(8*i+j);
                    i++; j--;
                }
                if (cells[8*i+j] == piece) {
                    freeCells.push(8*line+col);
                    free = false;
                }
            }

            if (line <= 5 && col <= 5 && cells[8*(line+1)+col+1] == 3-piece && free){
                let i=line+1, j=col+1;
                let candidates = [8*i+j];
                i++; j++;
                while (i <= 6 && j <= 6 && cells[8*i+j] == 3-piece) {
                    candidates.push(8*i+j);
                    i++; j++;
                }
                if (cells[8*i+j] == piece) {
                    freeCells.push(8*line+col);
                    free = false;
                }
            }
        }
    }
    return freeCells;
}

function getScore(room) {
    const index = tables.findIndex(table => table.room === room);

    let bScore = 0;
    let wScore = 0;
    let cells = tables[index].cells;

    for(var i=0; i<cells.length; i++){
        if (cells[i] == w){
            wScore++;
        } else if (cells[i] == b){
            bScore++;
        }
    }
    return [wScore,bScore];
}

function place(room, userId, cellIndex, piece) {
    const index = tables.findIndex(table => table.room === room);

    // Transforms the variable "piece" from a string to an integer
    if (piece == "white-piece") {
        piece = w;
        if (tables[index].wId !== userId) {
            return false;
        }
    } else if (piece=="black-piece") {
        piece = b;
        if (tables[index].bId !== userId) {
            return false;
        }
    } else {
        return false;
    }

    // Verify that the cell is free and the color of the piece is correct
    if (tables[index].cells[cellIndex] != 0 || tables[index].whose_turn != piece) {
        return false;
    }

    const transformedPieces = getTransformedPieces(index, cellIndex, piece);
    // Verify that the piece can be placed (it needs to transform at least one other piece on the board)
    if (transformedPieces.length == 0) {
        return false;
    }

    // Do changes
    tables[index].resetKey = Math.floor(Math.random() * 10000000);
    tables[index].whose_turn = 3-piece;
    tables[index].cells[cellIndex] = piece;
    for (var i=0; i < transformedPieces.length; i++) {
        tables[index].cells[transformedPieces[i]] = piece;
    }

    
    if(getFreeCells(room,3-piece).length == 0){
        tables[index].whose_turn = piece;
    }



    return true;
}

function getTransformedPieces(tableIndex, cellIndex, piece) {
    const col = cellIndex%8, line = Math.floor(cellIndex/8);
    let cells = tables[tableIndex].cells;
    let transformedPieces = [];

    // Verifies that there is a piece of the opposite color on the right
    if (col <= 5 && cells[8*line+col+1] == 3-piece) {
        let j = col+1;
        let candidates = [8*line+j];
        j++;
        while (j <= 6 && cells[8*line+j] == 3-piece) {
            candidates.push(8*line+j);
            j++;
        }
        if (cells[8*line+j] == piece) {
            transformedPieces = transformedPieces.concat(candidates);
        }
    }

    // Verifies that there is a piece of the opposite color on the left
    if (col >= 2 && cells[8*line+col-1] == 3-piece) {
        let j = col-1;
        let candidates = [8*line+j];
        j--;
        while (j >= 1 && cells[8*line+j] == 3-piece) {
            candidates.push(8*line+j);
            j--;
        }
        if (cells[8*line+j] == piece) {
            transformedPieces = transformedPieces.concat(candidates);
        }
    }

    // Verifies that there is a piece of the opposite color below the cell where the new piece will be placed
    if (line <= 5 && cells[8*(line+1)+col] == 3-piece) {
        let i = line+1;
        let candidates = [8*i+col];
        i++;
        while (i <= 6 && cells[8*i+col] == 3-piece) {
            candidates.push(8*i+col);
            i++;
        }
        if (cells[8*i+col] == piece) {
            transformedPieces = transformedPieces.concat(candidates);
        }
    }

    // Verifies that there is a piece of the opposite color above the cell where the new piece will be placed
    if (line >= 2 && cells[8*(line-1)+col] == 3-piece) {
        let i = line-1;
        let candidates = [8*i+col];
        i--;
        while (i >= 1 && cells[8*i+col] == 3-piece) {
            candidates.push(8*i+col);
            i--;
        }
        if (cells[8*i+col] == piece) {
            transformedPieces = transformedPieces.concat(candidates);
        }
    }

    // Verifies that there is a piece of the opposite color on the diagonal up-left
    if (line >= 2 && col >= 2 && cells[8*(line-1)+col-1] == 3-piece){
        let i=line-1, j=col-1;
        let candidates = [8*i+j];
        i--; j--;
        while (i >= 1 && j >= 1 && cells[8*i+j] == 3-piece) {
            candidates.push(8*i+j);
            i--; j--;
        }
        if (cells[8*i+j] == piece) {
            transformedPieces = transformedPieces.concat(candidates);
        }
    }

    // Verifies that there is a piece of the opposite color on the diagonal up-right
    if (line >= 2 && col <= 5 && cells[8*(line-1)+col+1] == 3-piece){
        let i=line-1, j=col+1;
        let candidates = [8*i+j];
        i--; j++;
        while (i >= 1 && j <= 6 && cells[8*i+j] == 3-piece) {
            candidates.push(8*i+j);
            i--; j++;
        }
        if (cells[8*i+j] == piece) {
            transformedPieces = transformedPieces.concat(candidates);
        }
    }

    // Verifies that there is a piece of the opposite color on the diagonal down-left
    if (line <= 5 && col >= 2 && cells[8*(line+1)+col-1] == 3-piece){
        let i=line+1, j=col-1;
        let candidates = [8*i+j];
        i++; j--;
        while (i <= 6 && j >= 1 && cells[8*i+j] == 3-piece) {
            candidates.push(8*i+j);
            i++; j--;
        }
        if (cells[8*i+j] == piece) {
            transformedPieces = transformedPieces.concat(candidates);
        }
    }

    // Verifies that there is a piece of the opposite color on the diagonal down-right
    if (line <= 5 && col <= 5 && cells[8*(line+1)+col+1] == 3-piece){
        let i=line+1, j=col+1;
        let candidates = [8*i+j];
        i++; j++;
        while (i <= 6 && j <= 6 && cells[8*i+j] == 3-piece) {
            candidates.push(8*i+j);
            i++; j++;
        }
        if (cells[8*i+j] == piece) {
            transformedPieces = transformedPieces.concat(candidates);
        }
    }

    return transformedPieces;
}

function resetGame(room, resetKey){
    const index = tables.findIndex(table => table.room === room);
    if(tables[index].resetKey == resetKey) {
        tables[index].cells = [
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, w, b, 0, 0, 0,
            0, 0, 0, b, w, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0,
        ];
        tables[index].whose_turn = w;
    }
}

function createResetKey(room) {
    const index = tables.findIndex(table => table.room === room);
    tables[index].resetKey = Math.floor(Math.random() * 10000000);
    return tables[index].resetKey;
}
    
function gameEnd(room) {
    const index = tables.findIndex(table => table.room === room);

    return (!(tables[index].cells.includes(0)) || getFreeCells(room,1).length == 0 || getFreeCells(room,2).length == 0);
}

module.exports = {
    addUser,
    removeUser,
    get_bId,
    get_wId,
    get_whose_turn,
    getCells,
    getScore,
    setPieceUser,
    place,
    resetGame,
    createResetKey,
    gameEnd
};