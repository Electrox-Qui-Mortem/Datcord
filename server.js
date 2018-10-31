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
    var opt = {
        database:'lexybase',
        collectionName:'evy-history'
    }
    var list = []
    MLab.listDocuments(opt)
        .then(res => {
            res.forEach((msg) => {
                list.push({
                    usr:msg.usr,
                    msg:msg.msg,
                    id:msg.id,
                    usrid:msg.usrid,
                    date:msg.date
                })
            })
            socket.emit('chat messages', list)
      
        })
    socket.on('disconnect', () => {
        pl.forEach(player => {
            if(player.socketid == socket.id){
                player.connected = false
                player.socketid = null
                io.emit('discon', player.id)
            }
        })
    })
    socket.on('con', id => {
        pl.forEach(player => {
            if(player.connected){
                socket.emit('con', {id:player.id, name:player.nm})
            }
        })
        if(pl.get(id)){ 
            pl.get(id).connected = true
            pl.get(id).socketid = socket.id
            io.emit('con', {id:id, name:pl.get(id).nm})
        }
    })
    socket.on('chat message', async (msg) => {
        msg.id = Math.round(Math.random() * 1000000000)
        msg._date = new Date()
        msg.date = msg._date.getTime()
        var bl = await getBlacklist()
        if(bl.find(element => element == msg.usrid)) return socket.emit('chat message', {usr:'SERVER', msg:'You\'re blacklisted.', date: new Date(), usrid:'000', id:3003030});
        io.emit('chat message', msg)
        var options = {
            database:'lexybase',
            collectionName:'evy-history',
            documents:msg
        }
        MLab.insertDocuments(options)
    })
    socket.on('delete', function(id){
        var options = {
            database:'lexybase',
            collectionName:'evy-history',
            query:`{id: ${id}}`
        }
        MLab.deleteDocuments(options)
            .then(res => {
                io.emit('delete', id)
            }, err => {
                console.log(err)
            })
        
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
