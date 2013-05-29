
var cloudfiles = require('pkgcloud'),
    fs = require('fs')
    async = require('async');
var _config, _self;

//
var Rackspace = exports.Rackspace = function( spec ) {
  _config = {
    provider: spec.service || 'rackspace', // 'cloudservers'
    username: spec.username,
    apiKey: spec.apiKey
  };

  _self = this;
  init(function(){ console.log(_config.provider+' authorized'); });
};

var init = function (next) {
  console.log('_self.expired()', _self.expired());
  if (_self.expired()) {
    console.log('Initializing');
    _self.client = cloudfiles.storage.createClient( _config );

    _self.client.auth( function (err) {
      if( err ) { return next( err ); }

      _self.expiry = new Date().getTime() + 60*60*1000; //23*60*60*1000; 
      next();
    })  
  } else {
    next();
  }
}

Rackspace.prototype.expired = function () {
  return ( !_self.expiry || (_self.expiry < new Date().getTime()));
}

//
Rackspace.prototype.saveFile = function( container, fileName, path, callback ) {
  init( function (err) {
    if( err ) { 
      return callback( err ); 
    }
    _self.client.upload( {container:container, remote:fileName, local:path}, callback );
  })
};

//
Rackspace.prototype.saveStream = function( container, fileName, stream, callback ) {
  console.log('saveStream');
  init( function ( err ) {
    if( err ) { 
      console.log('Error in saveStream', err);
      return callback( err ); 
    }
    _self.client.upload( {container:container, remote:fileName, stream:stream, headers: {}}, callback );
  });
};

//
Rackspace.prototype.get = function( container, fileName, local, callback ) {
  init( function ( err ) {
    if( err ) { return callback( err ); }
    _self.client.download( {container:container, remote:fileName, local:local}, callback );
  });
};

//
Rackspace.prototype.getStream = function( container, fileName, stream, callback ) {
  init( function ( err ) {
    if( err ) { console.log("getStream error "+err); return callback( err ); }
    _self.client.download( {container:container, remote:fileName, stream:stream}, callback );
  });
};

// Remove a number of files from the CDN.
// Can also take a sing file name.
// If no files provided, remove the whole
Rackspace.prototype.remove = function( container, files, callback ) {
  var self = this;
  init( function( err ) {
    if( err ) { return callback( err ); }

    if (!(files instanceof Array)) files = [files];

    function destroyFile (file, next) {
      self.client.removeFile(container, file, next)
    }

    async.each(files, destroyFile, callback);
  });
};

//
/*Rackspace.prototype.getFiles = function( containerName, imageName, callback ) {
  init( function ( err ) {
    if( err ) { return callback( err ); }
    _self.client.getFiles( containerName, imageName, callback );
  });
};

//
Rackspace.prototype.getContainerFiles = function( containerName, callback ) {
  init( function ( err ) {
    if( err ) { return callback( err ); }
    _self.client.getFiles( containerName, callback );
  });
};

//
Rackspace.prototype.getContainers = function( isCDN, callback ) {
  init( function ( err ) {
    if( err ) { return callback( err ); }

    if ("function" === typeof (isCDN)) {
      callback = isCDN;
      isCDN = null;
    }
    _self.client.getContainers( isCDN, callback );
  });
};
*/