const db = require('../db/connection')

exports.selectArticles = (topic, sort_by = "created_at", order = "desc") => {
const tableHeaders = [
    "article_id",
    "author", 
    "created_at", 
    "votes", 
    "article_img_url"
]
if(!tableHeaders.includes(sort_by)){
    return Promise.reject({status:400, msg:"Bad request"})
}

if(order !== 'desc' && order!== "asc"){
    return Promise.reject({status:400, msg:"Bad request"})
}
const queryValues = []

let baseSqlStringOne = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `

if(topic){
    baseSqlStringOne += `WHERE articles.topic = $1 `
    queryValues.push(topic)
}
baseSqlStringOne += `GROUP BY articles.article_id `

if(sort_by){
    baseSqlStringOne += `ORDER BY ${sort_by} `
}

if(order){
    baseSqlStringOne += `${order}`
}
    return db.query(baseSqlStringOne, queryValues)
    .then((result) => {
        return result.rows
    })
}

exports.checkTopicExists = (topic) => {
    return db
      .query(
        `SELECT * FROM topics
      WHERE slug = $1`,
        [topic]
      )
      .then(({ rows }) => {
        if (!rows.length) {
          return Promise.reject({ status: 404, msg: "Not found" });
        }
      });
  };

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