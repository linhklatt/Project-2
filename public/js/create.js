const roleList = $(".create-select");
const roleDescription = $(".create-description");
const nameForm = $(".name-form");
const nameInput = $("#character-name");
const backBtn = $("#create-back");
const finishBtn = $("#create-finish");

roleList.on("click", async (event) => {
  event.preventDefault();

  let selectedRoleTile = $(event.target).closest("div.create-tile")[0];

  if (selectedRoleTile) {
    let role = selectedRoleTile.getAttribute("role");

    let lastSelectedRole = $(".selected-role");
    let lastRole = localStorage.getItem("createRole");
    $(lastSelectedRole).removeClass("selected-role");
    $(lastSelectedRole).removeClass(`${lastRole}-walk-right`);

    $(selectedRoleTile).addClass("selected-role");
    $(selectedRoleTile).addClass(`${role}-walk-right`);

    generateDescription(role);

    localStorage.setItem("createRole", role);
    nameForm.prop("hidden", false);
  }
});

nameInput.on("input", () => {
  if (nameInput.val()) {
    finishBtn.prop("disabled", false);
  } else {
    finishBtn.prop("disabled", true);
  }
});

function generateDescription(role) {
  switch (role) {
    case "warrior":
      roleDescription.text(
        "The warrior character is a powerful and skilled fighter, equipped with a variety of weapons and armor. They possess great strength and endurance, able to dish out heavy damage and withstand large amounts of punishment. They excel in close-quarters combat, using their brute force to overpower opponents and finishing them off with devastating finishing moves. Their fighting style is often focused on melee attacks and grappling, with a good balance of offense and defense. They may also have access to special abilities, such as calling upon allies to aid them in battle or using powerful magic to enhance their attacks. They are suitable for players who prefer a more direct and aggressive play style."
      );
      break;
    case "archer":
      roleDescription.text(
        "The archer character is a ranged fighter that excels in long-range combat. They are equipped with a bow and arrows, and their fighting style focuses on precise and quick attacks from a distance. They possess great accuracy, able to hit targets from far away and avoiding close-quarters combat. They may also have access to special abilities, such as the ability to shoot multiple arrows at once, or to use traps to control the battlefield. They are suitable for players who prefer a more strategic and evasive play style, who enjoy outwitting their opponents and keeping them at bay while dealing consistent damage."
      );
      break;
    case "mage":
      roleDescription.text(
        "The mage character is a spellcaster that specializes in casting powerful magic to defeat their opponents. They possess a wide variety of spells that can deal heavy damage, control the battlefield, and support allies. They are usually fragile and weak in close-quarters combat, but they make up for it with their ability to attack from a distance and a wide variety of spells to choose from. Their fighting style is often focused on elemental magic, such as fire, ice or lightning, and they may also have access to special abilities such as teleportation, healing spells, or the ability to summon creatures to aid them in battle. They are suitable for players who prefer a more strategic and tactical play style, using a variety of spells to outsmart and outmaneuver their opponents."
      );
      break;
    default:
      roleDescription.text("Select your desired role.");
      break;
  }
}

backBtn.on("click", async (event) => {
  event.preventDefault();

  const response = await fetch("/home", {
    method: "GET",
  });

  if (response.ok) {
    document.location.replace("/home");
  } else {
    alert(response.statusText);
  }
});

finishBtn.on("click", async (event) => {
  event.preventDefault();

  const name = await nameInput.val();
  console.log(name);
  const role = localStorage.getItem("createRole");

  if (name && role) {
    const response = await fetch("/api/characters/", {
      method: "POST",
      body: JSON.stringify({ name, role }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      document.location.replace("/home");
    } else {
      alert("failed to create character");
    }
  } else if (!role) {
    let title = "No Role Found";
    let message = "Please select a role for your character.";
    $("#mainModal").find(".modal-title").text(title);
    $("#mainModal").find(".modal-body p").text(message);
    $("#mainModal").find(".btn-primary").hide();
    $("#mainModal").modal("show");
  } else {
    let title = "No Name Found";
    let message = "Please enter a name for your character.";
    $("#mainModal").find(".modal-title").text(title);
    $("#mainModal").find(".modal-body p").text(message);
    $("#mainModal").find(".btn-primary").hide();
    $("#mainModal").modal("show");
  }
});

localStorage.setItem("createRole", "");
