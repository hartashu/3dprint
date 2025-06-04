const formatDate = (date) => {
  return `${date.toISOString(date).split('T')[0]} | ${date.toISOString(date).split('T')[1].split('.')[0]}`;
};

module.exports = formatDate;