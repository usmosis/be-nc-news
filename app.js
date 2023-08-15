const express = require("express");
const app = express();

const {sendTopics, sendEndpoints} = require("./controllers/topics.controllers.js")

app.get('/api/topics', sendTopics);

app.get('/api', sendEndpoints);

module.exports = app;
