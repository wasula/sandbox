var Stream = require('stream').Stream;

Forwarder.prototype = new Stream();

Forwarder.prototype.constructor = Forwarder;

function Forwarder() {
	this.writable = true;
	this.readable = true;
}

Forwarder.prototype.write = function (chunk, encoding) {
	this.emit("data", chunk);
}

Forwarder.prototype.end = function () {
	this.emit("end");
}

exports.Forwarder = Forwarder;