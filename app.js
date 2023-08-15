const express = require("express");
const app = express();

const {sendTopics, sendEndpoints} = require("./controllers/topics.controllers.js")
const {sendArticles, sendArticleById} = require("./controllers/articles.controllers.js")
const {sendCommentsByArticleId} = require('./controllers/comments.controllers.js')

app.use(express.json());

app.get('/api/topics', sendTopics);

app.get('/api', sendEndpoints);

app.get('/api/articles/:article_id', sendArticleById)

app.get('/api/articles', sendArticles)

app.get('/api/articles/:article_id/comments', sendCommentsByArticleId)

app.use((err, req, res, next) => {
    if(err.status && err.msg){
      res.status(err.status).send({msg: err.msg})
    } else {
      next(err);
    }
  })

  app.use((err, req, res, next) => {
    if (err.code === "22P02"){
      res.status(400).send({msg: 'Bad request'})
    } else {
      next(err);
    }
  })

module.exports = app;
