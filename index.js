// server.js
// where your node app starts

// init project
const express = require('express');
var http = require('http');
const app = express();
var server = http.Server(app);
var port = process.env.PORT || 5000;
var socketIO = require('socket.io');
var io = socketIO(server);
var fs = require('fs')
var rp = require('request-promise')
var Server = require('./server')
var opt = {
    uri:'https://message-api.glitch.me/server',
    method:'GET',
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json:true

}
rp(opt)
    .then(res => res.forEach(s => new Server(io, s.id)))

fs.readdir( './', function( err, files ) {
    if( err ) {
        console.error( "Could not list the directory.", err );
        process.exit( 1 );
    }
    
    files.forEach((file) => {
        if(file.startsWith('.node-xmlhttprequest')){
            fs.unlink(file, function (err) {
                if (err) throw err;
                // if no error, file has been deleted successfully
                console.log('File deleted!');
            }); 
        }
    })
})
var mlabInteractor = require('./mongolab-data-api.js')
var MLab = new mlabInteractor('Dj_EgiY8b-yLObrNAeln-AsCghwhVl_y')
var mLab = require('mongolab-data-api')('Dj_EgiY8b-yLObrNAeln-AsCghwhVl_y');
app.use(express.static('public'));
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
var getBlacklist = () => {
    var bl = []
    var opt = {
        database:'lexybase',
        collectionName:'blacklist'
    }
    return MLab.listDocuments(opt)
}
var pl = new Map()
var getPlayers = async () => {
    var opt = {
        database:'lexybase',
        collectionName:'user-list'
    }
    var players = await MLab.listDocuments(opt)
    players.forEach(player => {
        player.connected = false
        player.socketid = null
        pl.set(player.id, player)
    })
    return 
}
getPlayers()
io.on('connection', function(socket) {
    var toSend = []
    var opt = {
        uri:'https://message-api.glitch.me/server',
        method:'GET',
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json:true

    }
    rp(opt)
        .then(res => {
            res.forEach(s => toSend.push({name:s.name, id:s.id}))
            socket.emit('servers', toSend)
        })
    socket.on('chat message', async (msg) => {
        if(bl.find(element => element.id == msg.usrid)) return socket.emit('chat message', {usr:'SERVER', msg:'You\'re blacklisted.', date: new Date(), usrid:'000', id:3003030});
        
    })
    socket.on('log', console.log)
    
})
// listen for requests :)
server.listen(
    process.env.PORT,
    function() {
        console.log('Ayy, creator, your app is listening at port ' + server.address().port);
    }
)