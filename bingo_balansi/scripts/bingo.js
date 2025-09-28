//Bingo Game Logic

// Bingo column ranges
const BINGO_RANGES = {
    B: [1, 15],
    I: [16, 30],
    N: [31, 45],
    G: [46, 60],
    O: [61, 75]
};

// Utility: Generate unique random numbers for a column
function getUniqueNumbers(min, max, count) {
    const nums = new Set();
    while (nums.size < count) {
        nums.add(Math.floor(Math.random() * (max - min + 1)) + min);
    }
    return Array.from(nums);
}

// Generate a single bingo card data
function generateCardData() {
    const card = [];
    for (const col in BINGO_RANGES) {
        let numCount = 5;
        if (col === 'N') numCount = 4; // Middle cell is FREE
        card.push(getUniqueNumbers(BINGO_RANGES[col][0], BINGO_RANGES[col][1], numCount));
    }
    // Insert FREE cell in the center
    card[2].splice(2, 0, 'FREE');
    return card;
}

// Render a bingo card as HTML
function renderBingoCard(cardData, cardIndex) {
    let html = `
    <div class="bingo-card-container mb-4" id="bingoCard${cardIndex}">
        <table class="table table-sm table-bordered table-striped table-bingo mb-0">
            <thead>
                <tr>
                    <th class="text-center">B</th>
                    <th class="text-center">I</th>
                    <th class="text-center">N</th>
                    <th class="text-center">G</th>
                    <th class="text-center">O</th>
                </tr>
            </thead>
            <tbody>
    `;
    for (let row = 0; row < 5; row++) {
        html += '<tr>';
        for (let col = 0; col < 5; col++) {
            const val = cardData[col][row];
            const cellId = `card${cardIndex}_cell${row}_${col}`;
            if (val === 'FREE') {
                html += `<td class="text-center free-cell marked" id="${cellId}" data-row="${row}" data-col="${col}">FREE</td>`;
            } else {
                html += `<td class="text-center" id="${cellId}" data-row="${row}" data-col="${col}">${val}</td>`;
            }
        }
        html += '</tr>';
    }
    html += `
            </tbody>
        </table>
        <div class="d-flex justify-content-end mt-2">
            <button class="btn btn-light btn-sm rounded-pill shadow-sm" onclick="resetCard(${cardIndex})">
                <i class="fa fa-rotate"></i> Reset
            </button>
        </div>
    </div>
    `;
    return html;
}

// Generate and display multiple bingo cards
function generateBingoCards(count) {
    const cardsPlaceholderElement = document.getElementById('cardsPlaceholder');
    cardsPlaceholderElement.innerHTML = "";
    window.bingoCards = []; // Track card data and marks

    for (let i = 0; i < count; i++) {
        const cardData = generateCardData();
        window.bingoCards.push({
            data: cardData,
            marks: Array.from({ length: 5 }, (_, r) => Array(5).fill(false))
        });
        cardsPlaceholderElement.innerHTML += renderBingoCard(cardData, i);
    }
    attachCellListeners();
}

// Attach click listeners to all card cells
function attachCellListeners() {
    window.bingoCards.forEach((card, cardIdx) => {
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const cellId = `card${cardIdx}_cell${row}_${col}`;
                const cell = document.getElementById(cellId);
                if (cell && cell.textContent !== 'FREE') {
                    cell.onclick = () => toggleCellMark(cardIdx, row, col);
                }
            }
        }
    });
}

// Toggle cell mark and check for win
function toggleCellMark(cardIdx, row, col) {
    const card = window.bingoCards[cardIdx];
    card.marks[row][col] = !card.marks[row][col];
    const cellId = `card${cardIdx}_cell${row}_${col}`;
    const cell = document.getElementById(cellId);
    cell.classList.toggle('marked', card.marks[row][col]);
    cell.style.background = card.marks[row][col] ? 'linear-gradient(90deg,#dbeafe,#e0e7ff)' : '';
    cell.style.color = card.marks[row][col] ? '#2563eb' : '';
    checkWin(cardIdx);
}

// Check for winning patterns
function checkWin(cardIdx) {
    const marks = window.bingoCards[cardIdx].marks;
    // Helper: Check array for all true
    const allTrue = arr => arr.every(Boolean);

    // Rows & Columns
    for (let i = 0; i < 5; i++) {
        if (allTrue(marks[i])) showWin(cardIdx, 'Row');
        if (allTrue(marks.map(row => row[i]))) showWin(cardIdx, 'Column');
    }
    // Diagonals
    if (allTrue([0,1,2,3,4].map(i => marks[i][i]))) showWin(cardIdx, 'Diagonal');
    if (allTrue([0,1,2,3,4].map(i => marks[i][4-i]))) showWin(cardIdx, 'Diagonal');
    // Blackout
    if (allTrue(marks.flat())) showWin(cardIdx, 'Blackout');
}

// Show win modal/alert
function showWin(cardIdx, type) {
    if (document.getElementById('winModal')) return; // Prevent duplicate modals
    const modal = document.createElement('div');
    modal.id = 'winModal';
    modal.innerHTML = `
        <div style="
            position:fixed;top:0;left:0;width:100vw;height:100vh;
            background:rgba(60,60,60,0.15);display:flex;align-items:center;justify-content:center;z-index:9999;">
            <div style="
                background:linear-gradient(90deg,#f5f7fa,#e3eafc);
                border-radius:1.25rem;box-shadow:0 8px 32px rgba(60,60,60,0.12);
                padding:2rem 2.5rem;max-width:90vw;text-align:center;">
                <i class="fa-solid fa-trophy" style="color:#059669;font-size:2.5rem;"></i>
                <h3 class="mt-3 mb-2" style="color:#2563eb;">BINGO!</h3>
                <p class="mb-3" style="font-size:1.1rem;color:#334155;">You won with a <b>${type}</b> on Card ${cardIdx+1}!</p>
                <button class="btn btn-primary rounded-pill px-4" onclick="closeWinModal()">OK</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Close win modal
function closeWinModal() {
    const modal = document.getElementById('winModal');
    if (modal) modal.remove();
}

// Reset a bingo card
function resetCard(cardIdx) {
    const cardData = generateCardData();
    window.bingoCards[cardIdx].data = cardData;
    window.bingoCards[cardIdx].marks = Array.from({ length: 5 }, () => Array(5).fill(false));
    document.getElementById(`bingoCard${cardIdx}`).outerHTML = renderBingoCard(cardData, cardIdx);
    attachCellListeners();
}

// Initial setup: listen for card count changes
document.getElementById('numberOfCards').addEventListener('change', (event) => {
    const numberOfCards = Math.max(1, Math.min(10, Number(event.target.value)));
    generateBingoCards(numberOfCards);
});

// Marked cell style 
document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.innerHTML = `
        .marked {
            background: linear-gradient(90deg,#dbeafe,#e0e7ff) !important;
            color: #2563eb !important;
            font-weight: bold;
            box-shadow: 0 0 0 2px #3b82f6 inset;
            transition: background 0.2s, color 0.2s;
        }
    `;
    document.head.appendChild(style);
});