const User = require('./user.js')
const rp = require('request-promise')
global.Servers = new Map()
module.exports = class Server {
    constructor(io, ns = undefined){
        if(!ns){
            var ns = Math.floor(Math.random() * 10000000000)
            this.ns = ns.toString()
            while(this.ns.length < 10) this.ns = '0' + this.ns
            var opt = {
                uri:'https://message-api.glitch.me/server',
                body:{
                    serv:this.ns
                },
                method:'POST',
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json:true

            }
            rp(opt)
            this.nsp = io.of('/' + this.ns)
        } else { 
            this.ns = ns.toString()
            this.nsp = io.of('/' + this.ns)
        }
        Servers.set(this.ns, this)
        this.nsp.on('connection', socket => {
            var opt = {
                uri:`https://message-api.glitch.me/server/${this.ns}`,
                headers: {
                    'User-Agent': 'Request-Promise'
                },
                json:true

            }
            var list = []
            rp(opt)
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
                    socket.emit('chatMessages', list)
                }, console.error)
            socket.on('chatMessage',msg => {
                msg.id = Math.round(Math.random() * 1000000000)
                msg.date = new Date().getTime()
                this.nsp.emit('chatMessage', msg)
                var opt = {
                    uri:`https://message-api.glitch.me/server/${this.ns}`,
                    body:msg,
                    method:'POST',
                    headers: {
                        'User-Agent': 'Request-Promise'
                    },
                    json:true
                }
                rp(opt)
            })
            socket.on('deleteMessage', id => {
                var opt = {
                    uri:`https://message-api.glitch.me/server/${this.ns}/${id}`,
                    method:"DELETE",
                    headers: {
                        'User-Agent': 'Request-Promise'
                    },
                    json:true
                }
                rp(opt)
                    .then(res => this.nsp.emit('deleteMessage', id))
            })
            socket.on('log', console.log)
        })
    }
}