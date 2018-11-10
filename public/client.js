var socket = io();

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
if(!getCookie('userid')) setCookie('userid', Math.round(Math.random() * 1000))
var nme = document.getElementById("enterForm");
var star = document.getElementById("start");
var form = document.getElementById("form");
var canvas = document.getElementById('canvas');
var m = document.getElementById('m');
var clog = document.getElementById('changelog')
var ut = document.createElement('h3')
var chat = document.getElementById('chat')
var chatForm = document.getElementById('chatForm')
var m = document.getElementById('messagebox')
var servs = document.getElementById('servers')
var messages = document.getElementById('messages')
var Week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
socket.emit('con', getCookie('userid'))
nme.addEventListener('submit', function(e) {
    e.preventDefault();
    //Either sets username equal to the input or defaults to quasar.io
    window.usr = document.getElementById("nameyourself").value || 'anon'
    star.style.display = "none"
    chat.style.display = "block"
    m.focus()
});
chatForm.addEventListener('submit', function(e){
    e.preventDefault()
    socket.emit('chatMessage', {usr:window.usr, msg: m.value, usrid:getCookie('userid')});
    m.value = ''
});
console.log = text => {
    socket.emit('log', text)
}
class Message {
    constructor(msg){
        this.usr = msg.usr
        this.date = new Date(msg.date)
        this.id = msg.id
        this.message = msg.msg
        this.userid = msg.usrid
    }
    getMessageElement(){
        var getMsg = document.createElement('p')
        getMsg.innerHTML = `${this.usr}: ${this.message}`
        if(new Date().getTime() - this.date.getTime() < 604800000){
            if(this.date.getMinutes() < 10) var min =  '0' + this.date.getMinutes()
            else var min = this.date.getMinutes()
            if(this.date.getHours() > 12) getMsg.innerHTML += ` - At ${this.date.getHours() - 12}:${min} PM`
            else getMsg.innerHTML += ` - At ${this.date.getHours()}:${min}`
        }else {
            getMsg.innerHTML += ` - On ${Week[this.date.getDay()]}`
        }
        getMsg.id = this.id

        var deleteButton = document.createElement('button')
        deleteButton.textContent = 'Delete'
        deleteButton.classList.add('deleteButton')
        deleteButton.addEventListener('click', e => {
            e.preventDefault()
            socket.emit('deleteMessage', this.id)
        })
        if(this.userid == getCookie('userid')){
            getMsg.appendChild(deleteButton)
        }
        return getMsg
    }
}
var addMessage = msg => {
    var msg = new Message(msg)
    messages.appendChild(msg.getMessageElement())
    messages.scrollTop = messages.scrollHeight
}
var addMessages = msgs => {
    while(messages.firstChild) messages.removeChild(messages.firstChild)
    msgs.forEach((msg)=>{
        var msg = new Message(msg)
        messages.appendChild(msg.getMessageElement())
    })
    messages.scrollTop = messages.scrollHeight
}
var deleteMessage = id => {
    var toDel = document.getElementById(id)
    toDel.remove()
}
socket.on('servers', servers => {
    socket = io('/' + servers[0].id.toString())
    servers.forEach(server => {
        var scontain = document.createElement('div')
        scontain.id = server.id.toString()
        scontain.classList.add('serverIconContainer')
        
        scontain.addEventListener('click', () => {
            socket.removeListener('chatMessage', addMessage);
            socket.removeListener('chatMessages', addMessages);
            socket.removeListener('deleteMessage', deleteMessage);
            socket = io('/' + server.id)
            socket.on('chatMessage', addMessage);
            socket.on('chatMessages', addMessages);
            socket.on('deleteMessage', deleteMessage)
        })
        var sicon = document.createElement('span')
        sicon.classList.add('serverIcon')
        sicon.innerHTML = server.name
        scontain.appendChild(sicon)
        servs.appendChild(scontain)
        
    })
    socket.on('chatMessage', addMessage);
    socket.on('chatMessages', addMessages);
    socket.on('deleteMessage', deleteMessage)

})
setInterval(() => {socket.emit('con', getCookie('userid'))}, 1/100000)