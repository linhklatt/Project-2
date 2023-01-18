const nameButtonHandler = async(event) => {
    event.preventDefault();
    
    const response = await fetch('./name', {
        method: 'GET'
    });

    if (response.ok) {
        document.location.replace('./name');
    } else {
        alert(response.statusText);
    }
};

const characterTileHandler = async(event) => {
    if (event.target.hasAttribute('role')) {
        const role = event.target.getAttribute('role');

        localStorage.setItem("role", role);
        
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

        document.querySelector('#name-btn').removeAttribute('hidden');
    }
};

document
    .querySelector('.name-character')
    .addEventListener('click', nameButtonHandler);

document
    .querySelector('.character-tile')
    .addEventListener('click', characterTileHandler);

localStorage.setItem('role', '');