var moment = require('moment');

module.exports = function () {
  return moment().format('MM-DD-YYYY-HH-mm-ss');
}