var express = require('express');
var app = express();
var os = require("os");

var port = process.env.PORT || 8080;

app.get('/', function (req, res) {
    res.send("Learning Docker");
});

app.listen(port, function () {
  console.log("Listening: http://%s:%s", os.hostname(), port);
});