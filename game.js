let canvas = document.getElementById("game");
let ctx = canvas.getContext("2d");
// Attach the reset button functionality
document.getElementById("resetButton").addEventListener("click", resetGame);


// Snake and apple images
let normalMonkeyImg = new Image();
normalMonkeyImg.src = "/all project/pic/png-transparent-monkey-cartoon-drawing-illustration-happy-little-monkey-brown-and-beige-monkey-sticker-comics-mammal-cat-like-mammal-thumbnail-Photoroom.png"; // Replace with your normal monkey image path
let warningMonkeyImg = new Image();
warningMonkeyImg.src = "/all project/pic/360_F_109678883_orHbs2fAQM0r90Gvap6hIKV6YQKXCE9r-Photoroom.png"; // Replace with your warning monkey image path
let currentMonkeyImg = normalMonkeyImg;

let appleImg = new Image();
appleImg.src = "/all project/pic/pngtree-banana-yellow-fruit-banana-skewers-png-image_5944324-Photoroom.png"; // Replace with your apple image file path

// Background image
let backgroundImg = new Image();
backgroundImg.src = "/all project/pic/images.jpg"; // Replace with your background image path

// Sounds
let gulpSound = new Audio("/all project/radio/game-eat-sound-83240.mp3");
let gameOverSound = new Audio("/all project/radio/kl-peach-game-over-iii-142453.mp3");
let backgroundMusic = new Audio("/all project/radio/game-music-loop-7-145285.mp3");

// Configure background music
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5; // Adjust volume as needed

// Snake axis
class SnakePart {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Game variables
let speed = 10;
let tileCount = 20;
let tileSize = (canvas.width / tileCount - 1) * 2;

let headX = 10;
let headY = 10;
let snakeParts = [];
let tailLength = 2;

let appleX = 15;
let appleY = 18;

let inputsXVelocity = 0;
let inputsYVelocity = 0;

let xVelocity = 0;
let yVelocity = 0;

let score = 0;
let timeLeft = 10;
let appleTimer = 5;
let isGameStarted = false;

// Game loop
function drawGame() {
    if (isGameStarted) {
        xVelocity = inputsXVelocity;
        yVelocity = inputsYVelocity;

        changeSnakePosition();
        let result = isGameOver();
        if (result) {
            return;
        }

        clearScreen();

        checkAppleCollision();
        drawApple();
        updateApplePosition();
        updateMonkeyImage();
        drawSnake();
        drawScore();
        drawTimer(); // Include the countdown timer with blood bar

        if (score > 5) {
            speed = 9;
        }
        if (score > 10) {
            speed = 11;
        }

        // Decrease timers
        timeLeft -= 1 / speed;
        appleTimer -= 1 / speed;

        if (timeLeft <= 0) {
            displayGameOver();
            return;
        }
    } else {
        clearScreen();
        drawSnake();
        drawApple();
        drawScore();
        drawTimer();
    }

    setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
    let gameOver = false;

    if (yVelocity === 0 && xVelocity === 0) {
        return false;
    }

    // Walls collision
    if (headX < 0 || headX >= tileCount || headY < 0 || headY >= tileCount) {
        gameOver = true;
    }

    // Self-collision
    for (let i = 0; i < snakeParts.length; i++) {
        let part = snakeParts[i];
        if (part.x === headX && part.y === headY) {
            gameOver = true;
            break;
        }
    }

    if (gameOver) {
        displayGameOver();
    }

    return gameOver;
}

function displayGameOver() {
    ctx.fillStyle = "white";
    ctx.font = "50px Verdana";

    let gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "black");
    gradient.addColorStop("0.5", "black");
    gradient.addColorStop("1.0", "black");

    ctx.fillStyle = gradient;
    ctx.fillText("Game Over!", canvas.width / 6.5, canvas.height / 2);

    backgroundMusic.pause(); // Stop background music
    gameOverSound.play(); // Play game over sound
}

function drawScore() {
    ctx.fillStyle = "black";
    ctx.font = "10px Verdana";
    ctx.fillText("Score: " + score, canvas.width - 60, 10);
}

// Draw the timer with blood bar
function drawTimer() {
    // Draw the timer text at the top left corner
    ctx.fillStyle = "Black";
    ctx.font = "10px Verdana";
    ctx.fillText("Time Left: " + Math.ceil(timeLeft), 10, 10);

    // Blood grade bar - horizontal countdown
    const bloodBarHeight = 20; // Height of the blood bar
    const barX = 10; // X-position for the blood bar
    const barY = 30; // Y-position for the blood bar
    const maxWidth = canvas.width - 20; // Maximum width of the blood bar
    const currentWidth = (timeLeft / 10) * maxWidth; // Decrease width as time passes

    // Create a gradient color for the blood bar (e.g., green to red)
    const bloodGradient = ctx.createLinearGradient(barX, barY, barX + currentWidth, barY);
    bloodGradient.addColorStop(0, "red"); // Start with green when time is full
    bloodGradient.addColorStop(0.5, "green"); // Transition to yellow as time decreases
    bloodGradient.addColorStop(1, "green"); // End with red when time is almost up

    // Draw the blood bar (horizontal)
    ctx.fillStyle = bloodGradient;
    ctx.fillRect(barX, barY, currentWidth, bloodBarHeight);
}

function clearScreen() {
    // Draw background image
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

function drawSnake() {
    ctx.drawImage(
        currentMonkeyImg,
        headX * tileCount,
        headY * tileCount,
        tileSize,
        tileSize
    );

    snakeParts.push(new SnakePart(headX, headY));

    while (snakeParts.length > tailLength) {
        snakeParts.shift();
    }
}

function changeSnakePosition() {
    headX += xVelocity;
    headY += yVelocity;
}

function drawApple() {
    ctx.drawImage(
        appleImg,
        appleX * tileCount,
        appleY * tileCount,
        tileSize,
        tileSize
    );
}

function checkAppleCollision() {
    if (appleX === headX && appleY === headY) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        score++;
        gulpSound.play();

        // Reset timers
        timeLeft = 10;
        appleTimer = 5;
    }
}

function updateApplePosition() {
    if (appleTimer <= 0) {
        appleX = Math.floor(Math.random() * tileCount);
        appleY = Math.floor(Math.random() * tileCount);
        appleTimer = 5;
    }
}

function updateMonkeyImage() {
    if (timeLeft < 5) {
        currentMonkeyImg = warningMonkeyImg;
    } else {
        currentMonkeyImg = normalMonkeyImg;
    }
}

document.body.addEventListener("keydown", keyDown);

function keyDown(event) {
    if (!isGameStarted) {
        isGameStarted = true;
        backgroundMusic.play(); // Start background music
    }


    // Up
    if ((event.keyCode == 38 || event.keyCode == 87) && inputsYVelocity !== 1) {
        inputsYVelocity = -1;
        inputsXVelocity = 0;
    }


    // Down
    if ((event.keyCode == 40 || event.keyCode == 83) && inputsYVelocity !== -1) {
        inputsYVelocity = 1;
        inputsXVelocity = 0;
    }

    // Left
    if ((event.keyCode == 37 || event.keyCode == 65) && inputsXVelocity !== 1) {
        inputsYVelocity = 0;
        inputsXVelocity = -1;
    }

    // Right
    if ((event.keyCode == 39 || event.keyCode == 68) && inputsXVelocity !== -1) {
        inputsYVelocity = 0;
        inputsXVelocity = 1;
    }
}

function resetGame() {
    // Reset game variables
    headX = 10;
    headY = 10;
    snakeParts = [];
    tailLength = 2;
    appleX = 15;
    appleY = 18;
    inputsXVelocity = 0;
    inputsYVelocity = 0;
    xVelocity = 0;
    yVelocity = 0;
    score = 0;
    timeLeft = 10;
    appleTimer = 5;
    isGameStarted = false;

    // Stop any playing sounds
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0;
    gameOverSound.pause();
    gameOverSound.currentTime = 0;

    // Redraw the initial state
    drawGame();
}

drawGame();