const createButtonHandler = async (event) => {
    event.preventDefault();
    
    const response = await fetch('/api/characters/create', {
        method: 'GET'
    });
    
    if (response.ok) {
        document.location.replace('api/characters/create');
    } else {
        alert(response.statusText);
    }
};

const characterSelectHandler = async (event) => {
    event.preventDefault();

    if (event.target.hasAttribute('char-id')) {
        const selectedCharId = event.target.getAttribute('char-id');

        localStorage.setItem("selectedCharId", selectedCharId);
        
        // TODO: Indicate highlight on selected character

        document.querySelector('#play-btn').removeAttribute("hidden");
    }
};

const playButtonHandler = async (event) => {
    event.preventDefault();

    const response = await fetch('api/play', {
        method: 'GET'
    });

    if (response.ok) {
        document.location.replace('api/play');
    } else {
        alert(response.statusText)
    }
};

document
    .querySelector('.create-character')
    .addEventListener('click', createButtonHandler);

document
    .querySelector('.character-list')
    .addEventListener('click', characterSelectHandler);
document
    .querySelector('.play-game')
    .addEventListener('click', playButtonHandler);

localStorage.setItem("selectedCharId", '');
