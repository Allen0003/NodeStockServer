module.exports = {
  dbName: "subscribe",
  collectionName: "stockRecord",
  dbURL: "mongodb://localhost:27017/",
  stockApiURL: "https://www.wantgoo.com/stock/",
  titleReg: /(<\s*title[^>]*>(.+?)<\s*\/\s*title)>/gi,
  historicalPricesURL: "https://finance.google.com/finance/historical?q=TPE:",
  stockCategories: {
    finance: "金融.txt",
    glass: "玻璃.txt",
    flight: "航運.txt",
    tech: "電腦週邊.txt",
    techII: "半導體.txt",
    steel: "鋼鐵.txt",
  },
};
