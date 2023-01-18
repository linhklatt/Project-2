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
        const selectedChar = event.target;
        const selectedCharId = selectedChar.getAttribute('char-id');

        localStorage.setItem("selectedCharId", selectedCharId);
        
        // TODO: Indicate highlight on selected character
        const previouslySelected = localStorage.getItem("previouslySelected");
        if (previouslySelected) {
            document
                .querySelector(`#player-character-${previouslySelected}`)
                .setAttribute("class", "col-md-5 player-character");
        }
        const playerCharacter = document.querySelector(`#player-character-${selectedCharId}`);
        playerCharacter.setAttribute("class", "col-md-5 player-character selected-character");
        localStorage.setItem("previouslySelected", selectedCharId);

        document.querySelector('#delete-btn').removeAttribute("hidden");
        document.querySelector('#play-btn').removeAttribute("hidden");
    }
};

const deleteButtonHandler = async(event) => {
    event.preventDefault();

    if(confirm('Are you sure you want to delete this character?')) {
        const id = localStorage.getItem("selectedCharId");
        const response = await fetch(`/api/characters/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            document.location.replace('/home');
        } else {
            alert('Failed to delete character.');
        }
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
    .querySelector('.delete-character')
    .addEventListener('click', deleteButtonHandler);

document
    .querySelector('.play-game')
    .addEventListener('click', playButtonHandler);

localStorage.setItem("selectedCharId", '');
localStorage.setItem("previouslySelected", '');