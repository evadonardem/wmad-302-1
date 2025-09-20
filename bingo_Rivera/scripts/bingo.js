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
        
        /**
         * Initialize bingo ball instances from 1 to 75.
         * Breakdown:
         *     B - 1 to 15
         *     I - 16 to 30
         *     N - 31 to 45
         *     G - 46 to 60
         *     O - 61 to 75
         */

        // Initialize balls for each letter and range
        const ranges = {
            B: [1, 15],
            I: [16, 30],
            N: [31, 45],
            G: [46, 60],
            O: [61, 75]
        };

        for (const [letter, [start, end]] of Object.entries(ranges)) {
            for (let number = start; number <= end; number++) {
                this.#balls.push(new BingoBall(letter, number));
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
        if (this.#balls.length === 0) {
            return null;
        }

        let index = _.random(0, this.#balls.length - 1);
        return _.pullAt(this.#balls, index)[0];
    }

    reset() {
        this.#initBalls();
    }
}

class BingoCard {
    static #cellValueLookup = new Map([
        ['B', _.range(1, 15)],
        ['I', _.range(16, 30)],
        ['N', _.range(31, 45)],
        ['G', _.range(46, 60)],
        ['O', _.range(61, 75)],
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

        /**
         * Complete this loop condition block to complete
         * random BINGO card generator.
         */
        this.#cells = [];
        for (let i = 0; i < 5; i++) {
            this.#cells[i] = [];
            for (let j = 0; j < 5; j++) {
                // Assign random values to cells, ensuring the center cell is a free space
                if (i === 2 && j === 2) {
                    this.#cells[i][j] = { value: "FREE", isMarked: true };
                } else {
                    this.#cells[i][j] = {
                        value: randomCellValues.get(j)[i],
                        isMarked: false
                    };
                }
            }
        }
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

/**
 * Lucky cards templates
 */
const luckyCards = [
    [
        [true, true, true, true, true],
        [true, false, false, false, true],
        [true, true, true, true, true],
        [true, false, false, false, true],
        [true, true, true, true, true],
    ],
    [
        [true, true, true, true, true],
        [true, false, false, false, false],
        [true, true, true, true, false],
        [true, false, false, false, false],
        [true, true, true, true, true],
    ],
    [
        [true, false, false, false, true],
        [true, true, false, false, true],
        [true, false, true, false, true],
        [true, false, false, true, true],
        [true, false, false, false, true],
    ]
];

/**
 * Lucky cards cell matches lookup
 */
const luckyCardsCellMatches = luckyCards.map((rows) => {
    let cellMatches = [];
    rows.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell) {
                cellMatches.push(`${i}-${j}`);
            }
        });
    });
    cellMatches.sort();
    return cellMatches;
});


let cards = [];
let nabola = [];
const tambiolo = new BingoMachine();

function generateCards(count = 1) {
    let newCards = [];
    // generate cards using loops
    for (let i = 0; i < count; i++) {
        newCards.push(new BingoCard());
    }

    return newCards;
}

const shownCelebrations = new Set();

function showCelebration(cardIndex) {
    if (shownCelebrations.has(cardIndex)) return; // Prevent re-showing for the same card

    shownCelebrations.add(cardIndex);

    const celebrationDiv = document.createElement('div');
    celebrationDiv.id = 'celebration';
    celebrationDiv.style.position = 'fixed';
    celebrationDiv.style.top = '0';
    celebrationDiv.style.left = '0';
    celebrationDiv.style.width = '100%';
    celebrationDiv.style.height = '100%';
    celebrationDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    celebrationDiv.style.display = 'flex';
    celebrationDiv.style.alignItems = 'center';
    celebrationDiv.style.justifyContent = 'center';
    celebrationDiv.style.zIndex = '1000';
    celebrationDiv.innerHTML = `
        <div style="color: white; font-size: 3rem; text-align: center; animation: pop 1s ease-in-out infinite;">
            🎉 Congratulations! Lucky Card #${cardIndex + 1}! 🎉
        </div>
    `;

    document.body.appendChild(celebrationDiv);

    setTimeout(() => {
        document.body.removeChild(celebrationDiv);
    }, 3000);
}

// Add CSS animation for the pop effect
const style = document.createElement('style');
style.innerHTML = `
    @keyframes pop {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
`;
document.head.appendChild(style);

// Update checkLuckyCards to ensure cards that already celebrated won't trigger again
function checkLuckyCards() {
    cards.forEach((card, index) => {
        const cardMatches = card.rows.flatMap((row, i) =>
            row.map((cell, j) => (cell.isMarked ? `${i}-${j}` : null)).filter(Boolean)
        );

        card.luckyCard = luckyCardsCellMatches.some((luckyCard) =>
            luckyCard.every((match) => cardMatches.includes(match))
        );

        if (card.luckyCard && !shownCelebrations.has(index)) {
            showCelebration(index);
        }
    });
}

function render() {
    const cardsPlaceholderElem = document.getElementById('cardsPlaceholder');
    const luckyCardsPlaceholderElem = document.getElementById('luckyCardsPlaceholder');
    
    cardsPlaceholderElem.innerHTML = `<div class="row">
        ${cards.map((card) => {
            const rows = card.rows;
            return `<div class="col-md-4">
                <table class="table table-bordered text-center">
                    <thead class="table-primary">
                        <th>B</th>
                        <th>I</th>
                        <th>N</th>
                        <th>G</th>
                        <th>O</th>
                    </thead>
                    <tbody>
                    ${rows.map((row) => {
                        return `<tr>
                            <td class="${row[0].isMarked ? 'bg-danger' : ''}">${row[0].value}</td>
                            <td class="${row[1].isMarked ? 'bg-danger' : ''}">${row[1].value}</td>
                            <td class="${row[2].isMarked ? 'bg-danger' : ''}">${row[2].value}</td>
                            <td class="${row[3].isMarked ? 'bg-danger' : ''}">${row[3].value}</td>
                            <td class="${row[4].isMarked ? 'bg-danger' : ''}">${row[4].value}</td>
                        </tr>`;
                    }).join('')}
                    </tbody>
                    <tfoot class="${card.luckyCard ? 'table-success' : ''}">
                        <td colspan=5>${card.luckyCard ? 'Lucky Card!' : '&nbsp;'}</td>
                    </tfoot>
                </table>
            </div>`;
        }).join('')}
    </div>`;

    luckyCardsPlaceholderElem.innerHTML = luckyCards.map((luckyCard) => {
        return `<table class="table table-bordered text-center">
            <thead class="table-primary">
                <th>B</th>
                <th>I</th>
                <th>N</th>
                <th>G</th>
                <th>O</th>
            </thead>
            <tbody>
                ${luckyCard.map((row) => {
                    return `<tr>
                        <td class="${row[0] ? 'bg-danger' : ''}">&nbsp;</td>
                        <td class="${row[1] ? 'bg-danger' : ''}">&nbsp;</td>
                        <td class="${row[2] ? 'bg-danger' : ''}">&nbsp;</td>
                        <td class="${row[3] ? 'bg-danger' : ''}">&nbsp;</td>
                        <td class="${row[4] ? 'bg-danger' : ''}">&nbsp;</td>
                    </tr>`;
                }).join('')}
            </tbody>
        </table>`;
    }).join('');
    
    document.getElementById('drawnBallsPlaceholder').innerHTML = nabola.map((bola) => `
        <span class="badge bg-primary mb-1" style="border-radius: 50%; padding: 10px; width: 50px; height: 50px; display: inline-flex; align-items: center; justify-content: center;">
            ${bola.letter}<br>${bola.number}
        </span>`).join(' ');
}

/**
 * Events
 */
const numberOfCardsInput = document.getElementById('numberOfCards');
const rollBtn = document.getElementById('roll');
const drawBtn = document.getElementById('draw');

numberOfCardsInput.addEventListener('change', (event) => {
    const numberOfCards = event.target.value;
    cards  = generateCards(numberOfCards);
    nabola = [];
    tambiolo.reset();
    drawBtn.removeAttribute('disabled');
    render();
});


rollBtn.addEventListener('click', () => {
    tambiolo.roll();
});

drawBtn.addEventListener('click', () => {
    const drawnBall = tambiolo.draw();
    if (drawnBall) {
        nabola.push(drawnBall);

        // Mark cells on all cards
        cards.forEach((card) => {
            card.rows.forEach((row) => {
                row.forEach((cell) => {
                    if (cell.value === drawnBall.number) {
                        cell.isMarked = true;
                    }
                });
            });
        });

        // Check for lucky cards
        checkLuckyCards();

        // Render the page
        render();
    } else {
        alert('No more balls to draw!');
    }
});

render();