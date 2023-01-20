const playerModel = $('#player');
const player = getCharacter("playerData");

function getCharacter(characterKey) {
    const characterData = localStorage.getItem(characterKey);
    const character = JSON.parse(characterData);
    return character;
}

function walkRight(element, role) {
    switch(role) {
        case 'warrior':
                $(element).addClass("warr-walk-right");
                break;
            case 'archer':
                // element.addClass("arch-walk-right"); 
                break;
            case 'mage':
                $(element).addClass("mage-walk-right"); 
                break;
    }
}

walkRight(playerModel, player.role);

