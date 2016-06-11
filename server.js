var express = require('express');
var app = express();
var fs = require('fs');
var havenondemand = require('havenondemand')
var https = require('https');
var request = require("request");
var Clarifai = require('clarifai');


var HPE_HAVEN_KEY = "60219a59-c74e-4a9a-9f58-9342a2586b81";
var client = new havenondemand.HODClient(HPE_HAVEN_KEY);

var Cclient = new Clarifai({
  id: 'vHoj4XdPkGsG1ThB_pvn9QrbldygqdJLGiK2d3Xq',
  secret: 'Cg6MqLWNyRQJNNcOHgBmrniToJFqBNooNGdkWko3'
})


app.use(express.static(__dirname + '/public'));

// check if on mobile
function isMobile(req) {
    var ua = req.headers['user-agent'];
    return /mobile/i.test(ua);
}



function getCredentials() {
/* 	var options = { 
		method: 'POST',
		url: 'https://api.clarifai.com/v1/token/',
		headers: { 
			'content-type': 'application/x-www-form-urlencoded',
			'postman-token': 'dc08176a-927b-1c0f-2bef-60ccef804fea',
			'cache-control': 'no-cache' 
		},
		form: { 
			client_id: 'vHoj4XdPkGsG1ThB_pvn9QrbldygqdJLGiK2d3Xq',
			client_secret: 'Cg6MqLWNyRQJNNcOHgBmrniToJFqBNooNGdkWko3',
			grant_type: 'client_credentials' 
		} 
	};

	request(options, function (error, response, body) {
		if (error) throw new Error(error);

		var data = JSON.parse(body);
		var access_token = data.access_token;
		console.log(access_token);
	}); */
	
	Cclient.getAccessToken(function(err, accessToken) {
		console.log('got token:', accessToken);
		
		fs.readFile(__dirname + '/images/472994020_XS.jpg', function(err, data) {
		  if (err) throw err;
			console.log('read image');
			Cclient.tagFromUrls('image', 'http://kickthescale.com/wp-content/uploads/2015/06/Mordy-The-Soccer-Ball.jpg', function(err, results) {
				if (err) throw err;
				
				console.log(results);
			});
			
			
		});

	});
}

getCredentials();


function checkJob(client, name, jobID, success) {
	client.getJobStatus(jobID, function(err, resp, body) {
		if (err) {
			return console.log('ERROR', err);
		}
		
		var status = resp.body.status;
		console.log('Service:', name, 'JobID:', jobID, 'Status:', status);
		
		if (status == 'finished') {
			success(resp.body);
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


/* var data = {'text' : 'I like cats'};
haven_request(client, 'analyzesentiment', data, function(body) {
	console.log(body.actions[0].result);
}); */





/* haven_request(client, 'recognizeimages', {
	'file' : __dirname + '/images/472994020_XS.jpg'
}, function(body) {
	console.log(JSON.stringify(body.actions[0]));
});
 */


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