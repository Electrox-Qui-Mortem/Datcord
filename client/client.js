var socket = io();
console.log = text => {
    socket.emit('log', text)
}
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
var loginForm = document.getElementById('loginForm')
var signUpForm = document.getElementById('signUpForm')
var m = document.getElementById('messagebox')
var servs = document.getElementById('servers')
var messages = document.getElementById('messages')
var sign = document.getElementById('sign')
var log = document.getElementById('log')
var Week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
socket.emit('con', getCookie('userid'))
var rp = opt => {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest()
        xhr.open(opt.method || 'GET', opt.uri)
        
    })
}
var maskers = document.getElementsByClassName('mask')
for(var i = 0; i < maskers.length; i++){
    maskers[i].addEventListener('click', e => {
        var psw = document.getElementById(e.target.getAttribute('for'))
        if(psw.type == 'password'){
            psw.type="text";
            e.target.src="https://i.stack.imgur.com/waw4z.png";
        }else {
            psw.type = "password";
            e.target.src = "https://i.stack.imgur.com/Oyk1g.png";
        }
    })
}
if(sessionStorage.getItem('userToken')){
    document.getElementById('login').style.display = 'none'
    document.getElementById('loading').style.display = 'block'
    socket.emit('token', sessionStorage.getItem('userToken'))   
}
socket.on('signUpFailed', err => {
    document.getElementById('signuperr').textContent = err.message
})
socket.on('signUpSuccess', () => {
    alert('Sign Up Successful')
})
socket.on('loginFailed', () => {
    document.getElementById('loginerr').textContent = 'Incorrect Credentials'
})
socket.on('loginSuccess', token => {
    sessionStorage.setItem('userToken', token.token)
    sessionStorage.setItem('userName', token.username)
    sessionStorage.setItem('userId', token.id)
    document.getElementById('login').style.display = 'none'
    socket.emit('token', sessionStorage.getItem('userToken'))
})
loginForm.addEventListener('submit', e => {
    e.preventDefault()
    var body = {
        "usrnm":document.getElementById('usernameLogin').value,
        "psw":document.getElementById('passwordLogin').value
    }
    socket.emit('login', body)
})

document.getElementById('passwordSignUp').addEventListener('keyup', e => {
    // Validate lowercase letters
    var sup = document.getElementById('passwordSignUp')
    var letter = document.getElementById('lowercaseval')
    var capital = document.getElementById('uppercaseval')
    var number = document.getElementById('numval')
    var lowerCaseLetters = /[a-z]/g;
    if(sup.value.match(lowerCaseLetters)) {  
      letter.classList.remove("invalid");
      letter.classList.add("valid");
    } else {
      letter.classList.remove("valid");
      letter.classList.add("invalid");
    }

    // Validate capital letters
    var upperCaseLetters = /[A-Z]/g;
    if(sup.value.match(upperCaseLetters)) {  
      capital.classList.remove("invalid");
      capital.classList.add("valid");
    } else {
      capital.classList.remove("valid");
      capital.classList.add("invalid");
    }

    // Validate numbers
    var numbers = /[0-9]/g;
    if(sup.value.match(numbers)) {  
      number.classList.remove("invalid");
      number.classList.add("valid");
    } else {
      number.classList.remove("valid");
      number.classList.add("invalid");
    }
    if(!sup.value.match(numbers) || !sup.value.match(upperCaseLetters) || !sup.value.match(lowerCaseLetters)) document.getElementById('submitSignUp').disabled = true
    // Validate length
    if(sup.value.length >= 8) {
      length.classList.remove("invalid");
      length.classList.add("valid");
    } else {
      length.classList.remove("valid");
      length.classList.add("invalid");
    }

})

document.getElementById('passwordSignUp').addEventListener('change', e => {
    // Validate lowercase letters
    var sup = document.getElementById('passwordSignUp')
    var letter = document.getElementById('lowercaseval')
    var capital = document.getElementById('uppercaseval')
    var number = document.getElementById('numval')
    var lowerCaseLetters = /[a-z]/g;
    if(sup.value.match(lowerCaseLetters)) {  
      letter.classList.remove("invalid");
      letter.classList.add("valid");
    } else {
      letter.classList.remove("valid");
      letter.classList.add("invalid");
    }
    
    // Validate capital letters
    var upperCaseLetters = /[A-Z]/g;
    if(sup.value.match(upperCaseLetters)) {  
      capital.classList.remove("invalid");
      capital.classList.add("valid");
    } else {
      capital.classList.remove("valid");
      capital.classList.add("invalid");
    }

    // Validate numbers
    var numbers = /[0-9]/g;
    if(sup.value.match(numbers)) {  
      number.classList.remove("invalid");
      number.classList.add("valid");
    } else {
      number.classList.remove("valid");
      number.classList.add("invalid");
    }

    // Validate length
    if(sup.value.length >= 8) {
      length.classList.remove("invalid");
      length.classList.add("valid");
    } else {
      length.classList.remove("valid");
      length.classList.add("invalid");
    }
})
document.getElementById('emailSignUp').addEventListener('keyup', e => {
    // Validate lowercase letters
    var sue = document.getElementById('emailSignUp')
    var email = /^\w.+@\w{2,253}\.\w{2,63}$/;
    if(sue.value.match(email)) {  
        document.getElementById('emailerr').style.display = 'none'
        document.getElementById('submitSignUp').disabled = false
    } else if(sue.value.length == 0){
        document.getElementById('emailerr').style.display = 'none'
        document.getElementById('submitSignUp').disabled = true
    } else {
        document.getElementById('emailerr').style.display = 'block'
        document.getElementById('submitSignUp').disabled = true
    }
    
})
signUpForm.addEventListener('submit', e => {
    e.preventDefault()
    var body = {
        "usrnm":document.getElementById('usernameSignUp').value,
        "psw":document.getElementById('passwordSignUp').value,
        "eml":document.getElementById('emailSignUp').value
    }
    socket.emit('signUp', body)
    
})
sign.addEventListener('click', e => {
    document.getElementById('login').style.display = 'none'
    document.getElementById('signUp').style.display = 'block'
})
log.addEventListener('click', e => {
    document.getElementById('signUp').style.display = 'none'
    document.getElementById('login').style.display = 'block'
})
chatForm.addEventListener('submit', function(e){
    e.preventDefault()
    socket.emit('chatMessage', {usr:sessionStorage.getItem('userName'), msg: m.value, usrid:sessionStorage.getItem('userId')});
    m.value = ''
});
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
        if(this.userid == sessionStorage.getItem('userId')){
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
    document.getElementById('loading').style.display = 'none'
    document.getElementById('chat').style.display = 'block'
    while(messages.firstChild) messages.removeChild(messages.firstChild)
    console.log('caught')
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
            document.getElementById('loading').style.display = 'block'
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
    socket.on('deleteMessage', deleteMessage);
    document.getElementById('chat').style.display = 'block'
})
setInterval(() => {socket.emit('con', getCookie('userid'))}, 1/100000)