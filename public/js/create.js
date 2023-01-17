const nameButtonHandler = async(event) => {
    event.preventDefault();

    alert('moving to name character');
};

const characterTileHandler = async(event) => {
    if (event.target.hasAttribute('role')) {
        const role = event.target.getAttribute('role');
        
        switch(role) {
            case 'warrior':
                document.querySelector('.character-description').textContent="warrior description"; 
                break;
            case 'archer':
                document.querySelector('.character-description').textContent="archer description"; 
                break;
            case 'mage':
                document.querySelector('.character-description').textContent="mage description"; 
                break;
        }
    }
};

document
    .querySelector('.name-character')
    .addEventListener('click', nameButtonHandler);

document
    .querySelector('.character-tile')
    .addEventListener('click', characterTileHandler);