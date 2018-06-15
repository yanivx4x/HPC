//Import the mongoose module
const _ = require('underscore');
const mongoose = require('mongoose');
//const uri = "mongodb://localhost:27017,localhost:27017,localhost:27017/test?ssl=falseretryWrites=true";
const uri = "mongodb://yanivx4x:A23ipz56!@hoopscluster-shard-00-00-9xmkf.mongodb.net:27017,hoopscluster-shard-00-01-9xmkf.mongodb.net:27017,hoopscluster-shard-00-02-9xmkf.mongodb.net:27017/test?ssl=true&replicaSet=HoopsCluster-shard-0&authSource=admin&retryWrites=true";
var myConnection;



function ConnectToDb() {
    return new Promise((resolve, reject) => {
        mongoose.connect(uri, {
            autoIndex: false
        }).then(function () {
            resolve();
        });
    })
}

function saveComment(commentText, author) {
    return new Promise((resolve, reject) => {
        let commentType = require('./models/Comment');
        let myComment = new commentType({ commentText: commentText, author: author });

        commentType.findOneAndUpdate({ commentText: commentText, author: author }, myComment, { upsert: true }, function (err, res) {
            if (err) {
                reject(err);
            }
            else {
                resolve(null);
            }
        })
        /* myComment.save(function (err) {
             if (err) reject(err);
             else resolve(null);
    });*/

    });
}

function getCommentsByAuthor(author) {
    return new Promise((resolve, reject) => {
        let commentType = require('./models/Comment');

        commentType.find({ "author": { "$regex": author, "$options": "i" } }
            , function (err, comments) {
                if (err) reject(err);
                resolve(comments || []);
            });

    });
}

function getCommentsByAuthorAndComment(author, comment) {
    return new Promise((resolve, reject) => {
        let commentType = require('./models/Comment');

        commentType.find({ "author": { "$regex": author, "$options": "i" }, "commentText": { "$regex": comment, "$options": "i" } }
            , function (err, comments) {
                if (err) reject(err);
                resolve(comments || []);
            });

    });
}

function getCountByAuthor(author) {
    author = author.indexOf("\t\t\t") > -1 ? author : "\t\t\t            " + author + " ";
    return new Promise((resolve, reject) => {
        let commentType = require('./models/Comment');

        commentType.count({ "author": author }
            , function (err, count) {
                if (err) {console.log('error in count'); console.log(err); reject(err)};
                resolve({author:author, count:count} || {});
            });
    });
}

function getCommentersList() {
    return new Promise((resolve, reject) => {
        let commentType = require('./models/Comment');

        commentType.distinct("author"
            , function (err, distinctCommenters) {
                if (err) {console.log('error in count'); console.log(err); reject(err)};
                distinctCommenters = distinctCommenters.map((author) => {return author})
                arrPromises = [];
                for(var author of distinctCommenters) arrPromises.push(getCountByAuthor(author));
                Promise.all(arrPromises).then((authorsTotal) => {
                    authorsTotal = authorsTotal.map((authorTotal) => {authorTotal.author ? authorTotal.author = authorTotal.author.replace("\t\t\t", "").trim() : authorTotal.author; return authorTotal})
                    resolve(authorsTotal.sort((a,b) => {return b.count - a.count}) || []);
                })
            });
    });
}

function getWordsByCount() {
    return new Promise((resolve, reject) => {
        let commentType = require('./models/Comment');
        commentType.aggregate([{
            $project: {
                words: { $split: ["$commentText", " "] }
            }
        },
        {
            $unwind: {
                path: "$words"
            }
        },
        {
            $group: {
                _id: "$words",
                count: { $sum: 1 }
            }
        }], function (err, results) {
            if (err) reject(err);
            if (results) resolve(results);
            else resolve([]);
        });

    });
}




module.exports.start = ConnectToDb;
module.exports.saveComment = saveComment;
module.exports.Connection = mongoose.connection;
module.exports.getCommentsByAuthor = getCommentsByAuthor;
module.exports.getCommentsByAuthorAndComment = getCommentsByAuthorAndComment;
module.exports.getWordsByCount = getWordsByCount;
module.exports.getCountByAuthor = getCountByAuthor;
module.exports.getCommentersList = getCommentersList;
