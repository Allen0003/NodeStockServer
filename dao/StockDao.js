var MongoClient = require('mongodb').MongoClient;
var stockConst = require('../const/const.js');
var ObjectID = require('mongodb').ObjectID;
var httpUtil = require('../const/HttpUtil.js');


module.exports = {
  getAll: function getAll(callback) {
    MongoClient.connect(stockConst.dbURL, function(err, db) {
      var collection = db.db(stockConst.dbName).collection(stockConst.collectionName);
      collection.find().toArray(function(err, items) {
        db.close();
        return callback(items);
      });
    });
  },
  updStock: function updStock(updaObj) {
    MongoClient.connect(stockConst.dbURL, function(err, db) {
      for (var index in updaObj) {
        var query = {
          '_id': ObjectID(updaObj[index]._id)
        };
        delete updaObj[index]._id;
        delete updaObj[index].isChange;
        var newValues = {
          $set: updaObj[index]
        };
        db.db(stockConst.dbName).collection(stockConst.collectionName)
          .updateOne(query, newValues, function(err, res) {
            db.close();
          });
      }
    });
  },
  delStock: function delStock(id) {
    MongoClient.connect(stockConst.dbURL, function(err, db) {
      var myQuery = {
        '_id': ObjectID(id)
      };
      db.db(stockConst.dbName).collection(stockConst.collectionName)
        .remove(myQuery, function(err, obj) {
          db.close();
        });
    });
  },
  addStock: function addStock(addObj) {
    MongoClient.connect(stockConst.dbURL, function(err, db) {
      httpUtil.getNameById(addObj.stockId)
        .then((result) => {
          addObj.stockName = result;
          db.db(stockConst.dbName).collection(stockConst.collectionName)
            .insertOne(addObj, function(err, obj) {
              db.close();
            });
        });
    });
  },
  isFind: function isFind(checkObj, callback) {
    MongoClient.connect(stockConst.dbURL, function(err, db) {
      var collection = db.db(stockConst.dbName).collection(stockConst.collectionName);
      //select not sell stock
      collection.find({
        "stockId": checkObj.stockId,
        "sellDate" : null,
      }, {
        $exists: true
      }).toArray(function(err, obj) {
        return callback(obj);
      });
    });
  },


};
