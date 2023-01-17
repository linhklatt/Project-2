const newCharacterButtonHandler = async(event) => {
    event.preventDefault();

    const name = document.querySelector('#character-name').value.trim();
    const role = localStorage.getItem("role");

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
            alert('Failed to create character');
        }
    }
};

document
    .querySelector('.new-character-form')
    .addEventListener('submit', newCharacterButtonHandler);