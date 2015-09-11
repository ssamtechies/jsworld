var express = require('express');
var app = express();
var util = require('util');
var formidable = require('formidable');
var fs = require('fs');

var server = app.listen(8888 , function(){
   console.log("Server started at port " + server.address().port);
});

app.use(express.static(__dirname + '/public')); 
app.post('/upload',function(request,response){
	
	var allfiles = [];
	var newfiles = [];
	var form = formidable.IncomingForm();
    var uploadDir = __dirname + "/uploads2";
	form.uploadDir = uploadDir;
	form.keepExtensions = true;
	form.multiples = true;
	form.on ('error',function(){
		throw error;
	});
	form.on('field', function(field,value){
	});
	
	form.on('fileBegin' , function(name,file){
		console.log("Started file upload !!\n name : " + name + " file :" + JSON.stringify(file) );
		
		var newFilepath = uploadDir + "\\" + file.name ;
		
		allfiles.push(file.path);
		newfiles.push(newFilepath);
		
	});
	form.on('file', function(field,file){
	    
		console.log("Received File");
	});
	form.on('progress', function(bytesReceived, bytesExpected){
		var percent = bytesReceived/bytesExpected * 100 | 0;
	//	process.stdout.write("Uploading %"  + percent + "\r");
	});
	form.on('end',function(){
	    for (var i = 0; i <allfiles.length ; i++)  {
	      fs.rename(allfiles[i] , newfiles[i], function(err){
		   if (err) {
		      console.log('Error in renaming!!' + err.message);
		   }
		});
		  console.log(newfiles[i] + " Uploaded!!");
		}
		console.log("Total " + allfiles.length + " files uploaded.");
		response.writeHead(200,{'Content-type' : 'text/plain'});
		response.write('Received upload !!\n');
		response.end();
		
	});
	form.parse(request);
	
	return;
});

app.get('*',function(request,response){
	response.sendFile('/public/index.html' ,{root : __dirname + '/'});
});
