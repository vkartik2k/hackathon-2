const route = require("express").Router()
const users = require('./database').user
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

function encrypt(text){
    var cipher = crypto.createCipher('aes-256-cbc','wu23x7po')
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex')
    return crypted
}

route.post('/login', function(req, res, next){
    users.findOne({
        where: {
            username: req.body.username
        }
    }).then((user) => {
        if (user.password !== encrypt(req.body.password)) {
            res.send(false)
        }
        let token = jwt.sign({
            username : user.username,
            password : user.password,
            email : user.email,
            phoneno : user.phoneno
        },
        "sadufdgdsewfcer", 
        {
            expiresIn :"1h"
        })
        res.send({
            message:"Login Successful",
            token : token
        })
    }).catch((err) => {
        res.send(false)
    })
})

// Verification for Authenticated user
route.post('/askbot', function(req, res, next){
    try{
        const decoded = jwt.verify(req.body.token, 'sadufdgdsewfcer')
        req.userData = decoded
        next()
    }
    catch(error){
        res.send({
            message : "Unauthenticated"
        })
    }
})

route.post('/askbot', function(req, res, next){
    var spawn = require("child_process").spawn
    var nameOfUser = "User"
    nameOfUser = req.userData.username
    var process = spawn('python',[
        "./chatBotInitialiser.py",
        req.body.query,
        nameOfUser
    ])
    process.stdout.on('data', function(data) {
        res.send({
            response : data.toString(),
            status : "success"
        })
    })
})

module.exports = route