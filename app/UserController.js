var stockDao = require('../dao/StockDao.js');
var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');

function renderHTML(path, response) {
  //FIXME
  path = path.replace('/NodeStockServer/', '')
  fs.readFile(path, null, function(error, data) {
    if (error) {
      response.writeHead(404);
      response.write('File not found');
    } else {
      response.write(data);
    }
    response.end();
  });
}

function readPostBody(callback, request) {
  var body = '';
  request.on('data', function(data) {
    body += data;
  });
  request.on('end', function() {
    let post = querystring.parse(body);
    //FIXME remove { '': '' }
    let jsonString = JSON.stringify(post);
    jsonString = jsonString.substring(1);
    jsonString = jsonString.substring(0, jsonString.length - 4);
    let jsonObj = JSON.parse(jsonString);
    jsonObj = JSON.parse(jsonObj);
    return callback(jsonObj);
  });
}

function mergeData(input, exist) {
  input.costs = (((input.costs * input.numbers) + (parseInt(exist[0].costs) * parseInt(exist[0].numbers))) /
    (parseInt(exist[0].numbers) + input.numbers)).toFixed(2);
  input.numbers = (parseInt(exist[0].numbers) + input.numbers);
  input.buyDate = exist[0].buyDate;
  input._id = exist[0]._id.toString();;
  let result = [];
  result.push(input);
  return result;
}

module.exports = {
  handleRequest: function(request, response) {
    response.writeHead(200, {
      'content-type': 'text/html'
    });
    var path = url.parse(request.url).pathname;
    if (request.method == 'POST') {
      switch (path) {
        case '/updStock':
          readPostBody(function(input) {
            stockDao.updStock(input);
          }, request);
          response.end();
          break;
        case '/addStock':
          readPostBody(function(input) {
            stockDao.isFind(input, function(obj) {
              //check data exist and add data
              if (obj.length > 0) {
                stockDao.updStock(mergeData(input, obj));
              } else {
                stockDao.addStock(input);
              }
            });
          }, request);
          response.end();
          break;
        default:
          renderHTML('', response);
          break;
      }
    } else if (request.method == 'GET') {
      switch (path) {
        case '/getAll':
          stockDao.getAll(function(items) {
            response.write(JSON.stringify(items));
            response.end();
          });
          break;
        case '/delStock':
          var params = url.parse(request.url, true).query;
          stockDao.delStock(params.id);
          response.end();
          break;
        default:
          renderHTML(path, response);
          break;
      }
    }
  }
};
