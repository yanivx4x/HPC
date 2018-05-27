let express = require('express');
let commentRouter = express.Router();
let db = require('../db/mongoClient');

module.exports = () => {

    commentRouter.route('/getComments')
        .get(async function (req, res) {
            let author = req.query.author;
            let comment = req.query.comment;
            let comments = await db.getCommentsByAuthorAndComment(author, comment)
            res.end(JSON.stringify(comments));
        });

    return commentRouter;
};