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
		} else {
			setTimeout(function(client, name, jobID, success) {
				checkJob(client, name, jobID, success);
			}, 1000, client, name, jobID, success);
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




function compileImageRecognitionData(data) {
	var tags = data.tags;
	var tag_array = tags.map(function(x) {
		return x["class"];
	});
	return tag_array;
}


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
	next();
}, function(req, res) {
	var form = new formidable.IncomingForm();
	var caption = '';
	
	
	form.parse(req, function(err, fields, files) {
		if (err) {
			return console.log('ERROR', err);
		}
		caption = fields.caption;
	});

	form.on('end', function(fields, files) {
		if (this.openedFiles[0].size > 0) {
		
			/* Temporary location of our uploaded file */
			var temp_path = this.openedFiles[0].path;
			/* The file name of the uploaded file */
			var file_name = this.openedFiles[0].name;
			/* Location where we want to copy the uploaded file */
			var new_location = __dirname + '/images/uploads/' + file_name;

			fs.rename(temp_path, new_location, function(err) {  
				if (err) {
					return console.log('ERROR', err);
				} else {
					console.log("success!");

					processImageRecognition(res, new_location, caption);
				}
			});
		} else {	
			res.writeHead(200); 
			res.end(JSON.stringify({
				'status':'ok'
			}));
		}
	});
});


function processImageRecognition(res, new_location, caption) {
	imageRecognize(new_location, function(results) {
		var tag_array = compileImageRecognitionData(results);
		processSentiment(res, new_location, caption, tag_array);
	});
}
function processSentiment(res, new_location, caption, tag_array) {
	var data = {
		'text' : caption.trim().length > 0 ? caption : tag_array.join(" ")
	};
	
	haven_request(client, 'analyzesentiment', data, function(body) {
		var sentiment = body.actions[0].result.aggregate.sentiment;
		
		res.writeHead(200); 
		res.end(JSON.stringify({
			'tag_array' : tag_array,
			'sentiment' : sentiment
		}));
	});
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




var server = app.listen(process.env.PORT || 3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Pictrove started at http://%s:%s', host, port);
});