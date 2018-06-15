let express = require('express');
let commentRouter = express.Router();
let db = require('../db/mongoClient');

module.exports = () => {

    commentRouter.route('/getCount')
        .get(async function (req, res) {
            let author = req.query.author;
            let count = await db.getCountByAuthor(author)
            res.end(JSON.stringify(count));
        });

    return commentRouter;
};