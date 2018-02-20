var request = require('request');
var stockConst = require('./const.js');


module.exports = {
  sleep: function sleep(miliseconds) {
    let currentTime = new Date().getTime();
    while (currentTime + miliseconds >= new Date().getTime()) {}
  },
};
