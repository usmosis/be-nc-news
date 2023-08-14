const express = require("express");
const app = express();

const {sendTopics} = require("./controllers/topics.controllers.js")

app.get('/api/topics', sendTopics);

module.exports = app;
