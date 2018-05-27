const express = require('express');
const app = express();
const bodyParser = require('body-parser');
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

/*getComments();

async function getComments() {
    let comments = await db.getCommentsByAuthorAndComment('אשך', 'לברון');
    console.log(comments);
    process.exit(1);
}*/