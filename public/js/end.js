const playerModel = $('#player');
const player = getCharacter("playerData");

const healthEl = $('#health');
const attackEl = $('#attack');
const counterEl = $('#counter');

const healthDownBtn = $('#health-down');
const healthUpBtn = $('#health-up');
const attackDownBtn = $('#attack-down');
const attackUpBtn = $('#attack-up');
const counterDownBtn = $('#counter-down');
const counterUpBtn = $('#counter-up');
const homeBtn = $('#return-home');

let health = player.health;
let attack = player.attack;
let counter = player.counter;
let wins;
const playerWin = localStorage.getItem("playerWin");
if (playerWin == "true") {
    wins = player.wins + 1;
}

const pointsEarned = 5;
let pointsRemaining = pointsEarned;



const pointsEl = $('#points-remaining');
pointsEl.text(`You have ${pointsRemaining} points to spend`);

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

function removePoint() {
    pointsRemaining++;
    if (pointsRemaining > 0) {
        healthUpBtn.prop("disabled", false);
        attackUpBtn.prop("disabled", false);
        counterUpBtn.prop("disabled", false);
    }
    pointsEl.text(`You have ${pointsRemaining} points to spend`);
};

function spendPoint() {
    pointsRemaining--;
    if (pointsRemaining == 0) {
        healthUpBtn.prop("disabled", true);
        attackUpBtn.prop("disabled", true);
        counterUpBtn.prop("disabled", true);
    }
    pointsEl.text(`You have ${pointsRemaining} points to spend`);
};

healthUpBtn.on('click', () => {
    health++;
    healthDownBtn.prop("disabled", false);
    healthEl.text(health);

    spendPoint();
});

healthDownBtn.on('click', () => {
    health--;
    if (health <= player.health) {
        healthDownBtn.prop("disabled", true);
    }
    healthEl.text(health);
    
    removePoint();
});

attackUpBtn.on('click', () => {
    attack++;
    attackDownBtn.prop("disabled", false);
    attackEl.text(attack);

    spendPoint();
});

attackDownBtn.on('click', () => {
    attack--;
    if (attack <= player.attack) {
        attackDownBtn.prop("disabled", true);
    }
    attackEl.text(attack);

    removePoint();
});

counterUpBtn.on('click', () => {
    counter++;
    counterDownBtn.prop("disabled", false);
    counterEl.text(counter);

    spendPoint();
});

counterDownBtn.on('click', () => {
    counter--;
    if (counter <= player.counter) {
        counterDownBtn.prop("disabled", true);
    }
    counterEl.text(counter);

    removePoint();
});

const homeButtonHandler = async (event) => {
    event.preventDefault();
    
    const response = await fetch(`/api/characters/${player.id}`, {
        method: 'PUT',
        body: JSON.stringify({ health, attack, counter, wins }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    
    if (response.ok) {
        document.location.replace('/home');
    } else {
        alert(response.statusText);
    }
};

homeBtn.on('click', homeButtonHandler);

walkRight(playerModel, player.role);

healthEl.text(health);
attackEl.text(attack);
counterEl.text(counter);