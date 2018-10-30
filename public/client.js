var socket = io();
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
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
var messages = document.getElementById('messages')
var Week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
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
    socket.emit('chat message', {usr:window.usr, msg: m.value, usrid:getCookie('userid')});
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
        var getMsg = document.createElement('li')
        getMsg.innerHTML = `${this.usr}: ${this.message}`
        if(new Date().getTime() - this.date.getTime() < 604800000){
            if(this.date.getHours() > 12) getMsg.innerHTML += ` - At ${this.date.getHours() - 12}:${this.date.getMinutes()} PM`
            else getMsg.innerHTML += ` - At ${this.date.getHours()}:${this.date.getMinutes()}`
        }else {
            getMsg.innerHTML += `- On ${Week[this.date.getDay()]}`
        }
        getMsg.id = this.id
        window.scrollTo(0, document.body.scrollHeight);
        var deleteButton = document.createElement('button')
        deleteButton.textContent = 'Delete'
        deleteButton.classList.add('deleteButton')
        deleteButton.addEventListener('click', e => {
            e.preventDefault()
            socket.emit('delete', this.id)
        })
        if(this.userid == getCookie('userid')){
            getMsg.appendChild(deleteButton)
        }
        return getMsg
    }
}
socket.on('chat message', function(msg){
    var msg = new Message(msg)
    messages.appendChild(msg.getMessageElement())
});
socket.on('chat messages', function(msgs){
    msgs.forEach((msg)=>{
        var msg = new Message(msg)
        messages.appendChild(msg.getMessageElement())
    })
});
socket.on('spam', () => {
    var newMsg = document.createElement('li')
    newMsg.textContent = `SERVER: Stop Spamming or die`
    messages.appendChild(newMsg)
    window.scrollTo(0, document.body.scrollHeight);
});
socket.on('delete', id => {
    var toDel = document.getElementById(id)
    toDel.remove()
})