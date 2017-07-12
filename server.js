'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const mongojs = require('mongojs');
const Path = require('path');
const Mongoose = require('mongoose');

const server = new Hapi.Server();

const config = require('./config');

server.connection({
  host: config.server.host,
  port: config.server.port,
  routes: {
    files: {
      relativeTo: Path.join(__dirname, 'app')
    },
  }
});

// server.app.db = mongojs('learnflow-test', ['nodes', 'trees', 'votes']);

let db_uri = 'mongodb://' + config.database.host + '/' + config.database.db;

Mongoose.connect(db_uri, (err) => {
  console.log('db connection error');
});

server.app.db = Mongoose.connection;

server.register(require('hapi-auth-jwt'), (err) => {
  if (err) {
    throw err;
  }

  server.auth.strategy('jwt', 'jwt', {
    key: config.secret,
    verifyOptions: { algorithms: ['HS256'] }
  });
});

server.register([
  Inert,
  require('./api/routes/nodes'),
  require('./api/routes/votes'),
  require('./api/routes/trees'),
  require('./api/routes/auth')
], (err) => {
  if (err) {
    throw err;
  }
})

server.route({
  method: 'GET', 
  path: '/{param*}',
  handler: {
    directory: {
      // relative to app/
      path: '.',
      index: true
    },
  },
});

server.start((err) => {
  if(err) {
    throw err;
  }
  
  console.log("it's alive at", server.info.uri);
})
