const board = document.querySelector("#board");
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGame = document.querySelector(".start-game");
const gameOver = document.querySelector(".game-over");
const buttonRestart = document.querySelector(".btn-restart");
const highestScore = document.querySelector("#high-score span");
const Elementscore = document.querySelector("#score span");
const Elementime = document.querySelector("#time span");

const blockHeight = 50;
const blockWidth = 50;

let highScore = parseInt(localStorage.getItem("highScore")) || 0;
let score = 0;
let time = `00-00`;
let timerIntervalId = null;
highestScore.innerHTML = highScore;
const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
const blocks = [];
let snake = [{ x: 1, y: 3 }];
let direction = "down";
let intervalId = null;
let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};
// for(let i = 0;i<rows *cols ;i++){
//     const block = document.createElement('div');
//     block.classList.add('block');
//     board.appendChild(block);
// }

for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
  
    blocks[`${i}-${j}`] = block;
  }
}

function render() {
  let head = null;
  blocks[`${food.x}-${food.y}`].classList.add("food");
  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  }
  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(intervalId);
    modal.style.display = "flex";
    startGame.style.display = "none";
    gameOver.style.display = "flex";
    return;
  }
  if (head.x === food.x && head.y === food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    blocks[`${food.x}-${food.y}`].classList.add("food");
    snake.unshift(head);
    score += 10;
    Elementscore.innerHTML = score;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
      highestScore.innerHTML = highScore;
    }
  }
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });
  snake.unshift(head);
  snake.pop();
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.add("fill");
  });
}

// intervalId = setInterval(() => {

//     render();
// },500);

startButton.addEventListener("click", () => {
  console.log("clicked");
  modal.style.display = "none";
  intervalId = setInterval(() => {
    render();
  }, 400);
  timerIntervalId = setInterval(() => {
    let [min , sec] = time.split("-").map(Number);
    if(sec == 59){
        min++;
        sec = 0;
    }else{
        sec++;
    }
    time = `${min}-${sec}`;
    Elementime.innerHTML = time;
  
  },1000)
});

buttonRestart.addEventListener("click", restartGame);

function restartGame() {
  blocks[`${food.x}-${food.y}`].classList.remove("food");
  snake.forEach((segment) => {
    blocks[`${segment.x}-${segment.y}`].classList.remove("fill");
  });
  score = 0;
  time = `00-00`;

  Elementscore.innerHTML = score;
  Elementime.innerHTML = time;
  modal.style.display = "none";
  snake = [{ x: 1, y: 3 }];
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };
  direction = "down";
  intervalId = setInterval(() => {
    render();
  }, 400);
}

addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") {
    direction = "up";
  } else if (e.key === "ArrowDown") {
    direction = "down";
  } else if (e.key === "ArrowLeft") {
    direction = "left";
  } else if (e.key === "ArrowRight") {
    direction = "right";
  }
});
