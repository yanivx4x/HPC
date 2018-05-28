/*
THIS FILE IS A PLAYGROUND
*/


let scrapePage = require('./openArticleInvoker').scrapePage;
let db = require('../db/mongoClient');
db.start();

scrapeHoops();

async function getCommonWords() {
    let words = await db.getWordsByCount();
    words = words.filter(x => x.count > 1000);
    words.sort((a, b) => b.count - a.count);
    console.log(words);
    process.exit(1);
}

async function scrapeHoops() {
    for (let i = 1; i < 2; i++) {
        let url = `http://www.hoops.co.il/?paged=${i}`;
        console.log(`scraping ${i}`);
        await scrapePage({ url: url });
    }
    // process.exit(1);
}