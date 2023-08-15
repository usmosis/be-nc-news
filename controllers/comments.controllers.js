const {selectCommentsByArticleId} = require('../models/comments.models')
const {selectArticleById} = require('../models/articles.models')

exports.sendCommentsByArticleId = (req, res, next) => {

    const {article_id} = req.params;
    const promises = [selectArticleById(article_id)]

    if(article_id){
        promises.push(selectCommentsByArticleId(article_id))
    }

    Promise.all(promises)
    .then((resolvedPromises) => {
        const comments = resolvedPromises[1];
        res.status(200).send({comments})
    })
    .catch((err) => {
        next(err);
    })
}