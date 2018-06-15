// grab the things we need
var mainMongo = require('../mongoClient.js');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');


autoIncrement.initialize(mainMongo.Connection);

// create a schema
var commentSchema = new Schema({
    commentText: String,
    author: String,
    commentDateTime: String,
    commentUrl: String
});


// the schema is useless so far
// we need to create a model using it
commentSchema.plugin(autoIncrement.plugin, {
    model: 'Comment',
    field: 'CommentId'
});
var Comment = mongoose.model('Comment', commentSchema);

// make this available to our comments in our Node applications
module.exports = Comment;