const EventEmitter = require('events');

class Realtime extends EventEmitter {}

module.exports = new Realtime();
