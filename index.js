
var globs = {};
globs.IPLISTEN = '127.0.0.1';
globs.PORT_LISTEN_DIST = 8080;
var express = require('express');
const path = require("path");

var app = express();
app.use(express.static("./dist"));
app.use(express.static(__dirname));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(globs.PORT_LISTEN_DIST, function () {
    console.log('Now opening your browser to http://localhost:8080/msgetstarted.html'.yellow);
});
