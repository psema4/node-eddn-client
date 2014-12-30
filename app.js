var zmq     = require('zmq')
  , zlib    = require('zlib')
  , sock    = zmq.socket('sub')
  , mysql   = require('mysql')
  , conn    = mysql.createConnection({
                 host: 'localhost'
                , database: 'eddn'
                , user: 'eddner'
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
        var payload = JSON.parse(chunk.toString('utf8'))
          , header  = payload.header
          , data    = payload.message
        ;

        //fixme: escape data
        conn.query('INSERT INTO markets SET ?', data, function(err, result) {
            if (err) console.log('[db] %s', err.toString());
        });

        console.log('%s %s < %s "%s" STOCK: %s DEMAND: %s BUY: %s SELL: %s',
                data.timestamp, data.systemName, data.stationName
              , data.itemName, data.stationStock, data.demand
              , data.buyPrice, data.sellPrice
        );
    });
});
