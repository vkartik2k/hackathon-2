const express = require("express")
const session = require("express-session")
const socketio = require('socket.io')
const passport = require('./passport')
const route = require('./routes')
const http = require('http')
const db = require('./database')
const crypto = require('crypto')
const app = express()

const server = http.createServer(app)
const io = socketio(server)

// Setting up View Engine as hbs
app.set('view engine','hbs')

// Required for all post requests
app.use(express.json())
app.use(express.urlencoded({extenstion:true}))

// Passport encryption and decryption and setting up session
app.use(session({
    secret: 'iloveabigstringwhichissecret'
}))
app.use(passport.initialize())
app.use(passport.session())

// General Routes for GET Requests

// Home page of website
app.use('', express.static(__dirname+'/public'))

//For login
app.get('/signin',function(req, res, next){
    res.redirect('/login')
})
app.use('/login', express.static(__dirname+'/login'))

//For signup
app.get('/register',function(req, res, next){
    res.redirect('/signup')
})
app.use('/signup', express.static(__dirname+'/login/signup.html'))

//Dashboard for logged in users
app.use('/dashboard',function(req,res,next){
    if(!req.user){
        res.redirect('/login')
    }
    else{
        next();
    }
})
app.use('/dashboard',express.static(__dirname+'/dashboard'))

// Admin
app.use('/admin',function(req,res,next){
    if(!req.user || req.user.type != 'admin'){
        res.send('<h2>Access Denied!</h2>')
    }
    else{
        next();
    }
})
app.use('/admin',express.static(__dirname+'/admin'))

//Goto all the route for request (Handle POST Requests)
app.use('/route',route)

// Socket Code Comes here
// Copy of socket is made and used for every connection seperatly.

function encrypt(text){
    var cipher = crypto.createCipher('aes-256-cbc','wu23x7po')
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex')
    return crypted
}

io.on('connection', function(socket){
    socket.emit('connected')
    socket.on('send_msg',function(data){
        db.groupchat.create({
            message : data.msg,
            username : data.username,
            time : data.time,
            date : data.date
        }).then((d) =>{
            io.emit('receive_msg',data)
        })
    })
})

//app starts at port 3000
server.listen(3000, function(){
    console.log("App running on http://localhost:3000")
})