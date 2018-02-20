var http = require('http');
var controller = require('./app/UserController.js');
var reckonedStocks = require('./const/ReckonedStocks.js');
var stockConst = require('./const/const.js');


// reckonedStocks.doJob(stockConst.stockCategories.steel);

http.createServer(controller.handleRequest).listen(8080);
