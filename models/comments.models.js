const db = require('../db/connection')

exports.selectCommentsByArticleId = (article_id) => {
    return db.query("SELECT * FROM comments JOIN articles ON articles.article_id = comments.article_id WHERE comments.article_id = $1;", [article_id])
    .then((results) => {
        if(!results.rows[0]){
            return Promise.reject({status: 404, msg: "Not found"})
        } else {
            return results.rows
        }
    }
)}

