const rp = require('request-promise');
const cheerio = require('cheerio');
const db = require('../db/mongoClient');
let count = 0;

function saveAllCommentsFromURL({ url }) {
    return new Promise((resolve, reject) => {
        const options = {
            uri: url,
            transform: function (body) {
                return cheerio.load(body);
            }
        };

        rp(options)
            .then(($) => {
                let divs = $('.comment');
                divs.each(async (index, item) => {
                    let $itemName = $(item.children[1].children[1]);
                    let commenterName = $itemName.text().split("\n")[1];
                    let $itemComment = $(item.children[3]);
                    let comment = $itemComment.text();
                    db.saveComment(comment, commenterName)
                        .then((data) => {
                            console.log('saved comment!');
                            console.log(`****${count++}****`);
                            resolve();
                        })
                        .catch((err) => {
                            console.log('already exits!');
                            resolve();
                        });

                });

            })
            .catch((err) => {
                console.log(err);
            });
    });
}

module.exports.saveAllCommentsFromURL = saveAllCommentsFromURL;

