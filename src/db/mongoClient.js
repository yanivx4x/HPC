//Import the mongoose module
const _ = require('underscore');
const mongoose = require('mongoose');
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

function saveComment(commentText, author, commentDateTime, commentUrl) {
    return new Promise((resolve, reject) => {
        let commentType = require('./models/Comment');
        let myComment = new commentType({ commentText: commentText, author: author, commentDateTime: commentDateTime, commentUrl: commentUrl });

        commentType.findOneAndUpdate({ commentText: commentText, author: author, commentDateTime: commentDateTime, commentUrl: commentUrl }, myComment, { upsert: true }, function (err, res) {
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
