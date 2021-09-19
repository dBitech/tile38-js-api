'use strict'
const config = require('../config');
const Tile38 = require('tile38');
const Tile38client = new Tile38(config.tile38);

// route schema
const schema = {
  description: 'return objects that fall within the channel',
  tags: ['feature'],
  summary: 'return a list of Tile38 keys within the channel',
  params: {
    id: {
      type: 'string',
      descripton: 'the name of the chan'
    }
  },
  required : ['id']
};

module.exports = function (fastify, opts, next) {
  fastify.route({
    method: 'GET',
    url: '/fence/:id',
    schema: schema,
    handler: function (req, reply) {
      const data = Tile38client.sendCommand('SUBSCRIBE', 'subscribe', req.params.id);
      reply.send(data);
    },
    wsHandler: function (con, req) {
      conn.setEncoding('utf8');
      conn.write('hello client');
      conn.once('data', chunk => {
        conn.end();
      });
    }
  });
  next();
};

module.exports.autoPrefix = '/v1';
