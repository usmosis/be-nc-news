const {selectUsers} = require('../models/users.models')

exports.sendUsers = (req, res) => {
    selectUsers().then((users) => {
        res.status(200).send({users})
    })
}