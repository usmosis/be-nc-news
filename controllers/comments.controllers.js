const {selectCommentsByArticleId, insertComment, deleteCommentById, selectCommentById} = require('../models/comments.models')
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

exports.postComment = (req, res, next) => {

    const {article_id} = req.params
    const {username, body} = req.body
    const promises = [selectArticleById(article_id)]

    if(article_id){
        promises.push(insertComment({article_id, username, body}))
    }

    Promise.all(promises)
    .then((resolvedPromises) => {
        const comment = resolvedPromises[1];
        res.status(201).send({comment})
    })
    .catch((err) => {
         next(err)
    })
}

exports.deleteComment = (req, res, next) => {
    const {comment_id} = req.params
    const promises = [selectCommentById(comment_id), deleteCommentById(comment_id)]

        Promise.all(promises)
        .then(() => {
            res.status(204).send()
        })
        .catch((err) => {
            next(err)
        })
    }

