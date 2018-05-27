let scrapePage = require('./openArticleInvoker').scrapePage;
let db = require('../db/mongoClient');

function scrapeHoops() {
    let url = `http://www.hoops.co.il`;
    scrapePage({ url: url });
}
module.exports.scrapeHoops = scrapeHoops;