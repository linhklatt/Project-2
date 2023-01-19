module.exports = {
  format_date: (date) => {
    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  },
  get_sprite: (role) => {
    switch(role) {
      case 'warrior':
        return `<img src="../../images/warr-static-right.png" />`;
      case 'archer':
        return `<img src="../../images/archer-standing.png" />`;
      case 'mage':
        return `<img src="../../images/mage-static-right.png" />`;
      default:
        return `<img src="../../images/default.png" />`;
    }
  }
};
