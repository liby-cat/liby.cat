const loopback = require('loopback');
const boot = require('loopback-boot');
const lcStrongErrorHandler = require('strong-error-handler');
const lcServeFavicon = require('serve-favicon');
const lcLoopbackConnectorMongodb = require('loopback-connector-mongodb');
const lcLoopbackComponentExplorer = require('loopback-component-explorer');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;
  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});

// PRETTY URL
// https://www.theodo.fr/blog/2017/01/pretty-url-in-angularjs-and-loopback-drop-the/
// http://www.theodo.fr/blog/2017/01/pretty-url-in-angularjs-and-loopback-drop-the/
const path = require('path');

//List here the paths you do not want to be redirected to the angular application (scripts, stylesheets, templates, loopback REST API, ...)
const ignoredPaths = ['/css', '/js','/lb', '/vendor', '/views', '/api','/res'];

app.all('/*', function(req, res, next) {
  //Redirecting to index only the requests that do not start with ignored paths
  if(!startsWith(req.url, ignoredPaths))
    res.sendFile('index.html', { root: path.resolve(__dirname, '..', 'client') });
  else
    next();
});

function startsWith(string, array) {
  for(i = 0; i < array.length; i++)
    if(string.startsWith(array[i]))
      return true;
  return false;
}
