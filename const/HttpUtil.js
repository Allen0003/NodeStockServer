var request = require('request');
var stockConst = require('./const.js');


module.exports = {
  getNameById: function getNameById(id) {
    return new Promise((resolve, reject) => {
      request.get({
        url: stockConst.stockApiURL + id,
      }, function(err, res, body) {
        let match = stockConst.titleReg.exec(body);
        let title = match[2];
        resolve(title.substring(0, title.indexOf('(' + id)));
      })
    })
  },
};
