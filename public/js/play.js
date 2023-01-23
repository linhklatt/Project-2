import { walkRight, attackRight, stopAttackRight, counterAnimation } from "./animations/playAnimations.js";

let yourMove;
let enemyMove;
let savedEnemyMove;
let yourHP = 30;
let enemyHP = 30;

// Setting up turn counter
let totalRounds = 0;

// Setting up document
let res;
const attackButton = $('#attack');
const counterButton = $('#counter');
const yourHealthBar = $('#yourHealthBar');
const enemyHealthBar = $('#enemyHealthBar');
const announcements = $('#announcements');
const turnCounter = $('.turn-counter');
const playerModel = $('.player-model');
const playerName = $('.player-name');
const opponentModel = $('.opponent-model');
const opponentName = $('.opponent-name');
const endButton = $('#end-game');

// Pull character data from local storage
const player = getCharacter("playerData");
const opponent1 = getCharacter("opponentData1");
const opponent2 = getCharacter("opponentData2");
const opponent3 = getCharacter("oppponentData3");
const opponent4 = getCharacter("opponentData4");

function init() {
    playerName.text(player.name);
    opponentName.text(opponent1.name);
    walkRight(playerModel, player.role);
    walkRight(opponentModel, opponent1.role);
    enableButtons();
}

function getCharacter(characterKey) {
    const characterData = localStorage.getItem(characterKey);
    const character = JSON.parse(characterData);
    return character;
}

const enableButtons = () => {
    attackButton.prop("disabled", false);
    counterButton.prop("disabled", false);
};

const disableButtons = () => {
    attackButton.prop("disabled", true);
    counterButton.prop("disabled", true);
};

attackButton.on('click', async () => {
    yourMove = 'attack';
    newTurn();
});

counterButton.on('click', async() => {
    yourMove = 'counter';
    newTurn();
});

function newTurn() {
    disableButtons();
    addRound();
    enemyMove(yourMove);
    healthChange();
    gameOver();
};

const addRound = async () => {
    totalRounds += 1;
    turnCounter.text(`Turn ${totalRounds}`);
};

// Takes the moves of the player and generates one for the enemy then runs the damage step
enemyMove = (id) => {
    let move = Math.floor((Math.random()*4) + 1);
    console.log(move);
    if (move <= 3) {    // 3/4 are attack
        savedEnemyMove = 'attack';
    } else {            // 1/2 are counter
        savedEnemyMove = 'counter';
    };
    
    damageStep (id, savedEnemyMove);
    roundResults(res);
};

// Processes the move to a result
const damageStep = async (y, e) => {
    console.log(`y: ${y}, e: ${e}`);
    if (y === 'attack' && e === 'attack') {
        res = "Both players take damage!";
        attackAnimation(opponentModel, opponent1.role, playerModel, player.role, 'player', 'yes');
        attackAnimation(playerModel, player.role, opponentModel, opponent1.role, 'opponent', 'yes');

        if (enemyHP >= 10 && yourHP >= 10) {
            enemyHP -= 10;
            yourHP -= 10;
        } else {
            enemyHP = 0;
            yourHP = 0;
        }
    } else if (y === 'counter' && e === 'counter') {
        res = "Defensive stances taken in vain!";
        counterAnimation(playerModel, player.role);
        counterAnimation(opponentModel, opponent1.role);
        doubleCounter(playerModel, player.role, opponentModel, opponent1.role);

    } else if (y === 'attack' && e === 'counter') {
        res = "Enemy takes a defensive stance and prepares to counter.";
        
        counter(y, e);

    } else if (y === 'counter' && e === 'attack') {
        res = "You take a defensive and prepare a counter-attack!"
        
        counter(y, e);

    }
};

// Set up counter action to attack
const counter = async (y, e) => {
    let move = Math.floor((Math.random()*5));
    if (move >= 3 && y === 'attack') {
        res = "Enemy's counter was successful!"
        await counterAnimation(opponentModel, opponent1.role);
        await attackAnimation(opponentModel, opponent1.role, playerModel, player.role, 'player', 'yes');

        yourHP -= 10;

    } else if (move >= 3 && y === 'counter') {
        res = "Your counter was successful!"
        await counterAnimation(playerModel, player.role);
        await attackAnimation(playerModel, player.role, opponentModel, opponent1.role, 'opponent', 'yes');

        enemyHP -= 10;

    } else if (move < 3 && y === 'attack') {
        res = "Enemy counter failed!";
        await counterAnimation(opponentModel, opponent1.role);
        await attackAnimation(playerModel, player.role, opponentModel, opponent1.role, 'opponent', 'yes');

        enemyHP -= 15;

    } else if (move < 3 && y === 'counter') {
        res = "Your counter was not successful!"
        yourHP -= 15;

        await counterAnimation(playerModel, player.role);
        await attackAnimation(opponentModel, opponent1.role, playerModel, player.role, 'player', 'yes');
        
    }
};

// Displays results of the round
const roundResults = async () => {
    announcements.append(`<p>${res}<p>`);
};

const healthChange = async () => {
    yourHealthBar.attr("style", `width: ${yourHP}%`);
    enemyHealthBar.attr("style", `width: ${enemyHP}%`);
};

const gameOver = async () => {
    if (yourHP === 0 || enemyHP === 0) {
        res = "Game Over!";
        roundResults(res);
        disableButtons();
        endButton.show();
        endButton.on('click', endButtonHandler);
    }
};

async function attackAnimation (attackerModel, attackerRole, defenderModel, defenderRole, defender,  damage) {
    console.log('new attack');
    const attackTime = 1200;
    const delay = 200;
    let animationTimer = attackTime;

    attackRight(attackerModel, attackerRole);

    let timerInterval = setInterval( () => {
        animationTimer -= delay;
        if (animationTimer == 0) {
            clearInterval(timerInterval);
            stopAttackRight(attackerModel, attackerRole);
            if (damage) {
                damageAnimation(defenderModel, defender, defenderRole);
            } else {
                defenderModel.removeClass(`${defenderRole}-counter-right`);
                if (yourHP > 0 && enemyHP > 0) {
                    enableButtons();
                } else {
                    disableButtons();
                }
            }
        }
    }, delay); 
}

function damageAnimation (defenderModel, defender, defenderRole) {
    const shakeTime = 400;
    const delay = 200;
    let animationTimer = shakeTime;

    defenderModel.addClass(`${defender}-shake`);

    let timerInterval = setInterval( () => {
        animationTimer -= delay;
        if (animationTimer == 0) {
            clearInterval(timerInterval);
            defenderModel.removeClass(`${defender}-shake`);
            defenderModel.removeClass(`${defenderRole}-counter-right`);
            if (yourHP > 0 && enemyHP > 0) {
                enableButtons();
            } else {
                disableButtons();
            }
        }
    }, delay);
}

function doubleCounter( playerModel, playerRole, opponentModel, opponentRole) {
    const turnTime = 1000;
    const delay = 200;
    let animationTimer = turnTime;

    let timerInterval = setInterval( () => {
        animationTimer -= delay;
        if (animationTimer == 0) {
            clearInterval(timerInterval);
            playerModel.removeClass(`${playerRole}-counter-right`);
            opponentModel.removeClass(`${opponentRole}-counter-right`);
            enableButtons();
        }
    }, delay);
}

const endButtonHandler = async (event) => {
    event.preventDefault();
    
    const response = await fetch('/api/play/end', {
        method: 'GET'
    });
    
    if (response.ok) {
        document.location.replace('./play/end');
    } else {
        alert(response.statusText);
    }
};

init();