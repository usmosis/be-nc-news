const {selectTopics} = require("../models/topics.models.js")

const endPoints = require("../endpoints.json")
exports.sendTopics = (req, res) => {
    selectTopics().then((topics) => res.status(200).send({topics}))
}

exports.sendEndpoints = (req, res) => {
    return res.status(200).send({endPoints});
}