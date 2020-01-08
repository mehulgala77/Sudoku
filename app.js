
// TakeAway: Event delegation. Instead of listening for click on every cell, 
// listening it on the board itself.
$(".game-board").click(cellClicked);
$(window).keyup(keyPressed);

grid = [
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", "", ""]
];

populateTheBoard(grid, "easy");
filltheSquaresForUser(grid);

function cellClicked(event) {
    $(".cell").removeClass("active");
    $(event.target).addClass("active");
}

function keyPressed(event) {

    let activeCell = $(".cell.active");

    // Unprocessed events.
    if (activeCell == undefined) return;
    if (activeCell.hasClass("bot")) return;

    if (event.key >= 0 && event.key <= 9) {
        activeCell.text(event.key);
    }

    if (event.key == "Enter") {

        if(activeCell.text() !== "") {
            
            // TakeAway: Effective use of data attributes.
            let col = activeCell.data("col");
            let row = activeCell.parent().data("row");
            
            if (isValidPlace(grid, [row, col], activeCell.text())) {

                activeCell.addClass("filled");
                grid[row][col] = activeCell.text();
                
                // TakeAway: Apply transient animations
                activeCell.addClass("success");
                activeCell.one("animationend", function(){
                    activeCell.removeClass("success");
                });
            }
            else {
                activeCell.text("");

                activeCell.addClass("failure");
                activeCell.one("animationend", function(){
                    activeCell.removeClass("failure");
                });
            }
        }
    }    

    if (event.key == "Delete") {

        if(activeCell.text() !== "") {

            let col = activeCell.data("col");
            let row = activeCell.parent().data("row");

            grid[row][col] = "";

            activeCell.text("");
            activeCell.removeClass("filled");
        }
    }
}

function getInitialCellsToFillForLevel(level) {
    switch(level) {
        case "easy":
            return 25;
        case "medium":
            return 20;
        case "tough":
            return 15;
    }
}

function fillEmptySpot(board) {
    let row;
    let col;
    let num;

    while(true) {

        // TakeAway: Generate the game randomly.
        row = Math.floor(Math.random() * 9);
        col = Math.floor(Math.random() * 9);
        num = Math.ceil(Math.random() * 9);

        if (board[row][col] == "") {
            if (isValidPlace(board, [row, col], num)) {
                board[row][col] = num;
                break;
            }
        }
    }
}

function populateTheBoard(board, level) {
    let cellsToFill = getInitialCellsToFillForLevel(level);
    for (let i = 0; i < cellsToFill; i++) {
        fillEmptySpot(board);
    }
}

function filltheSquaresForUser(board) {
    let rowSelector;
    let colSelector; 

    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {

            if (board[i][j] == "") continue;

            rowSelector = `[data-row="${i}"`;
            colSelector = `[data-col="${j}"`;

            let row = $(rowSelector);
            if (row != undefined) {

                let col = row.find(colSelector);
                if (col != undefined) {
                    col.text(board[i][j]);
                    col.addClass("filled");
                    col.addClass("bot");
                }

            }
        }
    }
}

// Game Functions
function isValidPlace(board, pos, num) {
    
    // Validate the Row
    for (let i = 0; i < board.length; i++) {
        if (board[i][pos[1]] == num && i != pos[0]) {
            return false;
        }
    }
    
    // Validate the Col
    for (let i = 0; i < board[0].length; i++) {
        if (board[pos[0]][i] == num && i != pos[1]) {
            return false;
        }
    }
    
    // Validate the local 3*3 cell
    let localCellRow = Math.floor(pos[0] / 3);
    let localCellCol = Math.floor(pos[1] / 3);
    
    for (let i = localCellRow * 3; i < localCellRow * 3 + 3; i++) {
        for (let j = localCellCol * 3; j < localCellCol * 3 + 3; j++) {
            if (board[i][j] == num && pos[0] != i && pos[1] != j) {
                return false;
            } 
        }
    }
    
    return true;
}

function isValidSudoku(board) {
    
    for(let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            if (board[i][j] != "") {
                if (!isValidPlace(board, [i, j], board[i][j])) {
                    return false;
                } 
            } 
        }
    }
        
    return true;    
}