class Die {
    static #sidesToIcon = {
      1: 'dice-one', 2: 'dice-two', 3: 'dice-three',
      4: 'dice-four', 5: 'dice-five', 6: 'dice-six'
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
      return `<i class="fa fa-2xl fa-${iconName}"></i><br><strong>${this.currentValue}</strong>`;
    }
  }
  
  class Player {
    constructor(name, number) {
      this.name = name;
      const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange'];
      this.color = colors[(number - 1) % colors.length];
      this.position = 0;
    }
    move(steps) {
      this.position += steps;
      if (this.position > 100) this.position = 100;
    }
  }
  
  const canvas = document.querySelector('#boardPlaceholder canvas');
  const ctx = canvas.getContext('2d');
  const diceElement = document.getElementById('dicePlaceholder');
  const rollDiceButton = document.getElementById('rollDiceButton');
  const addPlayerButton = document.getElementById('addPlayerButton');
  const startGameButton = document.getElementById('startGameButton');
  const playerList = document.getElementById('playerList');
  const turnInfo = document.getElementById('turnInfo');
  const statusPanel = document.getElementById('statusPanel');
  
  const dice = new Die();
  let players = [];
  let currentPlayerIndex = 0;
  let gameStarted = false;
  let winner = null;
  
  const snakes = { 25: 3, 42: 1, 56: 48, 61: 43, 92: 67, 94: 12, 98: 80 };
  const ladders = { 7: 30, 16: 33, 20: 38, 36: 83, 50: 68, 63: 81, 71: 89, 86: 97 };
  
  const modal = document.createElement('div');
  modal.innerHTML = `
  <div class="modal fade" id="gameFinishedModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content text-center">
        <div class="modal-header bg-success text-white">
          <h5 class="modal-title w-100">🎉 Game Finished 🎉</h5>
        </div>
        <div class="modal-body">
          <p id="winnerName" class="fs-4 fw-bold"></p>
          <button id="restartGameButton" class="btn btn-primary m-1">Restart Game</button>
          <button id="exitGameButton" class="btn btn-secondary m-1">Exit</button>
        </div>
      </div>
    </div>
  </div>`;
  document.body.appendChild(modal);
  
  function getCoords(square) {
    if (square <= 0) return { x: 37, y: 740 - 37 };
    const cell = 74;
    const idx = square - 1;
    const row = Math.floor(idx / 10);
    let col = idx % 10;
    if (row % 2 === 1) col = 9 - col;
    return { x: col * cell + cell / 2, y: 740 - (row * cell + cell / 2) };
  }
  
  function drawPlayers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    players.forEach((p) => {
      const { x, y } = getCoords(p.position);
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.stroke();
      ctx.fillStyle = '#fff';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(p.name.charAt(0).toUpperCase(), x, y);
    });
  }
  
  function renderPlayerList() {
    playerList.innerHTML = '';
    players.forEach(p => {
      const div = document.createElement('div');
      div.style.color = p.color;
      div.style.fontWeight = 'bold';
      div.textContent = `${p.name} (Color: ${p.color})`;
      playerList.appendChild(div);
    });
  }
  
  function updateTurnInfo(message = '') {
    if (!gameStarted) {
      turnInfo.innerHTML = '';
      statusPanel.innerHTML = '';
      return;
    }
    const cp = players[currentPlayerIndex];
    turnInfo.innerHTML = `<strong>Current Turn:</strong> ${cp.name} 
        <span style="display:inline-block;width:16px;height:16px;background:${cp.color};border-radius:50%;margin-left:8px;"></span>`;
    let html = '';
    players.forEach((p, idx) => {
      html += `<div style="${idx === currentPlayerIndex ? 'font-weight:bold;' : ''}">${p.name}: ${p.position}${idx === currentPlayerIndex ? ' 👈' : ''}</div>`;
    });
    if (message) {
      html = `<div style="margin-bottom:8px;color:#0a58ca;">${message}</div>` + html;
    }
    statusPanel.innerHTML = html;
  }
  
  function showWinnerModal(player) {
    winner = player;
    const winnerName = document.getElementById('winnerName');
    winnerName.textContent = `${player.name} Wins the Game! 🏆`;
    const modalElement = new bootstrap.Modal(document.getElementById('gameFinishedModal'));
    modalElement.show();
  }
  
  function animatePlayerMove(player, targetPos, callback) {
    const step = targetPos > player.position ? 1 : -1;
    let current = player.position;
    const moveInterval = setInterval(() => {
      current += step;
      player.position = current;
      drawPlayers();
      if (current === targetPos) {
        clearInterval(moveInterval);
        if (callback) callback();
      }
    }, 150);
  }
  
  addPlayerButton.addEventListener('click', () => {
    if (players.length >= 6) {
      alert("Maximum of 6 players only!");
      return;
    }
    const playerName = prompt(`Enter Player ${players.length + 1} name:`) || `Player ${players.length + 1}`;
    players.push(new Player(playerName, players.length + 1));
    renderPlayerList();
  });
  
  startGameButton.addEventListener('click', () => {
    if (players.length < 2) {
      alert("Add at least 2 players to start.");
      return;
    }
    players.forEach(p => p.position = 0);
    currentPlayerIndex = 0;
    gameStarted = true;
    winner = null;
    diceElement.innerHTML = dice.getIcon();
    drawPlayers();
    updateTurnInfo("Game started!");
  });
  
  rollDiceButton.addEventListener('click', () => {
    if (!gameStarted) {
      alert("Start the game first!");
      return;
    }
    const player = players[currentPlayerIndex];
    const roll = dice.roll();
    diceElement.innerHTML = dice.getIcon();
  
    let finalTarget = player.position + roll;
    if (finalTarget > 100) finalTarget = 100;
  
    animatePlayerMove(player, finalTarget, () => {
      if (ladders[player.position]) {
        animatePlayerMove(player, ladders[player.position], checkWin);
      } else if (snakes[player.position]) {
        animatePlayerMove(player, snakes[player.position], checkWin);
      } else {
        checkWin();
      }
    });
  
    function checkWin() {
      updateTurnInfo(`${player.name} rolled a ${roll}`);
      if (player.position === 100) {
        gameStarted = false;
        drawPlayers();
        setTimeout(() => showWinnerModal(player), 500);
        return;
      }
      currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
      updateTurnInfo();
    }
  });
  
  document.addEventListener('click', (e) => {
    if (e.target.id === 'restartGameButton') {
      const modalInstance = bootstrap.Modal.getInstance(document.getElementById('gameFinishedModal'));
      modalInstance.hide();
      players.forEach(p => p.position = 0);
      currentPlayerIndex = 0;
      gameStarted = true;
      winner = null;
      drawPlayers();
      updateTurnInfo("New game started!");
    }
    if (e.target.id === 'exitGameButton') {
      window.location.reload();
    }
  });
  
  drawPlayers();
  diceElement.innerHTML = dice.getIcon();
  