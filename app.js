var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
var os = require("os");
var morgan  = require('morgan');

var port = process.env.PORT || 8080;
var message = process.env.MESSAGE || "Learning Docker!";

app.get('/', function (req, res) {
    res.render('home', {
      message: message,
      hostName: os.hostname()
    });
});

app.listen(port, function () {
  console.log("Listening: http://%s:%s", os.hostname(), port);
});