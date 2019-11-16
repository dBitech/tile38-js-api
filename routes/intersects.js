const config = require('../config')
const Tile38 = require('tile38');
const Tile38client = new Tile38(config.tile38);

const GeoJSON = require('geojson');
const geojsonvt = require('geojson-vt')
const vtpbf = require('vt-pbf')

// route schema
const schema = {
  description: 'Return table as VT',
  tags: ['feature'],
  summary: 'return MVT protobuf',
  params: {
    table: {
      type: 'string',
      description: 'The name of key.'
    },
    z: {
      type: 'number',
      description: 'The Z (zoom)'
    },
    x: {
      type: 'number',
      description: 'The X coord'
    },
    y: {
      type: 'number',
      description: 'The X coord'
    }
  }
}

module.exports = function (fastify, opts, next) {
  fastify.route({
    method: 'GET',
    url: '/intersects/:table/:z/:x/:y',
    schema: schema,
    handler: function (request, reply) {
      console.error(request.params.table,"/"+request.params.z+"/"+request.params.x+"/"+request.params.y);
      let intersects = Tile38client.intersectsQuery(request.params.table).tile(request.params.x, request.params.y, request.params.z).limit(1000000);
      intersects.execute().then(results => {
//        console.dir(results.count,{depth:6});  // results is an object.
        if (results.count && results.count > 0)
        {
          const res = GeoJSON.parse(results.objects, {GeoJSON:'object'});
          const tileIndex = geojsonvt(res);
          const tile = tileIndex.getTile(request.params.z, request.params.x, request.params.y);
          const buffer = Buffer.from(vtpbf.fromGeojsonVt({ geojsonLayer: tile }));
          reply.type('application/protobuf').send(buffer);
        }
        else
        {
          reply.type('application/protobuf').send();
        }
      }).catch(err => {
        console.error("something went wrong! " + err);
      });
    }
  })
  next()
}

module.exports.autoPrefix = '/v1'
