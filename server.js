var express = require('express');
var app = express();
var fs = require('fs');



    


function isMobile(req) {
    var ua = req.headers['user-agent'];
    return /mobile/i.test(ua);
}






app.use(express.static(__dirname + '/public'));


/*
 * Visit the home page.
 */
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

app.get('/welcome', function (req, res) {

});

app.get('/tou', function (req, res) {
	res.writeHead(code); 
	res.end(str);
});


var server = app.listen(process.env.PORT || 3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Pictrove started at http://%s:%s', host, port);
});