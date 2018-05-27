let scrapePage = require('./openArticleInvoker').scrapePage;
let db = require('../db/mongoClient');
db.start();
scrapeHoops();

async function scrapeHoops() {
    for (let i = 683; i < 684; i++) {
        let url = `http://www.hoops.co.il/?paged=${i}`;
        console.log(`scraping ${i}`);
        await scrapePage({ url: url });
    }
   // process.exit(1);
}