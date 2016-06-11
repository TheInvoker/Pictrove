var express = require('express');
var app = express();
var fs = require('fs');
var havenondemand = require('havenondemand')



var HPE_HAVEN_KEY = "60219a59-c74e-4a9a-9f58-9342a2586b81";
var client = new havenondemand.HODClient(HPE_HAVEN_KEY);

// check if on mobile
function isMobile(req) {
    var ua = req.headers['user-agent'];
    return /mobile/i.test(ua);
}




var data = {'text' : 'I like cats'};
var jobID;



function checkJob(jobID) {
	client.getJobStatus(jobID, function(err, resp, body) {
		
		var status = resp.body.status;
		console.log(status);
		
		if (status == 'finished') {
			handleResult(resp.body.actions[0].result);
		} else {
			setTimeout(function() {
				checkJob(jobID);
			}, 1000);
		}
	});
}
function handleResult(result) {
	console.log(result);
}
client.call('analyzesentiment', data, true, function(err,resp,body) {
	jobID = resp.body.jobID;
	console.log(jobID);
	checkJob(jobID);
}, data);








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