class Die {

    static #sidesToIcon = {
        1: 'dice-one',
        2: 'dice-two',
        3: 'dice-three',
        4: 'dice-four',
        5: 'dice-five',
        6: 'dice-six', 
    };

    /**
     * Complete the Die class to meet the following requirements:
     * 
     * 1. The constructor should accept a single parameter, sides, which represents the number of sides on the die (by default 6).
     * 2. The class should have a method named roll that returns a random integer between 1 and the number of sides (inclusive).
     * 3. The class should hava a method getting icon that returns a string representing a die icon using font-awesome.
     *    - For example, if the die has 6 sides, the method should return '<i class="fa fa-dice-six"></i>'.
     *    - If the die has 4 sides, it should return '<i class="fa fa-dice-four"></i>', and so on.
     * 
     * Example usage:
     * const die = new Die(6);
     */
}

class Player {
    /**
     * Complete the Player class to meet the following requirements:
     * 
     * 1. The constructor should accept a single parameter, name, which represents the player's name.
     * 2. The class should have a property named color that is initialized to a random color from the following array: ['red', 'blue', 'green', 'yellow'].
     * 2. The class should have a property named position that is initialized to 0.
     * 3. The class should have a method named move that accepts a single parameter, steps, and updates the player's position by adding the steps to the current position.
     * 
     * Example usage:
     * const player = new Player('Alice');
     */
}


const diceElement = document.getElementById('dicePlaceholder');
const rollDiceButton = document.getElementById('rollDiceButton');
const dice = new Die(6);

rollDiceButton.addEventListener('click', () => {
    /**
     * Complete the event listener to meet the following requirements:
     * render the icon of the die in the diceElement when the button is clicked.
     * Use the getIcon method of the Die class to get the appropriate icon based on the number of sides.
     * For example, if the die has 6 sides, it should render '<i class="fa fa-dice-six"></i>'.
     */
    const icon = 'dice-five';
    diceElement.innerHTML = `<i class="fa fa-2xl fa-${icon}"></i>`;
});

