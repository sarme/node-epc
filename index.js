/// <reference path="typings/node/node.d.ts"/>
'use strict';

var TAG = 'main';

var log = require('npmlog-ts'),
	Q = require('q'),
	fs = require('fs'),
	path = require('path'),
	InvalidRFIDVal = require('./errors/InvalidRFIDVal');

log.heading = 'node-epc';
log.timestamp = true;
log.level = 'error'; // default logging level

// set logging level according to environment
if (process.env.NODE_ENV) {
	switch (process.env.NODE_ENV) {
		case 'test':
			log.level = 'silent';
			break;
		case 'development':
			log.level = 'verbose';
			break;
	}
}

// main
module.exports = {
	parse: function(val) {
		return Q.Promise(function(resolve, reject) {
			try {
				log.verbose(TAG, 'parse');

				var result = val.match(/[0-9a-fA-F]{24}/i);

				if (!result)
					throw new InvalidRFIDVal('"' + val + '" is an invalid value.  Expected 24 hexadecimal characters.');

				fs.readdir('parser', function(err, files) {

					var dirPromises = files.map(function(file) {
						return Q.Promise(function(dir_resolve, dir_reject) {
							try {
								if (file === 'abstract' || file === 'raw') {
									dir_resolve();
									return;
								}

								var filePath = path.join(__dirname, 'parser', file);

								fs.stat(filePath, function(err, stat) {
									if (stat.isDirectory())
										dir_resolve(filePath);
									else
										dir_resolve();
								});
							} catch (e) {
								log.error(TAG, e);

								dir_reject(e);
							}
						});
					});

					Q.all(dirPromises)
						.then(function(parsers) {
							var canParsePromises = parsers.map(function(parser) {
								return Q.Promise(function(parse_resolve, parse_reject) {
									try {
										if (!parser)
											parse_reject();

										var p = require(parser);

										p.canParse(val)
											.then(function(canparse) {
												if (canparse)
													p.parse()
													.then(function(parsed) {
														parse_resolve(parsed);
													});
												else
													parse_reject();
											});

									} catch (e) {
										log.error(TAG, e);

										parse_reject(e);
									}
								});

							});

							Q.any(canParsePromises)
								.then(function(parsed) {
									resolve(parsed);
								}, function() {
									var raw = require(path.join(__dirname, 'parser', 'raw'));

									raw.parse(val)
										.then(function(parsed) {
											resolve(parsed);
										})
										.fail(function(error) {
											reject(error);
										});
								});
						});
				});
			} catch (e) {
				log.error(TAG, e);

				reject(e);
			}
		});
	}
};