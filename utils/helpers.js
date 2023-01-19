module.exports = {
  format_date: (date) => {
    // Format date as MM/DD/YYYY
    return date.toLocaleDateString();
  },
  get_sprite: (role) => {
    switch(role) {
      case 'warrior':
        return `<img src="../../images/warrior-standing.png" />`;
      case 'archer':
        return `<img src="../../images/archer-standing.png" />`;
      default:
        return `<img src="../../images/warrior-standing.png" />`;
    }
  }
};
