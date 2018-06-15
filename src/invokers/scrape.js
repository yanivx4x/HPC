let scrapePage = require('./openArticleInvoker').scrapePage;
let db = require('../db/mongoClient');


function scrapeHoops() {
    var lim = 42;// parseInt(process.argv[2])
    for(var i=10*lim;i<10*(lim+1);i++){
        console.log(i);
        let url = `http://www.hoops.co.il/?paged=` + i.toString();
        scrapePage({ url: url });
    }
}
module.exports.scrapeHoops = scrapeHoops;