const {selectCommentsByArticleId} = require('../models/comments.models')

exports.sendCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params;
    selectCommentsByArticleId(article_id)
    .then((comments) => res.status(200).send({comments}))
    .catch((err) => {
        next(err)
    })
}