const {updateArticleVotes, selectArticles, selectArticleById, checkTopicExists} = require('../models/articles.models')

exports.sendArticles = (req, res, next) => {
    const {topic, sort_by, order} = req.query
    const promises = [selectArticles(topic, sort_by, order)]

    if(topic){
        promises.push(checkTopicExists(topic))
    }

    Promise.all(promises)
    .then((resolvedPromises) => {
        const articles = resolvedPromises[0]
        return res.status(200).send({articles})
    })
    .catch((err)=>{
        next(err)
    })
}


exports.sendArticleById = (req, res, next) => {
    const {article_id} = req.params;
    selectArticleById(article_id)
    .then((article) => res.status(200).send({article}))
    .catch((err) => {
        next(err)
    })
}

exports.updateArticleVotesById = (req, res, next) => {

    const {inc_votes} = req.body
    const {article_id} = req.params
    
    const promises = [selectArticleById(article_id)]

    if (article_id){
        promises.push(updateArticleVotes(article_id, inc_votes))
    }
    
    Promise.all(promises)
    .then((resolvedPromises) => {
        const article = resolvedPromises[1]
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err)
    })
}
