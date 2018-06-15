let express = require('express');
let commentRouter = express.Router();
let db = require('../db/mongoClient');

module.exports = () => {

    commentRouter.route('/rankByCommenterCountRouter')
        .get(async function (req, res) {
            let commentersList = await db.getCommentersList()
            res.end(JSON.stringify(commentersList));
        });

    return commentRouter;
};