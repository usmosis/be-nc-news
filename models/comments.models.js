const db = require('../db/connection')

exports.selectCommentsByArticleId = (article_id) => {
    return db.query("SELECT * FROM comments JOIN articles ON articles.article_id = comments.article_id WHERE comments.article_id = $1;", [article_id])
    .then((result) => {
        
        return result.rows
    }
)}

exports.insertComment = ({article_id, username, body}) => {
    return db.query("INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *;", [article_id, username, body])
    .then((result) => {
        return result.rows[0]
    })

}

