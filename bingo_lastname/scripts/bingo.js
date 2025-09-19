function generateBingoCards(count) {
    const cardsPlaceholderElement = document.getElementById('cardsPlaceholder');
    cardsPlaceholderElement.innerHTML = "";

    // do loop to create the cards
    for (let i = 0; i < count; i++) {
        cardsPlaceholderElement.innerHTML += `Card${i}`;
    }
}

document.getElementById('numberOfCards').addEventListener('change', (event) => {
    const numberOfCards = event.target.value;
    generateBingoCards(numberOfCards);
});