const {selectArticles, selectArticleById} = require('../models/articles.models')

exports.sendArticles = (req, res) => {
    selectArticles()
    .then((articles) => res.status(200).send({articles}))
}


exports.sendArticleById = (req, res, next) => {
    const {article_id} = req.params;
    selectArticleById(article_id)
    .then((article) => res.status(200).send({article}))
    .catch((err) => {
        next(err)
    })
}

