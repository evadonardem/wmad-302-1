document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const tileSize = 74;
  const boardSize = 10;

  const dicePlaceholder = document.getElementById("dicePlaceholder");
  const rollButton = document.getElementById("rollDiceButton");

  let playerPosition = 1;

  const snakes = {
    16: 6,
    48: 30,
    64: 60,
    79: 19,
    93: 68,
    95: 24,
    97: 76,
    98: 78,
  };

  const ladders = {
    1: 38,
    4: 14,
    9: 31,
    21: 42,
    28: 84,
    36: 44,
    51: 67,
    71: 91,
    80: 100,
  };

  function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Draw grid and numbers
    for (let i = 0; i < 100; i++) {
      const pos = i + 1;
      const { x, y } = getCoordinates(pos);
      ctx.strokeStyle = "#000";
      ctx.strokeRect(x, y, tileSize, tileSize);
      ctx.fillStyle = "#fff";
      ctx.fillText(pos, x + tileSize / 2, y + tileSize / 2);
    }

    drawLadders();
    drawSnakes();
    drawPlayer();
  }

  function getCoordinates(position) {
    let row = Math.floor((position - 1) / boardSize);
    let col = (position - 1) % boardSize;
    if (row % 2 === 1) col = boardSize - 1 - col;
    let x = col * tileSize;
    let y = (boardSize - 1 - row) * tileSize;
    return { x, y };
  }

  function drawPlayer() {
    const { x, y } = getCoordinates(playerPosition);
    ctx.beginPath();
    ctx.arc(x + tileSize / 2, y + tileSize / 2, 20, 0, 2 * Math.PI);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.stroke();
  }

  function drawLadders() {
    ctx.strokeStyle = "green";
    ctx.lineWidth = 6;

    Object.keys(ladders).forEach(start => {
      const end = ladders[start];
      const from = getCoordinates(Number(start));
      const to = getCoordinates(Number(end));
      drawLadder(from, to);
    });
  }

  function drawLadder(from, to) {
    ctx.beginPath();
    ctx.moveTo(from.x + tileSize / 2 - 10, from.y + tileSize / 2);
    ctx.lineTo(to.x + tileSize / 2 - 10, to.y + tileSize / 2);
    ctx.moveTo(from.x + tileSize / 2 + 10, from.y + tileSize / 2);
    ctx.lineTo(to.x + tileSize / 2 + 10, to.y + tileSize / 2);
    ctx.stroke();

    // Draw rungs
    const rungCount = 5;
    for (let i = 1; i < rungCount; i++) {
      const x1 = from.x + tileSize / 2 - 10 + ((to.x - from.x) * i) / rungCount;
      const y1 = from.y + tileSize / 2 + ((to.y - from.y) * i) / rungCount;
      const x2 = x1 + 20;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y1);
      ctx.stroke();
    }
  }

  function drawSnakes() {
    ctx.strokeStyle = "orange";
    ctx.lineWidth = 4;

    Object.keys(snakes).forEach(head => {
      const tail = snakes[head];
      const from = getCoordinates(Number(head));
      const to = getCoordinates(Number(tail));
      drawSnake(from, to);
    });
  }

  function drawSnake(from, to) {
    ctx.beginPath();
    ctx.moveTo(from.x + tileSize / 2, from.y + tileSize / 2);
    ctx.bezierCurveTo(
      from.x, from.y,
      to.x + tileSize, to.y,
      to.x + tileSize / 2, to.y + tileSize / 2
    );
    ctx.stroke();
  }

  function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
  }

  function movePlayer(steps) {
    let next = playerPosition + steps;
    if (next > 100) return;

    if (ladders[next]) next = ladders[next];
    else if (snakes[next]) next = snakes[next];

    playerPosition = next;
    drawBoard();

    if (playerPosition === 100) {
      setTimeout(() => {
        alert("🎉 You reached 100! You win!");
        playerPosition = 1;
        drawBoard();
      }, 100);
    }
  }

  rollButton.addEventListener("click", () => {
    const roll = rollDice();
    dicePlaceholder.textContent = roll;
    movePlayer(roll);
  });

  drawBoard();
});
