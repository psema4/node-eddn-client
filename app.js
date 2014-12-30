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
        var payload   = JSON.parse(chunk.toString('utf8'))
          , schemaRef = payload.$schemaRef
          , header    = payload.header
          , data      = payload.message
        ;

        // ignore non-commodity data
        if (schemaRef !== 'http://schemas.elite-markets.net/eddn/commodity/1') return;

        //fixme: escape data
        conn.query('INSERT INTO markets SET ?', strictify(data), function(err, result) {
            if (err) console.log('[db] %s', err.toString());
        });

        console.log('%s %s < %s "%s" STOCK: %s DEMAND: %s BUY: %s SELL: %s',
                data.timestamp, data.systemName, data.stationName
              , data.itemName, data.stationStock, data.demand
              , data.buyPrice, data.sellPrice
        );
    });
});

// Adhere to schema, per https://forums.frontier.co.uk/showthread.php?t=57986&p=1393865&viewfull=1#post1393865
function strictify(obj) {
    return {
        systemName: obj.systemName      || '',
        stationName: obj.stationName    || '',
        itemName: obj.itemName          || '',
        buyPrice: obj.buyPrice          || 0.0,
        stationStock: obj.stationStock  || 0.0,
        sellPrice: obj.sellPrice        || 0.0,
        demand: obj.demand              || 0.0,
        timestamp: obj.timestamp        || ''
    };
}
