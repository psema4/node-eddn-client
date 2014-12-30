/*  node-eddn-client
 *
 *  A simple node.js client for the EDDN service
 *
 *  Introduction
 *      This client subscribes to commodity messages published by EDDN-enabled
 *      tools. When commodity information is published for a particular
 *      station, the data is updated in simple MySQL table.
 *
 *      This client is not intended for production use; it is meant only as an
 *      example and proof-of-concept.
 *
 *  Synopsis
 *      Assumes bash and requires: git, node, npm & mysql
 *
 *      $ git clone https://github.com/psema4/node-eddn-client
 *      $ cd node-eddn-client
 *      $ npm install
 *      $ mysql -u ${DBADMIN} -p < setup.sql
 *      $ node app.js
 *
 *  License
 *      MIT (see LICENSE)
 *
 *  Issues
 *      Found a bug? Something else? Please enter an issue at
 *      https://github.com/psema4/node-eddn-client/issues
 *
 *  About EDDN
 *      The Elite: Dangerous Data Network is a volunteer-driven network for
 *      sharing data from the Elite: Dangerous universe.
 *
 *      EDDN is not run by or affiliated with Frontier Developments.
 *
 *  EDDN Extras
 *       Home       https://github.com/jamesremuscat/EDDN/wiki
 *       Discussion https://forums.frontier.co.uk/showthread.php?t=57986
 *
*/

var zmq   = require('zmq')
  , sock  = zmq.socket('sub')
  , zlib  = require('zlib')
  , mysql = require('mysql')
  , conn  = mysql.createConnection({
        host:     'localhost'
      , database: 'eddn'
      , user:     'eddner'
      , password: 'eddnpass'
    })
;

conn.connect();
console.log('database connected');

sock.connect('tcp://eddn-relay.elite-markets.net:9500');
sock.subscribe('');
console.log('waiting for updates...');

sock.on('message', function(message) {
    zlib.inflate(message, function(err, chunk) {
        var payload   = JSON.parse(chunk.toString('utf8'))
          , schemaRef = payload && payload.$schemaRef
          , header    = payload && payload.header
          , data      = payload && payload.message
        ;

        if (schemaRef !== 'http://schemas.elite-markets.net/eddn/commodity/1') {
            console.log('ignoring message with schema "%s"', schemaRef);
            return;
        }

        conn.query('INSERT INTO markets SET ?', strictify(data), function(err, result) {
            if (err) console.log('[db] %s', err.toString());
        });

        console.log('%s %s < %s "%s" STOCK: %s DEMAND: %s BUY: %s SELL: %s',
                data.timestamp, data.systemName,   data.stationName
              , data.itemName,  data.stationStock, data.demand
              , data.buyPrice,  data.sellPrice
        );
    });
});

// enforce the commodities schema
function strictify(obj) {
    obj = obj || {};

    //fixme: check properties, return a flag for malformed items
    //       (to log offending publishing tool and version)

    return {
        systemName:   obj.systemName   || '',
        stationName:  obj.stationName  || '',
        itemName:     obj.itemName     || '',
        buyPrice:     obj.buyPrice     || 0.0,
        stationStock: obj.stationStock || 0.0,
        sellPrice:    obj.sellPrice    || 0.0,
        demand:       obj.demand       || 0.0,
        timestamp:    obj.timestamp    || ''
    };
}
