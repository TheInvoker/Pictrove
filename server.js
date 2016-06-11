var express = require('express');
var app = express();
var fs = require('fs');
var havenondemand = require('havenondemand')
var Clarifai = require('clarifai');

var formidable = require('formidable');


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



function imageRecognize(image_path, success) {	
	fs.readFile(image_path, function(err, data) {
		if (err) {
			return console.log('ERROR', err);
		}
		
		//console.log('read image');
		//Cclient.tagFromUrls('image', 'http://kickthescale.com/wp-content/uploads/2015/06/Mordy-The-Soccer-Ball.jpg', function(err, results) {
		Cclient.tagFromBuffers('image', data, function(err, results) {
			if (err) {
				return console.log('ERROR', err);
			}
			
			success(results);
		});
	});
}




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

/* imageRecognize(__dirname + '/images/472994020_XS.jpg', function(results){
	console.log(results);
});
 */





/*
 * Visit the home page
 */
app.get('/', function (req, res) {
	res.sendFile(__dirname + '/public/pictrove.html');
});
/*
 * Handle image upload
 */
app.post('/upload', function (req, res, next) {
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {

	});

	form.on('end', function(fields, files) {
		/* Temporary location of our uploaded file */
		var temp_path = this.openedFiles[0].path;
		/* The file name of the uploaded file */
		var file_name = this.openedFiles[0].name;
		/* Location where we want to copy the uploaded file */
		var new_location = __dirname + '/images/uploads/';

		fs.rename(temp_path, new_location + file_name, function(err) {  
			if (err) {
				console.error(err);
			} else {
				console.log("success!")
			}
		});
	});
	
	res.writeHead(200); 
	res.end(JSON.stringify({
		'status':'ok'
	}));
});




var server = app.listen(process.env.PORT || 3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Pictrove started at http://%s:%s', host, port);
});