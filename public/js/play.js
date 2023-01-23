import { walkRight, attackRight, stopAttackRight, counterAnimation } from "./animations/playAnimations.js";

// Pull character data from local storage
const player = getCharacter("playerData");
const opponent1 = getCharacter("opponentData1");
const opponent2 = getCharacter("opponentData2");
const opponent3 = getCharacter("oppponentData3");
const opponent4 = getCharacter("opponentData4");

let yourMove;
let savedEnemyMove;
let yourHP = 100;
let yourATK = 15;
let yourCTR = 10;
let enemyHP = 100;
let enemyATK = 15;
let enemyCTR = 10;

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
const gameOverEl = $('#game-over');


function init() {
    yourHP = player.health;
    yourATK = player.attack;
    yourCTR = player.counter;
    enemyHP = opponent1.health;
    enemyATK = opponent1.attack;
    enemyCTR = opponent1.counter;

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

async function newTurn() {
    disableButtons();
    announcements.text("");
    await addRound();
    await enemyMove(yourMove);
    
    
};

async function addRound () {
    totalRounds += 1;
    turnCounter.text(`Turn ${totalRounds}`);
};

// Takes the moves of the player and generates one for the enemy then runs the damage step
async function enemyMove (id) {
    let move = Math.floor((Math.random()*4) + 1);
    if (move <= 2) {    // 1 and 2 are attack
        savedEnemyMove = 'attack';
    } else {            // 3 and 4 are counter
        savedEnemyMove = 'counter';
    };
    
    await damageStep (id, savedEnemyMove);
    // await healthChange();
    // await roundResults(res);
};

// Processes the move to a result
async function damageStep (y, e) {
    console.log(`y: ${y}, e: ${e}`);
    if (y === 'attack' && e === 'attack') {
        res = "Both players take damage!";
        enemyHP -= yourATK;
        yourHP -= enemyATK;

        if (enemyHP <= 0) enemyHP = 0;
        if (yourHP <= 0) yourHP = 0;

        attackAnimation(opponentModel, opponent1.role, playerModel, player.role, 'player', 'yes');
        attackAnimation(playerModel, player.role, opponentModel, opponent1.role, 'opponent', 'yes');

    } else if (y === 'counter' && e === 'counter') {
        res = "Defensive stances taken in vain!";

        counterAnimation(playerModel, player.role);
        counterAnimation(opponentModel, opponent1.role);
        doubleCounter(playerModel, player.role, opponentModel, opponent1.role);
        
    } else if (y === 'attack' && e === 'counter') {
        res = "Enemy takes a defensive stance and prepares to counter.";
        
        await counter(y, e);

    } else if (y === 'counter' && e === 'attack') {
        res = "You take a defensive and prepare a counter-attack!"
        
        await counter(y, e);

    }
};

// Set up counter action to attack
async function counter (y, e) {
    let move = Math.floor((Math.random()*5));
    if (move >= 3 && y === 'attack') {
        res = "Enemy's counter was successful!"
        yourHP -= enemyCTR;

        counterAnimation(opponentModel, opponent1.role);
        await attackAnimation(opponentModel, opponent1.role, playerModel, player.role, 'player', 'yes');

        

    } else if (move >= 3 && y === 'counter') {
        res = "Your counter was successful!"
        enemyHP -= yourCTR;

        counterAnimation(playerModel, player.role);
        await attackAnimation(playerModel, player.role, opponentModel, opponent1.role, 'opponent', 'yes');

        

    } else if (move < 3 && y === 'attack') {
        res = "Enemy counter failed!";
        enemyHP -= yourATK;

        counterAnimation(opponentModel, opponent1.role);
        await attackAnimation(playerModel, player.role, opponentModel, opponent1.role, 'opponent', 'yes');

        

    } else if (move < 3 && y === 'counter') {
        res = "Your counter was not successful!"
        yourHP -= enemyATK;

        counterAnimation(playerModel, player.role);
        await attackAnimation(opponentModel, opponent1.role, playerModel, player.role, 'player', 'yes');
        
    }

    if (enemyHP <= 0) enemyHP = 0;
    if (yourHP <= 0) yourHP = 0;
};

// Displays results of the round
async function roundResults () {
    announcements.text(`${res}`);
};

async function healthChange () {
    let yourPercent = Math.floor((yourHP/player.health)*100);
    let enemyPercent = Math.floor((enemyHP/opponent1.health)*100);
    console.log(`yourPercent: ${yourPercent} enemyPercent: ${enemyPercent}`);
    yourHealthBar.attr("style", `width: ${yourPercent}%`);
    enemyHealthBar.attr("style", `width: ${enemyPercent}%`);
};

async function turnEnd () {
    
    if (yourHP > 0 && enemyHP > 0) {
        enableButtons();
    } else if (yourHP === 0) {
        let gameOver = "Game Over! You lossed.";
        gameOverEl.text(gameOver);
        gameOverEl.show();
        endButton.show();
        endButton.on('click', endButtonHandler);
    } else {
        let gameOver = "Game Over! You won!";
        gameOverEl.text(gameOver);
        gameOverEl.show();
        endButton.show();
        endButton.on('click', endButtonHandler);
    }
    healthChange();
    roundResults(res);
    
};

async function attackAnimation (attackerModel, attackerRole, defenderModel, defenderRole, defender,  damage) {
    const attackTime = 1200;
    const delay = 200;
    let animationTimer = attackTime;

    attackRight(attackerModel, attackerRole);

    let timerInterval = setInterval( () => {
        animationTimer -= delay;
        if (animationTimer == 0) {
            clearInterval(timerInterval);
            stopAttackRight(attackerModel, attackerRole);
            if (damage == 'yes') {
                damageAnimation(defenderModel, defender, defenderRole, attackerModel, attackerRole);
            } else {
                defenderModel.removeClass(`${defenderRole}-counter-right`);
                attackerModel.removeClass(`${attackerRole}-counter-right`);
                turnEnd();
            }
        }
    }, delay); 
}

function damageAnimation (defenderModel, defender, defenderRole, attackerModel, attackerRole) {
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
            attackerModel.removeClass(`${attackerRole}-counter-right`);
            turnEnd();
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
            turnEnd();
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