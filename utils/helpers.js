module.exports = {
  format_date: (date) => {
    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  },
  get_sprite: (role) => {
    switch(role) {
      case 'warrior':
        return `<img src="/images/warr-static-right.png"  char-id={{character.id}} />`;
      case 'archer':
        return `<img src="/images/arch-static-right.png"  char-id={{character.id}} />`;
      case 'mage':
        return `<img src="/images/mage-static-right.png"  char-id={{character.id}} />`;
      default:
        return `<img src="/images/default.png"  char-id={{character.id}} />`;
    }
  },
  get_static_right: (role) => {
    switch(role) {
      case 'warrior':
        return `warrior-static-right`;
      case 'archer':
        return `archer-static-right`;
      case 'mage':
        return `mage-static-right`;
      default:
        return `default-static-right`;
    }
  }
};
