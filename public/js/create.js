const newCharacterButtonHandler = async(event) => {
    event.preventDefault();

    const name = document.querySelector('#character-name').value.trim();
    const role = localStorage.getItem("role-create-js");

    if (name && role) {
        const response = await fetch(`/api/characters/`, {
            method: 'POST',
            body: JSON.stringify({ name, role }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            document.location.replace('/home');
        } else {
            // alert('Failed to create character');
            var message = 'Failed to create character.';
            $('#alertModal').find('.modal-body p').text(message);
            $('#alertModal').modal('show');
        }
    } else {
        // alert('Please enter a name for your character.');
        var message = 'Please enter a name for your character.';
        $('#alertModal').find('.modal-body p').text(message);
        $('#alertModal').modal('show');
    }
};

const characterTileHandler = async(event) => {
    if (event.target.hasAttribute('role')) {
        const role = event.target.getAttribute('role');

        localStorage.setItem("role-create-js", role);
        
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

        document.querySelector('.new-character-form').removeAttribute('hidden');
    }
};

document
    .querySelector('.new-character-form')
    .addEventListener('submit', newCharacterButtonHandler);

document
    .querySelector('.character-tile')
    .addEventListener('click', characterTileHandler);

localStorage.setItem('role', '');