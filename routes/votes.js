'use strict';

const Boom = require('boom');
const Joi = require('joi');

exports.register = function(server, options, next) {
	const db = server.app.db;

	server.route({
		method: 'GET',
		path: '/api/votes',
		handler: function(request, reply) {
			db.votes.find((err, docs) => {
				if (err) {
					return reply(Boom.wrap(err, 'Internal MongoDB error'));
				}

				reply(docs);
			});
		}
	});

	server.route({
		method: 'POST',
		path: '/api/votes',
		config: {
			validate: {
				params: {
					first: Joi.number(),
					second: Joi.number(),
					type: Joi.string().valid(['before', 'after'])
				}
			}
		},
		handler: function(request, reply) {

			// votes on ids get handled here
			// three types:
			// 1. a -> b
			// 2. a <- a
			// 3. a = b
			// first={:id}&second={:id}&type={before, after, same}
			// TODO make sure only VALID ids are pushed on the
			var vote = {};

			vote.first = request.payload.first;
			vote.second = request.payload.second;
			vote.type = request.payload.type;
			vote.datetime = Date.now();

			db.votes.insert(
				vote,
				(err) => {
					if (err) {
						return reply(Boom.wrap(err, 'Internal MongoDB error'));
					} else {
						return reply();
					}
				}
			);
		}
	});

	return next();
};

exports.register.attributes = {
	name: 'routes-votes'
};