var stockConst = require('./const.js');
var fs = require('fs');
var path = require('path');

module.exports = {
  getStockNumbers: function getStockNumber(callback, fileName) {
    let filePath = path.join(__dirname, '../allStockData/' + fileName);
    fs.readFile(filePath, {
      encoding: 'utf-8'
    }, function(err, data) {
      if (!err) {
        let fileString = data.toString();
        let res = fileString.split(" ");
        return callback(res);
      }
    });
  }
};
