const express = require("express");
const app = express();

const {sendTopics, sendEndpoints} = require("./controllers/topics.controllers.js")
const {updateArticleVotesById, sendArticles, sendArticleById} = require("./controllers/articles.controllers.js")
const {sendCommentsByArticleId, postComment} = require('./controllers/comments.controllers.js')

app.use(express.json());

app.get('/api/topics', sendTopics);

app.get('/api', sendEndpoints);

app.get('/api/articles/:article_id', sendArticleById)

app.get('/api/articles', sendArticles)

app.get('/api/articles/:article_id/comments', sendCommentsByArticleId)

app.post('/api/articles/:article_id/comments', postComment)

app.patch('/api/articles/:article_id', updateArticleVotesById)

app.use((err, req, res, next) => {
    if(err.status && err.msg){
      res.status(err.status).send({msg: err.msg})
    } else {
      next(err);
    }
  })

  app.use((err, req, res, next) => {
    if (err.code === "22P02" || err.code === "23502"){
      res.status(400).send({msg: 'Bad request'})
    } else {
      next(err);
    }
  })

  app.use((err, req, res, next) => {
    if (err.code === '23503'){
        res.status(404).send({msg: "Not found"})
    } else {
        next(err)
    }
  })

module.exports = app;
