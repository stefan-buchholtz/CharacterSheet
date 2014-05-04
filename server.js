#!/usr/bin/env node
var debug = require('debug')('server'),
	app = require('./app'),
	name = 'CharacterSheet';

app.set('port', process.env.PORT || 8000);

var server = app.listen(app.get('port'), function() {
  debug(name + ' server listening on port ' + server.address().port);
});
