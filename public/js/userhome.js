const createBtn = $('#create-character');
const playBtn = $('#play');
const deleteBtn = $('#delete-character');
const modalOkay = $('.btn-primary');
const charList = $('.user-home-char-list');

createBtn.on('click', async () => {
    const response = await fetch('/api/characters/create', {
        method: 'GET'
    });

    if (response.ok) {
        document.location.replace('api/characters/create');
    } else {
        alert(response.statusText);
    }
});

charList.on('click', async (event) => {
    event.preventDefault();

    // Find the closest user-home-char-row element
    let selectedChar = $(event.target).closest('div.user-home-char-row')[0];

    // If a character was selected...
    if (selectedChar) {
        // Get the char-id
        let selectedCharId = selectedChar.getAttribute('char-id');


        // Store char-id into local storage
        localStorage.setItem("selectedCharId", selectedCharId);


        // "Deselect" the last selected character
        let lastSelected = $('.selected');
        $(lastSelected).removeClass('selected');


        // Update the selected character on browser
        $(selectedChar).addClass('selected');

        playBtn.prop("disabled", false);
        deleteBtn.prop("disabled", false);
    }
});

deleteBtn.on('click', async(event) => {
    event.preventDefault();
   
    const id = localStorage.getItem("selectedCharId");

    if (id) {
        let title = 'Delete Character';
        let message = 'You are about to permanently delete a character. Press Okay to proceed.';
        let btnText = 'Okay';
        $('#mainModal').find('.modal-title').text(title);
        $('#mainModal').find('.modal-body p').text(message);
        $('#mainModal').find('.btn-primary').text(btnText);
        $('#mainModal').find('.btn-primary').show();
        $('#mainModal').modal('show');
    } else {
        let title = 'No Character Selected';
        let message = 'Please select a character to delete.';
        $('#mainModal').find('.modal-title').text(title);
        $('#mainModal').find('.modal-body p').text(message);
        $('#mainModal').find('.btn-primary').hide();
        $('#mainModal').modal('show');
    }
});

modalOkay.on('click', async(event) => {
    $('#mainModal').modal('hide');
    
    const id = localStorage.getItem("selectedCharId");
    if (id) {
        const response = await fetch(`/api/characters/${id}`, {
            method: 'DELETE'
        });
    
        if (response.ok) {
            document.location.replace('/home');
        } else {
            alert(response.statusText);
        }
    }
});

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


playBtn.on('click', async(event) => {
    event.preventDefault();


    const id = localStorage.getItem("selectedCharId");


    if (id) {
        // Get the selected character's data
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
        let title = 'No Character Selected'
        let message = 'Please select a character to play.';
       
        $('#mainModal').find('.modal-title').text(title);
        $('#mainModal').find('.modal-body p').text(message);
        $('#mainModal').find('.btn-primary').hide();
        $('#mainModal').modal('show');
    }
});


localStorage.setItem("selectedCharId", '');
localStorage.setItem("playerData", '');
localStorage.setItem("opponentData1", '');
localStorage.setItem("opponentData2", '');
localStorage.setItem("opponentData3", '');
localStorage.setItem("opponentData4", '');