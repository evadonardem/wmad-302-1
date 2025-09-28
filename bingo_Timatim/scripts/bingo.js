class BingoBall {
  constructor(letter, number) {
    this.letter = letter;
    this.number = number;
  }
}

class BingoMachine {
  #balls;

  constructor() {
    this.#initBalls();
  }

  #initBalls() {
    this.#balls = [];
    const ranges = { B: [1, 15], I: [16, 30], N: [31, 45], G: [46, 60], O: [61, 75] };
    for (let [letter, [start, end]] of Object.entries(ranges)) {
      for (let n = start; n <= end; n++) {
        this.#balls.push(new BingoBall(letter, n));
      }
    }
  }

  isEmpty() {
    return this.#balls.length === 0;
  }

  roll() {
    this.#balls = _.shuffle(this.#balls);
  }

  draw() {
    if (this.#balls.length === 0) return null;
    let index = _.random(0, this.#balls.length - 1);
    return _.pullAt(this.#balls, index)[0];
  }

  reset() {
    this.#initBalls();
  }
}

class BingoCard {
  static #cellValueLookup = new Map([
    ['B', _.range(1, 16)],
    ['I', _.range(16, 31)],
    ['N', _.range(31, 46)],
    ['G', _.range(46, 61)],
    ['O', _.range(61, 76)],
  ]);

  #cells;
  #luckyCard = false;

  constructor() {
    this.#initCells();
  }

  #initCells() {
    let randomCellValues = new Map([
      [0, _.sampleSize(BingoCard.#cellValueLookup.get('B'), 5)],
      [1, _.sampleSize(BingoCard.#cellValueLookup.get('I'), 5)],
      [2, _.sampleSize(BingoCard.#cellValueLookup.get('N'), 5)],
      [3, _.sampleSize(BingoCard.#cellValueLookup.get('G'), 5)],
      [4, _.sampleSize(BingoCard.#cellValueLookup.get('O'), 5)],
    ]);

    this.#cells = [];
    for (let i = 0; i < 5; i++) {
      this.#cells[i] = [];
      for (let j = 0; j < 5; j++) {
        this.#cells[i].push({
          value: randomCellValues.get(j)[i],
          isMarked: false
        });
      }
    }
    this.#cells[2][2] = { value: "FREE", isMarked: true };
  }

  get rows() {
    return this.#cells;
  }

  set luckyCard(value) {
    this.#luckyCard = value;
  }

  get luckyCard() {
    return this.#luckyCard;
  }
}

// Lucky cards templates
const luckyCards = [
  [
    [true, false, false, true, true],
    [true, false, true, false, false],
    [true, true, false, false, false],
    [true, false, true, false, false],
    [true, false, false, true, true],
  ],
  [
    [false, true, true, true, false],
    [true, false, false, false, true],
    [true, false, false, false, false],
    [true, false, false, false, true],
    [false, true, true, true, false],
  ],
  [
    [true, true, true, true, false],
    [true, false, false, false, true],
    [true, false, false, false, true],
    [true, true, true, true, false],
    [true, false, false, false, false],
  ]
];

// Lucky cards cell matches lookup
const luckyCardsCellMatches = luckyCards.map((rows) => {
  let cellMatches = [];
  rows.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell) cellMatches.push(`${i}-${j}`);
    });
  });
  cellMatches.sort();
  return cellMatches;
});

let cards = [];
let nabola = [];
const tambiolo = new BingoMachine();
let drawInterval = null;

function generateCards(count = 1) {
  let newCards = [];
  for (let i = 0; i < count; i++) {
    newCards.push(new BingoCard());
  }
  return newCards;
}

function checkLuckyCards() {
  for (let cardIndex = 0; cardIndex < cards.length; cardIndex++) {
    let card = cards[cardIndex];
    let matchedCells = [];
    card.rows.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell.isMarked) matchedCells.push(`${i}-${j}`);
      });
    });
    matchedCells.sort();

    for (let luckyPattern of luckyCardsCellMatches) {
      if (_.isEqual(luckyPattern, _.intersection(luckyPattern, matchedCells))) {
        card.luckyCard = true;
        return cardIndex; // return the winning card index
      }
    }
  }
  return -1;
}

function render() {
  const cardsPlaceholderElem = document.getElementById('cardsPlaceholder');
  const luckyCardsPlaceholderElem = document.getElementById('luckyCardsPlaceholder');
  const colColors = ["#f8d7da", "#d1ecf1", "#d4edda", "#fff3cd", "#e2e3e5"];

  cardsPlaceholderElem.innerHTML = `<div class="row">
    ${cards.map((card) => {
      const rows = card.rows;
      return `<div class="col-md-6 mb-3">
        <table class="table table-bordered text-center shadow">
          <thead>
            <tr>
              <th style="background:${colColors[0]}">B</th>
              <th style="background:${colColors[1]}">I</th>
              <th style="background:${colColors[2]}">N</th>
              <th style="background:${colColors[3]}">G</th>
              <th style="background:${colColors[4]}">O</th>
            </tr>
          </thead>
          <tbody>
          ${rows.map((row) => {
            return `<tr>
              ${row.map((c, colIndex) => {
                let bg = colColors[colIndex];
                let classes = "";
                if (c.value === "FREE") {
                  bg = "#28a745";
                  classes = "text-white fw-bold";
                }
                if (c.isMarked && c.value !== "FREE") {
                  bg = "#dc3545";
                  classes = "text-white fw-bold";
                }
                return `<td style="background:${bg}" class="${classes}">${c.value}</td>`;
              }).join('')}
            </tr>`;
          }).join('')}
          </tbody>
          <tfoot class="${card.luckyCard ? 'table-success' : ''}">
            <td colspan=5>${card.luckyCard ? '🎉 Lucky Card Wins! 🎉' : '&nbsp;'}</td>
          </tfoot>
        </table>
      </div>`;
    }).join('')}
  </div>`;

  luckyCardsPlaceholderElem.innerHTML = luckyCards.map((luckyCard) => {
    return `<table class="table table-bordered text-center mb-2 shadow">
      <thead>
        <tr>
          <th style="background:${colColors[0]}">B</th>
          <th style="background:${colColors[1]}">I</th>
          <th style="background:${colColors[2]}">N</th>
          <th style="background:${colColors[3]}">G</th>
          <th style="background:${colColors[4]}">O</th>
        </tr>
      </thead>
      <tbody>
        ${luckyCard.map((row) => {
          return `<tr>${row.map((c, colIndex) => {
            return `<td style="background:${c ? '#dc3545' : colColors[colIndex]}">&nbsp;</td>`;
          }).join('')}</tr>`;
        }).join('')}
      </tbody>
    </table>`;
  }).join('');

  document.getElementById('drawnBallsPlaceholder').innerHTML = nabola.map((bola) =>
    `<span class="badge bg-primary mb-1">${bola.letter}<br>${bola.number}</span>`).join(' ');
}

// Events
const numberOfCardsInput = document.getElementById('numberOfCards');
const rollBtn = document.getElementById('roll');
const drawBtn = document.getElementById('draw');
const playAgainBtn = document.getElementById('playAgain');

numberOfCardsInput.addEventListener('change', (event) => {
  const numberOfCards = event.target.value;
  cards = generateCards(numberOfCards);
  nabola = [];
  tambiolo.reset();
  drawBtn.removeAttribute('disabled');
  render();
});

rollBtn.addEventListener('click', () => {
  tambiolo.roll();
});

drawBtn.addEventListener('click', () => {
  if (drawInterval) return;
  drawInterval = setInterval(() => {
    if (tambiolo.isEmpty()) {
      clearInterval(drawInterval);
      return;
    }
    let bola = tambiolo.draw();
    nabola.push(bola);

    for (let card of cards) {
      card.rows.forEach(row => {
        row.forEach(cell => {
          if (cell.value === bola.number) {
            cell.isMarked = true;
          }
        });
      });
    }

    let winnerIndex = checkLuckyCards();
    if (winnerIndex !== -1) {
      clearInterval(drawInterval);
      const winnerMessageElem = document.getElementById("winnerMessage");
      winnerMessageElem.innerHTML = `🎉 Lucky Card #${winnerIndex + 1} Wins! 🎉`;
      winnerMessageElem.style.display = "block";
      playAgainBtn.style.display = "inline-block";
    }

    render();
  }, 1500);
});

playAgainBtn.addEventListener('click', () => {
  nabola = [];
  tambiolo.reset();
  const numberOfCards = numberOfCardsInput.value || 1;
  cards = generateCards(numberOfCards);
  drawBtn.removeAttribute('disabled');
  drawInterval = null;
  playAgainBtn.style.display = 'none';
  document.getElementById("winnerMessage").style.display = "none";
  render();
});

render();
