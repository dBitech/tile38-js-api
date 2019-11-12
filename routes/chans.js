const config = require('../config')
const Tile38 = require('tile38');
const Tile38client = new Tile38(config.tile38);

// route schema
const schema = {
  description: 'Return list of object collections',
  tags: ['feature'],
  summary: 'return a list of Tile38 object collections'
}

module.exports = function (fastify, opts, next) {
  fastify.route({
    method: 'GET',
    url: '/chans',
    schema: schema,
    handler: function (request, reply) {
      let chans = Tile38client.sendCommand('CHANS', 'chans', '*');
      chans.then(results => {
        console.dir(results);
        reply.type('application/json').send(results);
      }).catch(err => {
        console.error("something went wrong! " + err);
      });
/*
      chans.then(results => {
        console.dir(results.count,{depth:6});  // results is an object.
        reply.type('application/json').send(results);
      }).catch(err => {
        console.error("something went wrong! " + err);
      });
*/
    }
  })
  next()
}

module.exports.autoPrefix = '/v1'
