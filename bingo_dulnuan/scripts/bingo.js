class BingoBall {
    constructor(letter, number) {
      this.letter = letter;
      this.number = number;
    }
  }

  class BingoMachine {
    #balls;
    constructor() { this.#initBalls(); }
    #initBalls() {
      this.#balls = [];
      let ranges = { B:[1,15], I:[16,30], N:[31,45], G:[46,60], O:[61,75] };
      for (let [letter,[min,max]] of Object.entries(ranges)) {
        for (let n=min;n<=max;n++) {
          this.#balls.push(new BingoBall(letter,n));
        }
      }
    }
    isEmpty() { return this.#balls.length===0; }
    roll() { this.#balls = _.shuffle(this.#balls); }
    draw() {
      if(this.isEmpty()) return null;
      let index = _.random(0,this.#balls.length-1);
      return _.pullAt(this.#balls,index)[0];
    }
    reset() { this.#initBalls(); }
  }

  class BingoCard {
    static #cellValueLookup = new Map([
      ['B', _.range(1,15)],
      ['I', _.range(16,30)],
      ['N', _.range(31,45)],
      ['G', _.range(46,60)],
      ['O', _.range(61,75)]
    ]);
    #cells;
    #luckyCard=false;
    constructor() { this.#initCells(); }
    #initCells() {
      this.#cells=[];
      let cols=['B','I','N','G','O'];
      for(let c=0;c<5;c++){
        let nums=_.sampleSize(BingoCard.#cellValueLookup.get(cols[c]),5);
        for(let r=0;r<5;r++){
          if(!this.#cells[r]) this.#cells[r]=[];
          this.#cells[r][c]={ value: nums[r], isMarked:false };
        }
      }
      this.#cells[2][2]={ value:"★", isMarked:true }; 
    }
    get rows(){ return this.#cells; }
    markBall(ball){
      for(let r=0;r<5;r++){
        for(let c=0;c<5;c++){
          if(this.#cells[r][c].value===ball.number){
            this.#cells[r][c].isMarked=true;
          }
        }
      }
    }
    set luckyCard(v){ this.#luckyCard=v; }
    get luckyCard(){ return this.#luckyCard; }
  }

  const luckyCards = [
    [
      [true,false,false,true,true],
      [true,false,true,false,false],
      [true,true,false,false,false],
      [true,false,true,false,false],
      [true,false,false,true,true],
    ],
    [
      [false,true,true,true,false],
      [true,false,false,false,true],
      [true,false,false,false,false],
      [true,false,false,false,true],
      [false,true,true,true,false],
    ],
    [
      [true,true,true,true,false],
      [true,false,false,false,true],
      [true,false,false,false,true],
      [true,true,true,true,false],
      [true,false,false,false,false],
    ]
  ];

  const luckyCardsCellMatches = luckyCards.map(rows => {
  let cellMatches = [];
  rows.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell) cellMatches.push(`${i}-${j}`);
    });
  });
  return cellMatches.sort();
});


  let cards=[];
  let nabola=[];
  let history=[];
  let round=0;
  const tambiolo=new BingoMachine();


  function getBallColor(letter){
    switch(letter){
      case 'B': return 'primary';
      case 'I': return 'danger';
      case 'N': return 'success';
      case 'G': return 'warning';
      case 'O': return 'purple';
      default: return 'secondary';
    }
  }


  function launchConfetti() {
    var duration = 2 * 1000; 
    var end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }

 
  function generateCards(count=1){
    let newCards=[];
    for(let i=0;i<count;i++) newCards.push(new BingoCard());
    return newCards;
  }

 
function checkLuckyCards() {
  cards.forEach(card => {
    let marked = [];
    card.rows.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell.isMarked) marked.push(`${i}-${j}`);
      });
    });
    marked.sort();
    let isLucky = luckyCardsCellMatches.some(lucky => {
      return lucky.every(pos => marked.includes(pos));
    });
    card.luckyCard = isLucky;
  }); 
}

  function checkBingo(card){
    let r=card.rows;
    for(let i=0;i<5;i++){
      if(r[i].every(c=>c.isMarked)) return true;
      if(r.every(row=>row[i].isMarked)) return true;
    }
    if(r.every((row,i)=>row[i].isMarked)) return true;
    if(r.every((row,i)=>row[4-i].isMarked)) return true;
    return false;
  }


  function render(){
    const cardsPlaceholder=document.getElementById('cardsPlaceholder');
    const luckyCardsPlaceholder=document.getElementById('luckyCardsPlaceholder');
    const drawnBallsPlaceholder=document.getElementById('drawnBallsPlaceholder');
    const historyPlaceholder=document.getElementById('historyPlaceholder');

 
    cardsPlaceholder.innerHTML=`<div class="row">
      ${cards.map((card,idx)=>{
        return `<div class="col-md-6 mb-3">
          <table class="table table-bordered text-center">
            <thead>
              <tr><th>B</th><th>I</th><th>N</th><th>G</th><th>O</th></tr>
            </thead>
            <tbody>
              ${card.rows.map(row=>`
                <tr>
                  ${row.map(cell=>`
                    <td class="${cell.isMarked?'bg-danger text-white fw-bold':''}">
                      ${cell.value}
                    </td>`).join('')}
                </tr>`).join('')}
            </tbody>
            <tfoot class="${card.luckyCard?'table-success':''}">
              <tr><td colspan="5">${card.luckyCard?'Lucky Card!':'&nbsp;'}</td></tr>
            </tfoot>
          </table>
        </div>`;
      }).join('')}
    </div>`;


    luckyCardsPlaceholder.innerHTML=luckyCards.map(lucky=>`
      <table class="table table-bordered text-center mb-2">
        <thead><tr><th>B</th><th>I</th><th>N</th><th>G</th><th>O</th></tr></thead>
        <tbody>
          ${lucky.map(row=>`
            <tr>
              ${row.map(c=>`<td class="${c?'bg-danger':''}">&nbsp;</td>`).join('')}
            </tr>`).join('')}
        </tbody>
      </table>
    `).join('');

 
    drawnBallsPlaceholder.innerHTML=nabola.map(bola=>`
      <span class="badge bg-${getBallColor(bola.letter)} m-1">
        ${bola.letter}<br>${bola.number}
      </span>`).join('');

 
    historyPlaceholder.innerHTML=history.map(h=>`
      <tr>
        <td>${h.round}</td>
        <td>${h.winners.length>0?h.winners.join(', '):'None'}</td>
      </tr>`).join('');
  }

 
  const numberOfCardsInput=document.getElementById('numberOfCards');
  const rollBtn=document.getElementById('roll');
  const drawBtn=document.getElementById('draw');

  numberOfCardsInput.addEventListener('change',(e)=>{
    const num=e.target.value;
    cards=generateCards(num);
    nabola=[];
    history=[];
    round=0;
    tambiolo.reset();
    drawBtn.removeAttribute('disabled');
    render();
  });

  rollBtn.addEventListener('click',()=>{ tambiolo.roll(); });

  drawBtn.addEventListener('click',()=>{
    if(tambiolo.isEmpty()) { alert("No more balls!"); return; }
    const bola=tambiolo.draw();
    nabola.push(bola);

 
    cards.forEach(card=>card.markBall(bola));

    checkLuckyCards();

   round++;
let winners = [];
cards.forEach((card, idx) => {
  if (checkBingo(card)) winners.push(`Card ${idx + 1} (Bingo)`);
  if (card.luckyCard) winners.push(`Card ${idx + 1} (Lucky)`);
});

    if(winners.length > 0) {
      launchConfetti();
    }

    history.push({ round, winners });
    render();
  });

  cards=generateCards(1);
  render();