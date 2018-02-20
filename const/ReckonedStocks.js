var request = require('request');
var stockConst = require('./const.js');
const cheerio = require('cheerio')
var nodemailer = require('nodemailer');
var fileUtil = require('./FileUtil.js');

//TODO cannot post to git
let allenEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'apss1943@gmail.com',
    pass: 'qooooq'
  }
});

//get 30 days
module.exports = {
  doJob: function doJob(fileName) {
    fileUtil.getStockNumbers(function(result) {
      let myInputs = [];
      for (let i = 0; i < result.length; i++) {
        if (Number.isInteger(parseInt(result[i]))) {
          myInputs.push(result[i]);
        }
      }

      let myResults = [];
      for (let i = 0; i < myInputs.length; i++) {
        getPriceById(myInputs[i])
          .then((isReckonedObj) => {
            if (isReckoned(isReckonedObj)) {
              myResults.push(myInputs[i] + " " + result[result.indexOf(myInputs[i]) + 1]);
            }
            if (i === myInputs.length - 1) {
              informMe(myResults);
              console.log('done!!');
            }
          });
      }
    }, fileName);
  }
};


function informMe(stockIds) {
  let context = '';
  for (let i = 0; i < stockIds.length; i++) {
    context += stockIds[i] + " ";
  }
  let mailOptions = {
    from: 'apss1943@gmail.com',
    to: 'apss1943@gmail.com',
    subject: 'Reckoned Stocks',
    html: 'I Reckon you to buy <b><font color="red">' + context + "</b></font>",
  };
  allenEmail.sendMail(mailOptions, function(error, info) {});
}

function getPriceById(id) {

  return new Promise((resolve, reject) => {
    request.get({
      url: stockConst.historicalPricesURL + id,
    }, function(err, res, body) {
      const $ = cheerio.load(body);
      let temp = [];
      let result = [];
      $('.historical_price').each(function(i, elem) {
        temp.push($(this).text().split('\n'))
      })
      temp[0].splice(0, 9);
      for (let i = 0; i < temp[0].length; i++) {
        let record = new Object();
        if (i % 7 === 5) {
          record.date = temp[0][i - 5];
          record.open = temp[0][i - 4];
          record.high = temp[0][i - 3];
          record.low = temp[0][i - 2];
          record.close = temp[0][i - 1];
          record.volume = temp[0][i];
          result.push(record);
        }
      }
      resolve(result);
    })
  })
}

// 1. 5/7 drop
// 2. the third lowest price
// 3. not big than 50
// example of input:{ date: 'Jan 2, 2018',  open: '231.50',  high: '232.50',
// low: '231.00', close: '232.50', volume: '18,008,000' } and this is an array
function isReckoned(inputs) {
  let fSmallNum = Number.MAX_VALUE;
  let sSmallNum = Number.MAX_VALUE;
  let tSmallNum = Number.MAX_VALUE;
  for (let i = 0; i < inputs.length; i++) {
    if (fSmallNum > inputs[i].close) {
      sSmallNum = fSmallNum;
      tSmallNum = fSmallNum;
      fSmallNum = inputs[i].close;
    } else if (sSmallNum > inputs[i].close) {
      tSmallNum = sSmallNum;
      sSmallNum = inputs[i].close;
    } else if (tSmallNum > inputs[i].close) {
      tSmallNum = inputs[i].close;
    }
  }
  let dropCount = 0;
  for (let i = 0; i < 7; i++) {
    if (inputs[i].close < inputs[i + 1].close) {
      dropCount++;
    }
  }
  return (inputs[0].close <= 50) &&
    (inputs[0].close <= tSmallNum || dropCount >= 5);
}
