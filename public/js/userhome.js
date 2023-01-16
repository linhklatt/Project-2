// const createButtonHandler = async (event) => {
//     event.preventDefault();

// };

const deleteButtonHandler = async (event) => {
    if (event.target.hasAttribute('data-id')) {
        const id = event.target.getAttribute('data-id');

        const response = await fetch(`/api/characters/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            // alert(`response: ${response.ok}`);
            document.location.replace('/home');
        } else {
            alert('Failed to delete character');
        }
    }
};

// document
//     .querySelector('.create-character')
//     .addEventListener('click', createButtonHandler);

document
    .querySelector('.character-list')
    .addEventListener('click', deleteButtonHandler);