const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const scrapeHoops = require('./src/invokers/scrape').scrapeHoops;
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const port = process.env.PORT || 3000;
const db = require('./src/db/mongoClient');
db.start();

app.use(express.static('public'));

let commentRouter = require('./src/routes/commentRouter')();
let indexRouter = require('./src/routes/indexRouter')();
app.use('/', indexRouter);
app.use('/api', commentRouter);

app.set('view engine', 'ejs');
app.set('views', './src/views');

app.listen(port, function () {
    console.log('listening on port ' + port);
});

var j = schedule.scheduleJob('0 0 */3 * *', function () {
    console.log('scraping');
    scrapeHoops();
});

