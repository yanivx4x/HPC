const rp = require('request-promise');
const cheerio = require('cheerio');
const saveComments = require('./scrapArticleInvoker').saveAllCommentsFromURL;


function scrapePage({ url }) {
    return new Promise((resolve, reject) => {
        const options = {
            uri: url,
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        rp(options)
            .then(async ($) => {
                let divs = $('div .post-title');
                divs.each(async function (index, item) {
                    let href = item.children[1].children[0].attribs.href;
                    await saveComments({ url: href });
                });
                resolve();
            })
            .catch((err) => {
                console.log(err);
                reject();
            });
    })
}

module.exports.scrapePage = scrapePage;