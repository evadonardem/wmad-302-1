    class Die {
        static #sidesToIcon = {
            1: 'dice-one',
            2: 'dice-two',
            3: 'dice-three',
            4: 'dice-four',
            5: 'dice-five',
            6: 'dice-six'
        };

        constructor(sides = 6) {
            this.sides = sides;
            this.value = 1;
        }

        roll() {
            this.value = Math.floor(Math.random() * this.sides) + 1;
            return this.value;
        }

        getIcon() {
            const icon = Die.#sidesToIcon[this.value] || 'dice';
            return `<i class="fa fa-2xl fa-${icon}"></i>`;
        }
    }

    class Player {
        static availableColors = ["red", "blue", "green", "yellow"];
        static usedColors = [];

        constructor(name) {
            this.name = name;
            this.color = this.assignUniqueColor();
            this.position = 0;
            this.winner = false;
        }

        assignUniqueColor() {
            for (let color of Player.availableColors) {
                if (!Player.usedColors.includes(color)) {
                    Player.usedColors.push(color);
                    return color;
                }
            }
            const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
            Player.usedColors.push(randomColor);
            return randomColor;
        }

        move(steps) {
            if (this.winner) return;
                let newPos = this.position + steps;
        // Check if it goes beyond 100 → bounce back
            if (newPos > 100) {
                const overshoot = newPos - 100;
                newPos = 100 - overshoot;
            }
            this.position = newPos;
            if (this.position === 100) {
                this.winner = true;
            }
        }
    }

    // ===== Game Logic =====
    const diceElement = document.getElementById('dicePlaceholder');
    const rollDiceButton = document.getElementById('rollDiceButton');
    const restartButton = document.getElementById('restartButton');
    const playerForm = document.getElementById('playerForm');
    const playerNameInput = document.getElementById('playerName');
    const playerList = document.getElementById('playerList');

    const boardCanvas = document.querySelector("#boardPlaceholder canvas");
    const ctx = boardCanvas.getContext("2d");

    const dice = new Die(6);
    let players = [];
    let currentPlayerIndex = 0;
    let gameOver = false;

    // ===== Snakes & Ladders Mapping =====
    const snakesAndLadders = {
        // ladders
        7: 30,
        16: 33,
        20: 38,
        36: 83,
        50: 68,
        63: 81,
        71: 89,
        86: 97,

        // snakes
        25:3,
        42: 1,
        56: 48,
        61: 43,
        92: 67,
        94: 12,
        98: 80,
    };

    // ===== Helpers =====
    const squareSize = 74;

    // Convert board position (1–100) to grid coordinates
    function getCoordinates(pos) {
        if (pos < 1) pos = 1;
        if (pos > 100) pos = 100;

        const row = Math.floor((pos - 1) / 10);
        const col = (row % 2 === 0)
            ? (pos - 1) % 10
            : 9 - ((pos - 1) % 10);

        return {
            x: col,
            y: 9 - row
        };
    }

    function drawChips() {
        ctx.clearRect(0, 0, boardCanvas.width, boardCanvas.height);

    // Group players by cell
    const groupedByCell = {};
    players.forEach(player => {
        if (player.position < 1) return;
        if (!groupedByCell[player.position]) groupedByCell[player.position] = [];
        groupedByCell[player.position].push(player);
    });

    for (let pos in groupedByCell) {
            const cell = parseInt(pos);
            const row = Math.floor((cell - 1) / 10);
            const col = (row % 2 === 0)
                ? (cell - 1) % 10
                : 9 - ((cell - 1) % 10);

            const baseX = col * squareSize + squareSize / 2;
            const baseY = (9 - row) * squareSize + squareSize / 2;

            const playersHere = groupedByCell[cell];

            playersHere.forEach((player, i) => {
                const angle = (i / playersHere.length) * 2 * Math.PI;
                const radius = 18; 
                const x = baseX + Math.cos(angle) * radius;
                const y = baseY + Math.sin(angle) * radius;

                if (players[currentPlayerIndex] === player && !gameOver) {
                    ctx.beginPath();
                    ctx.arc(x, y, 25, 0, 2 * Math.PI);
                    ctx.fillStyle = "rgba(255, 255, 0, 0.4)";
                    ctx.fill();
                }

                    ctx.beginPath();
                    ctx.arc(x, y, 15, 0, 2 * Math.PI);
                    ctx.fillStyle = player.color;
                    ctx.fill();
                    ctx.stroke();

                    ctx.fillStyle = "white";
                    ctx.font = "bold 12px Arial";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(player.name.charAt(0).toUpperCase(), x, y);
            });
        }
    }

    function renderPlayers() {
        playerList.innerHTML = "";
        players.forEach((player, index) => {
            const li = document.createElement('li');
            li.classList.add("list-group-item", "d-flex", "align-items-center");

            const chip = document.createElement('span');
            chip.style.display = "inline-block";
            chip.style.width = "16px";
            chip.style.height = "16px";
            chip.style.borderRadius = "50%";
            chip.style.marginRight = "8px";
            chip.style.backgroundColor = player.color;
            chip.style.border = "1px solid #333";

            let text = `${player.name} - Pos: ${player.position}`;
            if (player.winner) {
                text += " 🏆 WINNER!";
                li.classList.add("list-group-item-success");
            }
            if (index === currentPlayerIndex && !gameOver) {
                li.classList.add("active-player");
            }

            li.appendChild(chip);
            li.appendChild(document.createTextNode(text));
            playerList.appendChild(li);
        });

        drawChips();
    }

    // ===== Animations =====
    function animateMove(player, targetPos, callback) {
        let tempPos = player.position;
        let step = (targetPos > tempPos) ? 1 : -1;

        function moveStep() {
            if (tempPos !== targetPos) {
                tempPos += step;
                player.position = tempPos;
                renderPlayers();
                setTimeout(moveStep, 200);
            } else {
                player.position = targetPos;
                if (callback) callback();
            }
        }
        moveStep();
    }

    // Smooth slide (for snakes/ladders)
    function animateSlide(player, targetPos, callback) {
        const startCoords = getCoordinates(player.position);
        const endCoords = getCoordinates(targetPos);

        const steps = 30;
        let currentStep = 0;

        const startX = startCoords.x * squareSize + squareSize / 2;
        const startY = startCoords.y * squareSize + squareSize / 2;
        const endX = endCoords.x * squareSize + squareSize / 2;
        const endY = endCoords.y * squareSize + squareSize / 2;

        const controlX = (startX + endX) / 2 + (Math.random() * 60 - 30);
        const controlY = startY > endY
            ? (startY + endY) / 2 - 120
            : (startY + endY) / 2 + 120;

    function slideStep() {
        if (currentStep <= steps) {
            const t = currentStep / steps;
            const x = (1 - t) ** 2 * startX + 2 * (1 - t) * t * controlX + t ** 2 * endX;
            const y = (1 - t) ** 2 * startY + 2 * (1 - t) * t * controlY + t ** 2 * endY;

            ctx.clearRect(0, 0, boardCanvas.width, boardCanvas.height);
            drawChips();

            ctx.beginPath();
            ctx.arc(x, y, 15, 0, 2 * Math.PI);
            ctx.fillStyle = player.color;
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "white";
            ctx.font = "bold 12px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(player.name.charAt(0).toUpperCase(), x, y);

            currentStep++;
            setTimeout(slideStep, startY > endY ? 30 : 60);
        } else {
            player.position = targetPos;
            renderPlayers();
            if (callback) callback();
        }
    }
    slideStep();
    }

    // ===== Events =====
    playerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = playerNameInput.value.trim();
        if (!name) return;

        const player = new Player(name);
        players.push(player);

        playerNameInput.value = '';
        rollDiceButton.disabled = false;

        renderPlayers();
    });

    rollDiceButton.addEventListener('click', () => {
        if (players.length === 0) return alert("Add at least one player!");
        if (gameOver) return alert("Game over! Please restart.");

        const player = players[currentPlayerIndex];
        const roll = dice.roll();

        // 🎲 Realistic random dice roll animation
        diceElement.style.transition = "transform 1s ease-in-out";
        diceElement.style.transform = `rotateX(${720 + Math.random() * 360}deg) rotateY(${720 + Math.random() * 360}deg) rotateZ(${Math.random() * 360}deg)`;

        // Reset transform after animation finishes
        setTimeout(() => {
            diceElement.style.transition = "";
            diceElement.style.transform = "";

            // Update the dice icon and number after it stops rolling
            diceElement.innerHTML = `${dice.getIcon()} <span style="font-size:20px; margin-left:8px;">(${roll})</span>`;
        }, 1000);

        let newPos = player.position + roll;


        // Animate the move with exact bounce logic
        animateMove(player, (() => {
            let tempPos = player.position + roll;
            if (tempPos > 100) tempPos = 100 - (tempPos - 100);
            return tempPos;
        })(), () => {
            const targetPos = snakesAndLadders[player.position];

            if (targetPos && targetPos > player.position) {
                // Ladder → climb up
                animateSlide(player, targetPos, () => finishTurn(player));
            } else if (targetPos && targetPos < player.position) {
                // Snake → slide down
                animateSlide(player, targetPos, () => finishTurn(player));
            } else {
                // Normal cell
                finishTurn(player);
            }
        });
    });


    function finishTurn(player) {
        if (player.position >= 100) {
            player.position = 100;
            player.winner = true;
            gameOver = true;
            const overlay = document.getElementById('winnerOverlay');
            const winnerText = document.getElementById('winnerText');
            const closeBtn = document.getElementById('closeWinner');

            winnerText.textContent = `Player ${player.name} reached 100 and is the WINNER! 🏆`;
            overlay.classList.remove('d-none');

            closeBtn.addEventListener('click', () => {
            overlay.classList.add('d-none');
        });
        renderPlayers();
        return;
    }

    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        renderPlayers();
    }

    restartButton.addEventListener('click', () => {
        players = [];
        Player.usedColors = [];
        currentPlayerIndex = 0;
        gameOver = false;
        playerList.innerHTML = '';
        diceElement.innerHTML = '';
        ctx.clearRect(0, 0, boardCanvas.width, boardCanvas.height);
        rollDiceButton.disabled = true;
        alert("Game restarted!");
    });
