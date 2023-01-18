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

document
    .querySelector('.create-character')
    .addEventListener('click', createButtonHandler);