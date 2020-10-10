const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const app = express();

MongoClient.connect("mongodb://localhost:27017/ElecomWebServer", {useUnifiedTopology: true}, function(err, db) {
  if(!err) {
    console.log("We are connected");
  }
});

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.listen(3000);