"use strict";

var async = require('async'),
		Rackspace = require("../libs/Rackspace").Rackspace, 
		cdn = new Rackspace({username: 'garbandgander', apiKey: '62775a6d70b662b4dbfe90c032fcf9aa'}),
		fs = require('fs'),
		gm = require('gm'),
		imageMagick = gm.subClass({ imageMagick: true }),
		Forwarder = require("../libs/Forwarder").Forwarder;

/*
 * GET home page.
 */

var Pages = function( mongo ){
	var self = this;
}

exports.initPages = function( mongo ){
	return new Pages( mongo );
}

Pages.prototype.index = function(req, res){
	//console.log(__dirname+'/1209121548a.jpg');
	/*cdn.saveFile('test', '1209121548a.jpg', __dirname+'/1209121548a.jpg', function( err ){
	//cdn.remove('test', '1209121548a.jpg', function( err ){
		console.log( 'err', err );
		res.render('index', { title: 'Express' });
	})*/
	var forwarder = new Forwarder();

	cdn.getStream('test', '1209121548a.jpg',forwarder, function (err, file) { console.log('done')});

	/*var myFile = fs.createReadStream(__dirname+'/1209121548a.jpg');
	cdn.saveStream( 'test', '1209121548a_resized5.jpg', myFile, function (saveErr, imageInfo) {
		console.log(imageInfo);
     res.render('index', { title: 'Express' });
  });*/
	imageMagick(forwarder)
	.resize(600)
	.stream(function (err, stdout, stderr) {
		console.log(stdout);
		cdn.saveStream( 'test', 'wasula-and-son.jpg', stdout, function (saveErr, imageInfo) {
			console.log(imageInfo);
      res.render('index', { title: 'Express' });
    });
	});
};