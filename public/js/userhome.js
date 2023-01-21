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
                .setAttribute("class", "player-character");
        }
        const playerCharacter = document.querySelector(`#player-character-${selectedCharId}`);
        playerCharacter.setAttribute("class", "player-character selected-character");
        localStorage.setItem("previouslySelected", selectedCharId);

        document.querySelector('#delete-btn').removeAttribute("hidden");
        document.querySelector('#play-btn').removeAttribute("hidden");
    }
};

const deleteButtonHandler = async(event) => {
    event.preventDefault();

    const id = localStorage.getItem("selectedCharId");

    if (id) {
        if (confirm('Are you sure you want to delete this character?')) {
            const response = await fetch(`/api/characters/${id}`, {
                method: 'DELETE',
            });
    
            if (response.ok) {
                document.location.replace('/home');
            } else {
                alert('Failed to delete character.');
            }
        }
    } else {
        alert('Please select a character to delete.');
    //     var message = 'Are you sure you want to delete this character?';
    //     $('confirmModal').find('.c-modal-body p').text(message);
    //     $('confirmModal').modal('show');
    // } else {
    //     var message = 'Please select a character to delete.'
    //     $('alertModal').find('.modal-body p').text(message);
    //     $('alertModal').modal('show');
    // }
}};

// const confirmDeleteButton = document.getElementById('confirm-delete')
// confirmDeleteButton.addEventListener('click', async(event) => {
//     event.preventDefault();

//     const id = localStorage.getItem("selectedCharId");
//     const response = await fetch(`/api/characters/${id}`, {
//         method: 'DELETE',
//     });
//     if (response.ok) {
//         document.location.replace('/home');
//     } else {
//         var message = 'Failed to delete character.'
//         $('alertModal').find('.modal-body p').text(message);
//         $('alertModal').modal('show');
//     }
// });

const playButtonHandler = async (event) => {
    event.preventDefault();

    const id = localStorage.getItem("selectedCharId");

    if (id) {
        // Get the player's selected character data
        const playerData = await getCharacterData(id);
        localStorage.setItem("playerData", JSON.stringify(playerData));
        
        // Get an array of all ids on the server, excluding the player's selected character id
        const ids = await getCharacterIds(id);

        // Passes the array of all ids and stores data for four unique opponents in local storage
        await getOpponents(ids);
        
        // Fetch and render the /play page
        const response = await fetch('api/play', {
            method: 'GET'
        });

        if (response.ok) {
            document.location.replace('api/play');
        } else {
            alert(response.statusText)
        }
    } else {
        alert('Please select a character first.');
    } 
};

async function getCharacterData(id) {
    const response = await fetch(`/api/characters/${id}`, {
        method: 'GET'
    });

    if (response.ok) {
        const characterData = await response.json();
        return characterData;
    } else {
        alert(response.statusText);
    }
};

async function getCharacterIds(id) {
    const response = await fetch(`/api/characters/get-ids/${id}`, {
        method: 'GET'
    });

    if (response.ok) {
        const idData = await response.json();
        const ids = idData.map((data) => data.id);
        return ids;
    } else {
        alsert(response.statusText);
    }
};

async function getOpponents(ids) {
    // Loop four times to get four opponents for the player
    for (let i = 0; i < 4; i++) {
        // Get a random index from the ids array
        const randomIndex = Math.floor((Math.random()*ids.length));

        // Store the opponent id of the random index
        const opponentId = ids[randomIndex];

        // Remove the selected opponent id from the ids array
        ids.splice(randomIndex, 1);        

        // Fetch the opponent's character data
        const opponentData = await getCharacterData(opponentId);

        // Store the opponent's character data in local storage
        localStorage.setItem(`opponentData${i+1}`, JSON.stringify(opponentData));
    }
};

document
    .querySelector('.create-character')
    .addEventListener('click', createButtonHandler);

document
    .querySelector('.player-character-list')
    .addEventListener('click', characterSelectHandler);

document
    .querySelector('.delete-character')
    .addEventListener('click', deleteButtonHandler);

document
    .querySelector('.play-game')
    .addEventListener('click', playButtonHandler);

localStorage.setItem("selectedCharId", '');
localStorage.setItem("previouslySelected", '');
localStorage.setItem("playerData", '');
localStorage.setItem("opponentData1", '');
localStorage.setItem("opponentData2", '');
localStorage.setItem("opponentData3", '');
localStorage.setItem("opponentData4", '');