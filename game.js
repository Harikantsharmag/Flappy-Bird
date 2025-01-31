// Get canvas and set up drawing context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Define bird properties
let bird = { x: 50, y: 250, velocity: 0, gravity: 0.5, lift: -8, size: 20 };

// Define game variables
let pipes = [];
let frame = 0;
let gameOver = false;
let score = 0;
let gameStarted = false;

// Function to start the game
function startGame() {
  document.getElementById("startScreen").style.display = "none";
  gameStarted = true;
  gameLoop();
}

// Function to restart the game after Game Over
function restartGame() {
  document.getElementById("gameOverScreen").style.display = "none";
  bird.y = 250;
  bird.velocity = 0;
  pipes = [];
  score = 0;
  frame = 0;
  gameOver = false;
  gameStarted = true;
  gameLoop();
}

// Function to draw the bird with detailed design
function drawBird() {
  // Bird body
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc(
    bird.x + bird.size / 2,
    bird.y + bird.size / 2,
    bird.size / 2,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Bird eye
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(
    bird.x + bird.size * 0.75,
    bird.y + bird.size * 0.3,
    3,
    0,
    Math.PI * 2
  );
  ctx.fill();

  // Bird beak (triangle shape)
  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.moveTo(bird.x + bird.size, bird.y + bird.size * 0.5);
  ctx.lineTo(bird.x + bird.size + 7, bird.y + bird.size * 0.4);
  ctx.lineTo(bird.x + bird.size + 7, bird.y + bird.size * 0.6);
  ctx.closePath();
  ctx.fill();

  // Bird wing
  ctx.fillStyle = "goldenrod";
  ctx.beginPath();
  ctx.arc(
    bird.x + bird.size * 0.4,
    bird.y + bird.size * 0.6,
    bird.size * 0.3,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

// Function to draw pipes
function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach((pipe) => {
    // Top pipe
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    // Bottom pipe
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height - pipe.bottom);
  });
}

// Function to update game elements
function update() {
  if (!gameStarted || gameOver) return;

  // Apply gravity to bird
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // Generate pipes every 100 frames
  if (frame % 100 === 0) {
    let gap = 120;
    let topHeight = Math.random() * (canvas.height / 2);
    pipes.push({
      x: canvas.width,
      width: 50,
      top: topHeight,
      bottom: topHeight + gap,
    });
  }

  // Move pipes and check collisions
  pipes.forEach((pipe) => {
    pipe.x -= 2;

    // Remove pipes if they move off screen
    if (pipe.x + pipe.width < 0) {
      pipes.shift();
      score++;
    }

    // Collision detection with pipes
    if (
      bird.x + bird.size > pipe.x &&
      bird.x < pipe.x + pipe.width &&
      (bird.y < pipe.top || bird.y + bird.size > pipe.bottom)
    ) {
      endGame();
    }
  });

  // Collision detection with ground
  if (bird.y + bird.size > canvas.height) {
    endGame();
  }

  frame++;
}

// Function to draw game elements on the canvas
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBird();
  drawPipes();

  // Draw score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText(`Score: ${score}`, 10, 20);
}

// Main game loop
function gameLoop() {
  if (gameOver) return;
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Function to handle Game Over scenario
function endGame() {
  gameOver = true;
  gameStarted = false;
  document.getElementById("gameOverScreen").style.display = "block";
  document.getElementById("finalScore").textContent = score;
}

// Event listeners for bird jump
document.addEventListener("keydown", () => {
  if (gameStarted) bird.velocity = bird.lift;
});
canvas.addEventListener("click", () => {
  if (gameStarted) bird.velocity = bird.lift;
});
