let yourMove;
let enemyMove;
let savedEnemyMove;
let yourHP = 30;
let enemyHP = 30;

// Setting up turn counter
let totalRounds = 0;

// Setting up document
let res;
const attackButton = document.getElementById('attack');
const counterButton = document.getElementById('counter');
const yourHealthBar = document.getElementById('yourHealthBar');
const enemyHealthBar = document.getElementById('enemyHealthBar');
const announcements = document.getElementById('announcements');

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

function walkRight(element, role) {
    switch(role) {
        case 'warrior':
            $(element).addClass("warrior-walk-right");
            break;
        case 'archer':
            element.addClass("archer-walk-right"); 
            break;
        case 'mage':
            $(element).addClass("mage-walk-right"); 
            break;
    }
}

function attackRight(element, role) {
    switch(role) {
        case 'warrior':
            $(element).addClass("warrior-attack-right");
            break;
        case 'archer':
            element.addClass("archer-attack-right"); 
            break;
        case 'mage':
            $(element).addClass("mage-attack-right"); 
            break;
    }
}

function stopAttackRight(element, role) {
    switch(role) {
        case 'warrior':
            $(element).removeClass("warrior-attack-right");
            break;
        case 'archer':
            element.removeClass("archer-attack-right"); 
            break;
        case 'mage':
            $(element).removeClass("mage-attack-right"); 
            break;
    }
}

enableButtons = () => {
    attackButton.disabled = false;
    counterButton.disabled = false;
};

disableButtons = () => {
    attackButton.disabled = true;
    counterButton.disabled = true;
};

fight = async (id) => {
    await attackAnimation();
    await addRound();
    await enemyMove(id);
    await healthChange();
    await gameOver();
};

attackAnimation = async () => {
    disableButtons();
    let attackTime = 1200;
    let shakeTime = 400;
    let delay = 200;
    let animationTimer = attackTime + shakeTime;

    attackRight(playerModel, player.role);
    opponentModel.removeClass("shake-horizontal")
    let timerInterval = setInterval(function() {
        animationTimer -= delay;
        if (animationTimer == shakeTime) {
            stopAttackRight(playerModel, player.role);
            opponentModel.addClass("shake-horizontal");
        }
        if (animationTimer == 0) {
            clearInterval(timerInterval);
            opponentModel.removeClass("shake-horizontal");
            enableButtons();
        }
    }, delay);
};

addRound = async () => {
    totalRounds += 1;
};

// Set up counter action to attack
counter = async (y, e) => {
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
roundResults = async () => {
    announcements.innerHTML += res + "<br>";
};

healthChange = async () => {
    yourHealthBar.style.width = yourHP + "%";
    enemyHealthBar.style.width = enemyHP + "%";
};

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

gameOver = async () => {
    if (yourHP === 0 || enemyHP === 0) {
        res = "Game Over!";
        roundResults(res);
        attackButton.disabled = true;
        counterButton.disabled = true;
        endButton.show();
        endButton.on('click', endButtonHandler);
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
damageStep = async (y, e) => {
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

init();