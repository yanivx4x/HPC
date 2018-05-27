const rp = require('request-promise');
const Mark = require('mark.js');
const localURL = 'http://localhost:3000/api/getComments';
const remoteURL = 'http://hoopscommentarchive.com/api/getComments';

function getComments(author, comment) {
    return new Promise((resolve, reject) => {
        var options = {
            method: 'GET',
            uri: remoteURL,
            qs: {
                author: author,
                comment: comment
            },
            json: true // Automatically stringifies the body to JSON
        };

        rp(options)
            .then(function (parsedBody) {
                resolve(parsedBody);
            })
            .catch(function (err) {
                alert(err);
            });
    });
}
function handleComments(comments, commentContaines) {
    $table = $('#table-body');
    $table.html('');
    comments.forEach(comment => {
        $row = $('<tr> </tr>');
        $row.append(`<td> ${comment.author} </td>`);
        $row.append(`<td> ${comment.commentText} </td>`);
        $table.append($row);
    });
    markComments(commentContaines);
}

function markComments(keyword) {
    let instance = new Mark('#table-body');
    instance.mark(keyword);
}

$(function () {

    let btn = document.querySelector('#search-btn');
    btn.addEventListener('click', function (e) {
        e.preventDefault();
        let author = $('#author-input').val();
        let commentContaines = $('#comment-input').val();
        getComments(author, commentContaines).then(comments => handleComments(comments, commentContaines));
    });
});