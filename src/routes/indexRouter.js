const express = require('express');
let indexRouter = express.Router();

module.exports = () => {


    indexRouter.route('/')
        .get(function (req, res) {
            res.render('index', {});
        });

    return indexRouter;
};