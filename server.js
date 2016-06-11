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





function checkJob(client, name, jobID, success) {
	client.getJobStatus(jobID, function(err, resp, body) {
		if (err) {
			return console.log('ERROR', err);
		}
		
		var status = resp.body.status;
		console.log('Service:', name, 'JobID:', jobID, 'Status:', status);
		
		if (status == 'finished') {
			success(resp.body.actions[0].result);
		} else if (status == 'queued') {
			setTimeout(function() {
				checkJob(client, name, jobID, success);
			}, 1000);
		}
	});
}
function haven_request(client, name, data, success) {
	console.log('Making request', name);
	
	client.call(name, data, true, function(err,resp,body) {
		if (err) {
			return console.log('ERROR', err);
		}

		var jobID = resp.body.jobID;
		checkJob(client, name, jobID, success);
	}, data);	
}


var data = {'text' : 'I like cats'};
haven_request(client, 'analyzesentiment', data, function(result) {
	console.log(result);
});




app.use(express.static(__dirname + '/public'));


/*
 * Visit the home page.
 */
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/pictrove.html');
});




var server = app.listen(process.env.PORT || 3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Pictrove started at http://%s:%s', host, port);
});