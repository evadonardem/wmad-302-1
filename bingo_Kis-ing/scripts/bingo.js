class BingoBall {
    constructor(letter, number) {
        this.letter = letter;
        this.number = number;
    }
}

class BingoMachine {
    #balls;

    constructor() {
        this.reset();
    }

    #initBalls() {
        this.#balls = [];
        const letterRanges = {
            B: [1, 15],
            I: [16, 30],
            N: [31, 45],
            G: [46, 60],
            O: [61, 75]
        };

        for (const [letter, [start, end]] of Object.entries(letterRanges)) {
            for (let num = start; num <= end; num++) {
                this.#balls.push(new BingoBall(letter, num));
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
        if (this.isEmpty()) return null;
        const index = _.random(0, this.#balls.length - 1);
        return _.pullAt(this.#balls, index)[0];
    }

    reset() {
        this.#initBalls();
        this.roll();
    }
}

class BingoCard {
    static #cellValueLookup = new Map([
        ['B', _.range(1, 16)],
        ['I', _.range(16, 31)],
        ['N', _.range(31, 46)],
        ['G', _.range(46, 61)],
        ['O', _.range(61, 76)]
    ]);

    #cells;
    #luckyCard = false;

    constructor() {
        this.#initCells();
    }

    #initCells() {
        this.#cells = [];

        const columnValues = {
            B: _.sampleSize(BingoCard.#cellValueLookup.get('B'), 5),
            I: _.sampleSize(BingoCard.#cellValueLookup.get('I'), 5),
            N: _.sampleSize(BingoCard.#cellValueLookup.get('N'), 5),
            G: _.sampleSize(BingoCard.#cellValueLookup.get('G'), 5),
            O: _.sampleSize(BingoCard.#cellValueLookup.get('O'), 5)
        };

        for (let row = 0; row < 5; row++) {
            this.#cells[row] = [];

            for (const letter of ['B', 'I', 'N', 'G', 'O']) {
                this.#cells[row].push({
                    value: columnValues[letter][row],
                    isMarked: false
                });
            }
        }

        this.#cells[2][2] = { value: "Free", isMarked: true };
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

    markNumber(ball) {
        const colIndex = ['B', 'I', 'N', 'G', 'O'].indexOf(ball.letter);
        for (let row = 0; row < 5; row++) {
            if (this.#cells[row][colIndex].value === ball.number) {
                this.#cells[row][colIndex].isMarked = true;
                return true;
            }
        }
        return false;
    }

    hasBingo() {
        for (let r = 0; r < 5; r++) {
            if (this.#cells[r].every(cell => cell.isMarked)) return true;
        }
        for (let c = 0; c < 5; c++) {
            let colMarked = true;
            for (let r = 0; r < 5; r++) {
                if (!this.#cells[r][c].isMarked) {
                    colMarked = false;
                    break;
                }
            }
            if (colMarked) return true;
        }
        let diag1 = true;
        let diag2 = true;
        for (let i = 0; i < 5; i++) {
            if (!this.#cells[i][i].isMarked) diag1 = false;
            if (!this.#cells[i][4 - i].isMarked) diag2 = false;
        }
        return diag1 || diag2;
    }
}

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

let cards = [];
let drawnBalls = [];
let bingoMachine = new BingoMachine();
let gameFinished = false;

function generateCards(count = 1) {
    const newCards = [];
    for (let i = 0; i < count; i++) {
        newCards.push(new BingoCard());
    }
    return newCards;
}

function checkLuckyCardPattern(card) {
    for (const pattern of luckyCards) {
        let patternMatched = true;
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                if (pattern[r][c]) {
                    if (!card.rows[r][c].isMarked) {
                        patternMatched = false;
                        break;
                    }
                }
            }
            if (!patternMatched) break;
        }
        if (patternMatched) {
            return true;
        }
    }
    return false;
}

function checkForWinners() {
    let hasWinner = false;
    for (const card of cards) {
        if (card.hasBingo() || checkLuckyCardPattern(card)) {
            card.luckyCard = true;
            hasWinner = true;
        } else {
            card.luckyCard = false;
        }
    }
    return hasWinner;
}

// ... rest of code unchanged ...

function render() {
    const cardsPlaceholder = document.getElementById('cardsPlaceholder');
    const drawnBallsPlaceholder = document.getElementById('drawnBallsPlaceholder');
    const luckyCardsPlaceholder = document.getElementById('luckyCardsPlaceholder');

    cardsPlaceholder.innerHTML = `
    <div class="row">
    ${cards
        .map(
            (card, idx) => `
            <div class="col-md-4 mb-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <h5>Card #${idx + 1}</h5>
                    ${
                        card.luckyCard
                            ? '<span class="badge bg-success fs-6">Winner!</span>'
                            : ''
                    }
                </div>
                <table class="table table-bordered text-center ${
                    card.luckyCard ? 'table-success' : ''
                }">
                    <thead class="table-primary">
                        <tr>
                            <th>B</th><th>I</th><th>N</th><th>G</th><th>O</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${card.rows
                            .map(
                                row => `
                            <tr>
                                ${row
                                    .map(
                                        cell => `<td class="${
                                            cell.isMarked ? 'bg-danger text-white fw-bold' : ''
                                        }">${cell.value}</td>`
                                    )
                                    .join('')}
                            </tr>
                        `
                            )
                            .join('')}
                    </tbody>
                </table>
            </div>`
        )
        .join('')}
    </div>`;

    drawnBallsPlaceholder.innerHTML = drawnBalls
        .map(
            ball =>
                `<span class="badge bg-primary me-1 mb-1" style="min-width:40px;">
                    ${ball.letter}<br>${ball.number}
                </span>`
        )
        .join('');

    luckyCardsPlaceholder.innerHTML = luckyCards
        .map(
            (luckyCard) => `
        <table class="table table-bordered text-center">
            <thead class="table-primary">
                <tr><th>B</th><th>I</th><th>N</th><th>G</th><th>O</th></tr>
            </thead>
            <tbody>
                ${luckyCard
                    .map(
                        (row) => `
                    <tr>
                        ${row
                            .map(
                                (cell) =>
                                    `<td class="${cell ? "bg-danger" : ""}">&nbsp;</td>`
                            )
                            .join("")}
                    </tr>
                `
                    )
                    .join("")}
            </tbody>
        </table>
    `
        )
        .join('');
}

const numberOfCardsInput = document.getElementById('numberOfCards');
const rollBtn = document.getElementById('roll');
const drawBtn = document.getElementById('draw');

numberOfCardsInput.addEventListener('change', (event) => {
    const count = parseInt(event.target.value) || 1;
    if (count < 1 || count > 10) {
        alert("Please enter a number between 1 and 10.");
        event.target.value = 1;
        return;
    }

    cards = generateCards(count);
    drawnBalls = [];
    bingoMachine.reset();
    gameFinished = false;
    drawBtn.removeAttribute('disabled');
    render();
});


drawBtn.addEventListener('click', () => {
    if (gameFinished) {
        alert("Game finished! Please reset the number of cards to start a new game.");
        return;
    }

    const ball = bingoMachine.draw();

    if (!ball) {
        alert("No more balls to draw!");
        drawBtn.setAttribute('disabled', 'true');
        return;
    }

    drawnBalls.push(ball);

    cards.forEach(card => {
        card.markNumber(ball);
    });

    if (checkForWinners()) {
        gameFinished = true;
        drawBtn.setAttribute('disabled', 'true');
        alert("We have a BINGO! Game finished.");
    }

    render();
});

cards = generateCards(1);
render();

const resetBtn = document.getElementById('reset');

resetBtn.addEventListener('click', () => {
    cards = generateCards(parseInt(numberOfCardsInput.value) || 1);
    drawnBalls = [];
    bingoMachine.reset();
    gameFinished = false;
    drawBtn.removeAttribute('disabled');
    render();
});

const shuffleAnimation = document.getElementById('shuffleAnimation');

rollBtn.addEventListener('click', () => {
  shuffleAnimation.style.display = 'block';  // Show animation

  // Simulate shuffle duration (e.g., 2 seconds)
  setTimeout(() => {
    bingoMachine.roll();
    shuffleAnimation.style.display = 'none';  // Hide animation
    alert('Balls shuffled!');
  }, 2000);
});
