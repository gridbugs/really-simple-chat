var app = require('http').createServer(handler)
  , io = require('socket.io').listen(app)
  , fs = require('fs')

app.listen(8001);

var channels = [];

function handler (req, res) {

    console.log(req.url);
    var matches = req.url.match(/^\/ch\/(.*)/);
    if (matches === null) {
        console.log("not channel");
    } else {
        var channel = matches[1];
        if (channels[channel] === undefined) {
            channels[channel] = [];
            console.log("creating");
        }
        console.log(channel);


    }

  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}


io.sockets.on('connection', function(client) {
    client.on('hello', function(channel) {
        if (channels[channel] === undefined) {
            return;
        }
        console.log('new user on ', channel);
        channels[channel].push(client);

        client.on('msg', function(channel, msg) {
            console.log('received ', msg, ' on ', channel);
            for(i in channels[channel]) {
                channels[channel][i].emit('msg', msg);
            }
        });
    });


    client.on('disconnect', function() {
        console.log('disconnected');
        

    });


});
