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
            element.addClass("warrior-attack-right");
            break;
        case 'archer':
            $(element).addClass("archer-attack-right"); 
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
            $(element).removeClass("archer-attack-right"); 
            break;
        case 'mage':
            $(element).removeClass("mage-attack-right"); 
            break;
    }
}

function counterAnimation (element, role) {
    switch(role) {
        case 'warrior':
            element.addClass("warrior-counter-right");
            break;
        case 'archer':
            $(element).addClass("archer-counter-right"); 
            break;
        case 'mage':
            $(element).addClass("mage-counter-right"); 
            break;
    }
}



export { walkRight, attackRight, stopAttackRight, counterAnimation };