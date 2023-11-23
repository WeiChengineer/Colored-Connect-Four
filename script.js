document.addEventListener("DOMContentLoaded", function() {
    const titleLetters = document.querySelectorAll("#gameTitle span");
    titleLetters.forEach(letter => {
        letter.style.color = getRandomColor();
    });

    const board = document.getElementById("gameBoard");
    const playerTurnText = document.getElementById("playerTurn");
    const resetButton = document.getElementById("resetButton");
    const startGameButton = document.getElementById("startGameButton");
    const player1NameInput = document.getElementById("player1Name");
    const player2NameInput = document.getElementById("player2Name");
    const columns = 11;
    const rows = 10;
    let currentPlayer = 1;
    let player1Name = "Player 1";
    let player2Name = "Player 2";
    const boardState = Array(columns).fill().map(() => Array(rows).fill(0));
    let isGameActive = false;
    

    function initializeBoard() {
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                const cell = document.createElement("div");
                cell.dataset.column = col;
                cell.dataset.row = row;
                cell.addEventListener("click", () => makeMove(cell, col, row));
                board.appendChild(cell);
            }
        }
    }

    function makeMove(cell, col, row) {
        if (isGameActive && !cell.style.backgroundColor && boardState[col][row] === 0) {
            const playerColor = currentPlayer === 1 ? getRandomColor() : getRandomColor();
            cell.style.backgroundColor = playerColor;
            boardState[col][row] = currentPlayer;
            if (checkWin(col, row)) {
                playerTurnText.innerText = `${currentPlayer === 1 ? player1Name : player2Name} Wins!`;
                isGameActive = false;
                displayWinningMessage(currentPlayer);
                return;
            }
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            playerTurnText.innerText = `${currentPlayer === 1 ? player1Name : player2Name}'s Turn`;
        }
    }
    
    function displayWinningMessage(player) {
        const winningMessage = document.createElement("div");
        winningMessage.id = "winningMessage";
        winningMessage.innerText = `${player === 1 ? player1Name : player2Name} Wins!`;
        document.body.appendChild(winningMessage);
    
        let scale = 1;
        const interval = setInterval(function() {
            scale += 0.1;
            winningMessage.style.transform = `scale(${scale})`;
            winningMessage.style.color = getRandomColor();
            if (scale >= 10) clearInterval(interval);
        }, 100);
        const winningSound = document.getElementById('winningSound');
        winningSound.play();
    }
    

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function updatePlayerColor(player) {
        player.currentColor = getRandomColor();
    }

    function checkWin(col, row) {
        return checkHorizontalWin(row) || checkVerticalWin(col) || checkDiagonalWin(col, row);
    }

    function checkHorizontalWin(row) {
        for (let col = 0; col < columns - 3; col++) {
            if (boardState[col][row] === currentPlayer &&
                boardState[col + 1][row] === currentPlayer &&
                boardState[col + 2][row] === currentPlayer &&
                boardState[col + 3][row] === currentPlayer) {
                return true;
            }
        }
        return false;
    }

    function checkVerticalWin(col) {
        for (let row = 0; row < rows - 3; row++) {
            if (boardState[col][row] === currentPlayer &&
                boardState[col][row + 1] === currentPlayer &&
                boardState[col][row + 2] === currentPlayer &&
                boardState[col][row + 3] === currentPlayer) {
                return true;
            }
        }
        return false;
    }

    function checkDiagonalWin(col, row) {
        for (let i = -3; i <= 0; i++) {
            if (col + i >= 0 && row + i >= 0 &&
                col + i + 3 < columns && row + i + 3 < rows &&
                boardState[col + i][row + i] === currentPlayer &&
                boardState[col + i + 1][row + i + 1] === currentPlayer &&
                boardState[col + i + 2][row + i + 2] === currentPlayer &&
                boardState[col + i + 3][row + i + 3] === currentPlayer) {
                return true;
            }
        }

        for (let i = -3; i <= 0; i++) {
            if (col + i >= 0 && row - i < rows &&
                col + i + 3 < columns && row - i - 3 >= 0 &&
                boardState[col + i][row - i] === currentPlayer &&
                boardState[col + i + 1][row - i - 1] === currentPlayer &&
                boardState[col + i + 2][row - i - 2] === currentPlayer &&
                boardState[col + i + 3][row - i - 3] === currentPlayer) {
                return true;
            }
        }
        return false;
    }

    function resetGame() {
        const cells = board.querySelectorAll("div");
        cells.forEach(cell => {
            cell.style.backgroundColor = '';
            const col = cell.dataset.column;
            const row = cell.dataset.row;
            boardState[col][row] = 0;
        });
        currentPlayer = 1;
        playerTurnText.innerText = `Player ${currentPlayer}'s Turn`;
    
        const winningMessage = document.getElementById("winningMessage");
        if (winningMessage) {
            winningMessage.remove();
        }
    
        isGameActive = true; 
    }
   
    startGameButton.addEventListener("click", function() {
        player1Name = player1NameInput.value || "Player 1";
        player2Name = player2NameInput.value || "Player 2";
        playerTurnText.innerText = `${player1Name}'s Turn`;
        document.getElementById("nameForm").style.display = "none";
        isGameActive = true;
        initializeBoard();
    });

    resetButton.addEventListener("click", resetGame);

});
