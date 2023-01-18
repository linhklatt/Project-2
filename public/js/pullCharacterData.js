async function getPlayerCharacter() {
    console.log('hello');
    const selectedCharId = localStorage.getItem("selectedCharId");
    
    const response = await fetch(`/api/characters/${selectedCharId}`, {
        method: 'GET'
    });
    
    const characterData = await response.json();

    console.log(characterData);
};

getPlayerCharacter();