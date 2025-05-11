const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ballX, ballY, ballDX, ballDY;
let paddleX, paddleWidth = 75;
let bricks = [];
let brickRowCount = 4;
let brickColumnCount = 10;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 40;
let brickOffsetLeft = 20;


let rightPressed = false;
let leftPressed = false;
let gameRunning = false;

document.getElementById("startBtn").addEventListener("click", startGame);
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function startGame() {
  const difficulty = document.getElementById("difficulty").value;
  switch (difficulty) {

    case "easy":
      ballDX = 2;
      ballDY = -2;
      break;
    case "normal":
      ballDX = 4;
      ballDY = -4;
      break;
    case "hard":
      ballDX = 6;
      ballDY = -6;
      break;
  }

  ballX = canvas.width / 2;
  ballY = canvas.height - 30;
  ballDX = 2;
  ballDY = -2;
  paddleX = (canvas.width - paddleWidth) / 2;
  initBricks();
  gameRunning = true;
  draw();
}

function initBricks() {
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
  }
}

function keyDownHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
}

function keyUpHandler(e) {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          ballX > b.x &&
          ballX < b.x + brickWidth &&
          ballY > b.y &&
          ballY < b.y + brickHeight
        ) {
          ballDY = -ballDY;
          b.status = 0;
        }
      }
    }
  }
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, 10, 0, Math.PI * 2);
  ctx.fillStyle = "#fdd835";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - 10, paddleWidth, 10);
  ctx.fillStyle = "#00e676";
  ctx.fill();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#ff7043";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function draw() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  collisionDetection();

  if (
    ballX + ballDX > canvas.width - 10 ||
    ballX + ballDX < 10
  ) ballDX = -ballDX;

  if (ballY + ballDY < 10) ballDY = -ballDY;
  else if (ballY + ballDY > canvas.height - 10) {
    if (ballX > paddleX && ballX < paddleX + paddleWidth) {
      ballDY = -ballDY;
    } else {
      alert("게임 오버!");
      gameRunning = false;
      return;
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) paddleX += 5;
  else if (leftPressed && paddleX > 0) paddleX -= 5;

  ballX += ballDX;
  ballY += ballDY;
  requestAnimationFrame(draw);
}
