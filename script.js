// Selecting all required elements
const selectBox = document.querySelector(".select-box"),
    selectXBtn = selectBox.querySelector(".playerX"),
    selectOBtn = selectBox.querySelector(".playerO"),
    playBoard = document.querySelector(".play-board"),
    allBox = document.querySelectorAll("section span"),
    players = document.querySelector(".players"),
    resultBox = document.querySelector(".result-box"),
    wonText = document.querySelector(".won-text"),
    replayBtn = document.querySelector(".btn button");

// Variables for game state
let playerSign = "X"; // Default player is X
let botSign = "O"; // Bot is O by default
let playerTurn = true; // Track whose turn it is
let gameOver = false; // Track if game is over

// Initialize the game
window.onload = () => {
    for (let i = 0; i < allBox.length; i++) {
        allBox[i].setAttribute("onclick", "clickedBox(this)");
    }

    selectXBtn.onclick = () => { // Player X selection
        selectBox.classList.add("hide");
        playBoard.classList.add("show");
        playerSign = "X";  
        botSign = "O";
        playerTurn = true; // Player starts
    };

    selectOBtn.onclick = () => { // Player O selection
        selectBox.classList.add("hide");
        playBoard.classList.add("show");
        players.classList.add("active");
        playerSign = "O";  
        botSign = "X";
        playerTurn = false; // Bot starts first
        setTimeout(bot, 500);
    };
};

// Icons for X and O
let playerXIcon = "fas fa-times";
let playerOIcon = "far fa-circle";

// User click function
function clickedBox(element) {
    if (!playerTurn || gameOver) return; // Prevent clicking if it's the bot's turn or game ended

    element.innerHTML = `<i class="${playerSign === "X" ? playerXIcon : playerOIcon}"></i>`;
    element.setAttribute("data-player", playerSign); 
    element.style.pointerEvents = "none"; 

    players.classList.toggle("active"); // Toggle turn indicator
    playerTurn = false; // Switch to bot's turn

    if (checkWinner(playerSign)) return gameEnd(playerSign); // Check if player wins
    if (checkDraw()) return gameEnd(); // Check if the game is a draw

    setTimeout(bot, 500); // Delay bot move
}

// Bot click function
function bot() {
    if (gameOver) return; // Don't play if game is over

    let emptyBoxes = [];
    for (let i = 0; i < allBox.length; i++) {
        if (allBox[i].childElementCount === 0) {
            emptyBoxes.push(allBox[i]);
        }
    }

    if (emptyBoxes.length === 0) return; // No moves left

    let randomBox = emptyBoxes[Math.floor(Math.random() * emptyBoxes.length)];
    randomBox.innerHTML = `<i class="${botSign === "X" ? playerXIcon : playerOIcon}"></i>`;
    randomBox.setAttribute("data-player", botSign);
    randomBox.style.pointerEvents = "none";  

    players.classList.toggle("active"); // Toggle turn indicator

    if (checkWinner(botSign)) return gameEnd(botSign); // Check if bot wins
    if (checkDraw()) return gameEnd(); // Check if the game is a draw

    playerTurn = true; // Switch back to player
}

// Function to check if a player has won
function checkWinner(sign) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winPatterns.some(pattern => 
        pattern.every(index => allBox[index].getAttribute("data-player") === sign)
    );
}

// Function to check if the game is a draw
function checkDraw() {
    // If all boxes are filled and there's no winner, it's a draw
    const isFull = [...allBox].every(box => box.childElementCount > 0); // Check if all boxes are filled
    return isFull && !checkWinner(playerSign) && !checkWinner(botSign); // Check for draw
}

// Function to handle game end
function gameEnd(winner) {
    gameOver = true;
    playBoard.classList.add("disabled"); // Prevent further moves

    setTimeout(() => {
        resultBox.classList.add("show");
        playBoard.classList.remove("show");
        wonText.innerHTML = winner ? `Player <p>${winner}</p> won the game!` : "It's a draw!"; // Display winner or draw message
    }, 700);
}

// Replay button click event
replayBtn.onclick = () => {
    // Reload the page to reset the game
    window.location.reload(); 
};
