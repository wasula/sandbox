
/**
 * Module dependencies.
 */

var express = require('express')
  , user = require('./routes/user')
  , http = require('http')
  , cons = require('consolidate')
  , fs = require( 'fs' )
  , path = require('path');

var app = express();


// all environments

require('dustjs-helpers');
app.engine('dust', cons.dust);

var conf = (fs.existsSync( './dev_conf.js' ) && require('./dev_conf').conf) || 
    { "port":(process.env.PORT || 8008), "base":"" };

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');
app.set('view options', { pretty: true });
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('MyAwesomeSecret'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var routes = {};
routes.index = new require("./routes/index").initPages({});

app.get('/', routes.index.index);
app.get('/users', user.list);

http.createServer(app).listen(conf.port);
console.log('Express server listening on port ' + conf.port);
