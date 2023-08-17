const db = require('../db/connection')

exports.selectArticles = () => {
    return db.query("SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;")
    .then((result) => {
        return result.rows
    })
}

exports.selectArticleById = (article_id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then((result) => {
        if(!result.rows[0]){
            return Promise.reject({status: 404, msg: "Not found"})
        } else {
            return result.rows[0];
    }
        
    })}

 exports.updateArticleVotes = (article_id, inc_votes) => {

    return db.query("UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;",[inc_votes, article_id])
    .then((result) => {
    return result.rows[0];
 })
}