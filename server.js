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
var mLab = require('mongolab-data-api')('Dj_EgiY8b-yLObrNAeln-AsCghwhVl_y');
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
var recentlySent = new Map()
var timers = new Map()
io.on('connection', function(socket) {
    var opt = {
        database:'lexybase',
        collectionName:'evy-history'
    }
    var list = []
    mLab.listDocuments(opt, (err, msgs) => {
        msgs.forEach((msg) => {
            list.push({
                usr:msg.usr,
                msg:msg.msg,
                id:msg.id,
                usrid:msg.usrid,
                date:msg.date
            })
        })
    })
    socket.emit('chat messages', list)
    socket.on('chat message', (msg) => {
        msg.id = Math.round(Math.random() * 1000000000)
        msg._date = new Date()
        msg.date = msg._date.getTime() -604800000
        io.emit('chat message', msg)
        var options = {
            database:'lexybase',
            collectionName:'evy-history',
            documents:msg
        }
        var usr =  recentlySent.get(msg.usr)
        mLab.insertDocuments(options, () => {})
    })
    socket.on('delete', function(id){
        io.emit('delete', id)
        var options = {
            database:'lexybase',
            collectionName:'evy-history',
            query:`{id: ${id}}`
        }
        mLab.deleteDocuments(options, () => {})
    })
    socket.on('log', console.log)
})
// listen for requests :)
server.listen(
    process.env.PORT,
    function() {
        console.error('Ayy, creator, I\'m listening at port ' + server.address().port);
    }
)
