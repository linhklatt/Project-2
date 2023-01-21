const roleList = $('.create-select');
const roleDescription = $('.create-description');
const nameForm = $('.name-form');
const nameInput = $('#character-name');
const backBtn = $('#create-back');
const finishBtn = $('#create-finish');


roleList.on('click', async(event) => {
    event.preventDefault();

    let selectedRoleTile = $(event.target).closest('div.create-tile')[0];

    if (selectedRoleTile) {
        let role = selectedRoleTile.getAttribute('role');

        let lastSelectedRole = $('.selected-role');
        let lastRole = localStorage.getItem("createRole");
        $(lastSelectedRole).removeClass('selected-role');
        $(lastSelectedRole).removeClass(`${lastRole}-walk-right`);

        $(selectedRoleTile).addClass('selected-role');
        $(selectedRoleTile).addClass(`${role}-walk-right`);

        generateDescription(role);

        localStorage.setItem("createRole", role);
        nameForm.prop("hidden", false)
    }
});

nameInput.on('input', () => {
    if (nameInput.val()) {
        finishBtn.prop("disabled", false);
    } else {
        finishBtn.prop("disabled", true);
    }
});

function generateDescription (role) {
    switch (role) {
        case 'warrior':
            roleDescription.text(
                'warrior description'
            );
            break;
        case 'archer':
            roleDescription.text(
                'archer description'
            );
            break;
        case 'mage':
            roleDescription.text(
                'mage description'
            );
            break;
        default:
            roleDescription.text(
                'Select your desired role.'
            );
            break;
    }
};

backBtn.on('click', async(event) => {
    event.preventDefault();

    const response = await fetch('/home', {
        method: 'GET'
    });

    if (response.ok) {
        document.location.replace('/home');
    } else {
        alert(response.statusText);
    }
});

finishBtn.on('click', async (event) => {
    event.preventDefault();
    
    const name = await nameInput.val();
    console.log(name);
    const role = localStorage.getItem("createRole");

    if (name && role) {
        const response = await fetch('/api/characters/', {
            method: 'POST',
            body: JSON.stringify({ name, role }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            document.location.replace('/home');
        } else {
            alert('failed to create character');
        }
    } else if (!role) {
        let title = 'No Role Found';
        let message = 'Please select a role for your character.';
        $('#mainModal').find('.modal-title').text(title);
        $('#mainModal').find('.modal-body p').text(message);
        $('#mainModal').find('.btn-primary').hide();
        $('#mainModal').modal('show');
    } else {
        let title = 'No Name Found';
        let message = 'Please enter a name for your character.';
        $('#mainModal').find('.modal-title').text(title);
        $('#mainModal').find('.modal-body p').text(message);
        $('#mainModal').find('.btn-primary').hide();
        $('#mainModal').modal('show');
    }
});

localStorage.setItem('createRole', '');