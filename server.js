'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const mongojs = require('mongojs');
const Path = require('path');

const server = new Hapi.Server();

server.connection({
	host: 'localhost',
	port: 3000,
	routes: {
        files: {
            relativeTo: Path.join(__dirname, 'public')
        },
	}
});

server.app.db = mongojs('learnflow-test', ['nodes', 'trees', 'votes']);

server.register([
    Inert,
	require('./routes/nodes'),
	require('./routes/votes'),
	require('./routes/trees')
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
        	// relative to public/
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
