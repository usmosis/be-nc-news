const {selectCommentsByArticleId} = require('../models/comments.models')
const {selectArticleById} = require('../models/articles.models')

exports.sendCommentsByArticleId = (req, res, next) => {

    const {article_id} = req.params;

    selectArticleById(article_id)
    .then(() => {
        return selectCommentsByArticleId(article_id)
    })
    .then((comments) => {
        console.log(comments, "<<< controller")
        return res.status(200).send({comments})})
    .catch((err) => {
        next(err)
    })
}