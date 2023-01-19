// Each player chooses a move.
// Counter acts first. Attack acts second.

let yourMove;
let enemyMove;
let savedEnemyMove;
const yourHP = 100;
const enemyHP = 100;

// Setting up turn counter
let totalRounds = 0;

// Setting up document
const attackButton = document.getElementById('attack-btn');
const counterButton = document.getElementById('counter-btn');
// const yourHP = document.getElementById('yourHP');
const yourHealthBar = document.getElementById('yourHealthBar');
// const enemyHP = document.getElementById('enemyHP');
const enemyHealthBar = document.getElementById('enemyHealthBar');
const announcements = document.getElementById('announcements');
const playAgainButton = document.getElementById('playAgain-btn');

enableButtons = () => {
    attackButton.disabled = false;
    counterButton.disabled = false;
    playAgainButton.disabled = true;
};

fight = (id) => {
    addRound();
    enemyMove(id);
    healthChange();
    gameOver();
};

addRound = () => {
    totalRounds += 1;
};

// Set up counter action to attack
counter = (y, e) => {
    let move = Math.floor((Math.random()*5));
    if (move >= 3 && y === 'attack') {
        res = "Enemy's counter was successful!"
        yourHP -= 10;
    } else if (move >= 3 && y === 'counter') {
        res = "Your counter was successful!"
        enemyHP -= 10;
    } else if (move < 3 && y === 'attack') {
        res = "Enemy counter failed!";
        enemyHP -= 15;
    } else if (move < 3 && y === 'counter') {
        res = "Your counter was not successful!"
        yourHP -= 15;
    }
};

// Displays results of the round
roundResults = () => {
    announcements.innerHTML += res + "<br>";
};

healthChange = () => {
    yourHealthBar.style.width = yourHP + "%";
    enemyHealthBar.style.width = enemyHP + "%";
};

gameOver = () => {
    if (yourHP === 0 || enemyHP === 0) {
        res = "Game Over!";
        roundResults(res);
        attackButton.disabled = true;
        counterButton.disabled = true;
        playAgainButton.disabled = false;
    }
};

// The Game
// Takes the moves of the player and generates one for the enemy then runs the damage step
enemyMove = (id) => {
    let move = Math.floor((Math.random()*4) + 1);
    if (move <= 3) {
        savedEnemyMove = 'attack';
    } else {
        savedEnemyMove = 'counter';
    };
    res = ("Your move is <span>" + id + "</span> and the computers move is <span>" + savedEnemyMove + "</span> on round " + totalRounds);
    damageStep (id, savedEnemyMove);
    roundResults(res);
};

// Processes the move to a result
damageStep = (y, e) => {
    if (y === 'attack' && e === 'attack') {
        res = "Both players take damage!";
        if (enemyHP >= 10 && yourHP >= 10) {
            enemyHP -= 10;
            yourHP -= 10;
        } else {
            enemyHP = 0;
            yourHP = 0;
        }
    } else if (y === 'counter' && e === 'counter') {
        res = "Defensive stances taken in vain!";
    } else if (y === 'attack' && e === 'counter') {
        res = "Enemy takes a defensive stance and prepares to counter.";
        counter(y, e);
    } else if (y === 'counter' && e === 'attack') {
        res = "You take a defensive and prepare a counter-attack!"
        counter(y, e);
    }
};

window.onload = enableButtons();