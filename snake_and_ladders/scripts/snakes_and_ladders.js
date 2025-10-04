class Die {
  static #sidesToIcon = {
    1: 'dice-one',
    2: 'dice-two',
    3: 'dice-three',
    4: 'dice-four',
    5: 'dice-five',
    6: 'dice-six',
  };

  constructor(sides = 6) {
    this.sides = sides;
    this.currentValue = 1;
  }

  roll() {
    this.currentValue = Math.floor(Math.random() * this.sides) + 1;
    return this.currentValue;
  }

  getIcon() {
    const iconName = Die.#sidesToIcon[this.currentValue] || `dice-${this.currentValue}`;
    return `<i class="fa fa-2xl fa-${iconName}"></i>`;
  }
}

class Player {
  constructor(name) {
    this.name = name;
    const colors = ['red', 'blue', 'green', 'yellow'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
    this.position = 0;
  }

  move(steps) {
    this.position += steps;
    if (this.position > 100) this.position = 100;
  }
}


const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const diceElement = document.getElementById('dicePlaceholder');
const rollDiceButton = document.getElementById('rollDiceButton');
const startGameBtn = document.getElementById('startGameBtn');
const turnIndicator = document.getElementById('turnIndicator');
const player1Label = document.getElementById('player1Label');
const player2Label = document.getElementById('player2Label');

let players = [];
let currentPlayerIndex = 0;
const dice = new Die(6);

function drawBoard() {
  const boardImg = new Image();
  boardImg.src = "images/board.jpg"; 
  boardImg.onload = () => {
    ctx.drawImage(boardImg, 0, 0, canvas.width, canvas.height);
    drawPlayers();
  };
}

function drawPlayers() {
  players.forEach(player => {
    const pos = getCoordinates(player.position);
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 15, 0, 2 * Math.PI);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.stroke();
  });
}

function getCoordinates(position) {
  if (position <= 0) return { x: 20, y: 720 };
  let row = Math.floor((position - 1) / 10);
  let col = (position - 1) % 10;

  if (row % 2 === 1) {
    col = 9 - col; 
  }

  const cellSize = 74;
  return {
    x: col * cellSize + cellSize / 2,
    y: 740 - (row * cellSize + cellSize / 2)
  };
}

function highlightActivePlayer() {
  player1Label.classList.remove('active-player');
  player2Label.classList.remove('active-player');
  if (currentPlayerIndex === 0) {
    player1Label.classList.add('active-player');
  } else {
    player2Label.classList.add('active-player');
  }
}

function updateTurnIndicator(lastRoll = null) {
  let currentPlayer = players[currentPlayerIndex];
  if (lastRoll) {
    turnIndicator.textContent = `${currentPlayer.name} rolled a ${lastRoll} (${currentPlayer.color})`;
  } else {
    turnIndicator.textContent = `${currentPlayer.name}'s turn (${currentPlayer.color})`;
  }
  highlightActivePlayer();
}

rollDiceButton.addEventListener('click', () => {
  const roll = dice.roll();
  diceElement.innerHTML = dice.getIcon();

  let currentPlayer = players[currentPlayerIndex];
  currentPlayer.move(roll);

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();


  if (currentPlayer.position === 100) {
    alert(`${currentPlayer.name} wins!`);
    rollDiceButton.disabled = true;
    turnIndicator.textContent = "Game Over";
    player1Label.classList.remove('active-player');
    player2Label.classList.remove('active-player');
    return;
  }


  updateTurnIndicator(roll);


  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  setTimeout(() => {
    updateTurnIndicator();
  }, 1500);
});

startGameBtn.addEventListener('click', () => {
  const p1 = document.getElementById('player1Name').value || "Player 1";
  const p2 = document.getElementById('player2Name').value || "Player 2";

  players = [new Player(p1), new Player(p2)];
  currentPlayerIndex = 0;


  player1Label.innerHTML = `<strong>${p1}:</strong> (${players[0].color})`;
  player2Label.innerHTML = `<strong>${p2}:</strong> (${players[1].color})`;

  rollDiceButton.disabled = false;
  drawBoard();
  updateTurnIndicator();
});
