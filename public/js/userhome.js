const createButtonHandler = async (event) => {
    event.preventDefault();
    
    const response = await fetch('/api/characters/create', {
        method: 'GET'
    });
    
    if (response.ok) {
        console.log('Trying to create a new character');
        console.log(response.ok);
        document.location.replace('api/characters/create');
    } else {
        // alert('Create character failed');
        alert(response.statusText);
    }
};

document
    .querySelector('.create-character')
    .addEventListener('click', createButtonHandler);