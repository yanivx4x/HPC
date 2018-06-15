const rp = require('request-promise');
const cheerio = require('cheerio');
const db = require('../db/mongoClient');
let count = 0;
//  Array of hebrew months used to parse dates from hebrew to Datetime 
const hebrewMonths = [
    'ינו',
    'פבר',
    'מרץ',
    'אפר',
    'מאי',
    'יונ',
    'יול',
    'אוג',
    'ספט',
    'אוק',
    'נוב',
    'דצמ',
]
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
                    //  Get the hebrew date, translate the month using the array above
                    //  and concatenate to get full date
                    let commentHebrewDate = $($($($(item.children[1].children[1])[0].children[5])[0]).children()[0]).text().replace('.','').replace(',','').replace(' ','-').replace(' ', '-');
                    let commentHebrewMonth = commentHebrewDate.split('-')[1];
                    let monthNumber = hebrewMonths.indexOf(commentHebrewMonth) + 1;
                    monthNumber = monthNumber < 10 ? '0' + monthNumber.toString() : monthNumber.toString();
                    let commentDate = commentHebrewDate.replace(commentHebrewMonth, monthNumber);
                    let commentTime = $($($($(item.children[1].children[1])[0].children[5])[0]).children()[2]).text() + ":00";
                    let commentDateTime = commentDate + 'T' + commentTime;
                    //  Get the page url, the comment id and concatenate them
                    let pageUrl = $($('.title')[1].children[0]).attr('href');
                    let commentId = $(item).attr('id');
                    let commentUrl = pageUrl + '#' + commentId;
                    db.saveComment(comment, commenterName, commentDateTime, commentUrl)
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

