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

Mongoose.connect('mongodb://' + config.database.host + '/' + config.database.db);

server.app.db = Mongoose.connecton;

server.app.db.on('error', () => { console.log('db connection error'); });
server.app.db.once('open', () => { console.log('db connected'); });

server.register([
    Inert,
  require('./api/routes/nodes'),
  require('./api/routes/votes'),
  require('./api/routes/trees')
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
