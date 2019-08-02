const route = require("express").Router()
const db = require('./database')
const passport = require("./passport.js")
const user = db.user
const settings = db.settings
const numusers = db.numusers
const quickfeedback = db.quickfeedback
const Op = require("sequelize").Op
const crypto = require('crypto')

function encrypt(text){
    var cipher = crypto.createCipher('aes-256-cbc','wu23x7po')
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex')
    return crypted
}

route.post('/getUsername', function(req,res){
    db.user.findAll({
        where : {
            username : req.user.username
        }
    }).then(function(data) {
        data.forEach(function(d){
            res.send(d)
        })
    })
    
})

// All POST requests come here
route.post("/signup", function (req, res, next) {
    user.create({
        username:req.body.username,
        phoneno:req.body.phoneno,
        name:req.body.name,
        email:req.body.email,
        password: encrypt(req.body.password),
        type: 'user',
        isfeedbackmarked : 'false',
        readMsg : 0
    }).then((user) => {
        res.send(true)
    }).catch((err) => {
        res.send(false)
    })
})

route.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return res.send(false) }
      if (!user) { return res.send(false) }
      req.logIn(user, function(err) {
        if (err) { return res.send(false) }
        return res.send(user)
      })
    })(req, res, next)
})

route.post('/logout', function(req, res, next) {
    req.logout()
    res.send(true)
})

route.post('/getSettings', function(req, res, next){
    settings.findAll(
    ).then(function(setting) {
        let obj = {}
        setting.forEach(function (data) {
             obj[data.property] = data.value
        })
        res.send(obj)
    })
})

route.post('/setSettings1', function(req, res, next){
    settings.update(
        { value : req.body.companyname},
        { where : { property : "companyname"}}
    )
    settings.update(
        { value : req.body.supportemail},
        { where : { property : "supportemail"}}
    )
    settings.update(
        { value : req.body.supportphoneno},
        { where : { property : "supportphoneno"}}
    )
    settings.update(
        { value : req.body.infoemail},
        { where : { property : "infoemail"}}
    )
    res.send(true)
})

route.post('/setSettings2', function(req, res, next){
    settings.update(
        { value : req.body.chatbotsupport},
        { where : { property : "chatbotsupport"}}
    )
    settings.update(
        { value : req.body.audioeffects},
        { where : { property : "audioeffects"}}
    )
    settings.update(
        { value : req.body.askforfeedback},
        { where : { property : "askforfeedback"}}
    )
    res.send(true)
})

route.post('/getNumUsers/', function(req, res, next){
    numusers.findAll(
    ).then(function(numuser) {
        let obj = {}
        numuser.forEach(function (data) {
             obj[data.month] = data.value
        })
        res.send(obj)
    })
})

route.post('/getQuickFeedback', function(req, res, next){
    quickfeedback.findAll(
    ).then(function(emotion) {
        let obj = {}
        emotion.forEach(function (data) {
             obj[data.emotion] = data.value
        })
        res.send(obj)
    })
})

route.post('/getTableNames', function(req, res, next){
    var obj = {
        arr : []
    }
    for(var k in db) obj.arr.push(k);
    res.send(obj)
})

route.post('/getTableData', function(req, res, next){
    eval("db."+req.body.tableName).findAll(
    ).then(function(data) {
        res.send(data)
    })
})

route.post('/addTableData', function(req, res, next){
    if(req.body.attr.password){
        req.body.attr.password = encrypt(req.body.attr.password)
    }
    eval("db."+req.body.tableName).create(
        req.body.attr
    ).then((user) => {
        res.send(true)
    }).catch((err) => {
        res.send(false)
    })
})

route.post('/deleteTableData', function(req, res, next){
    eval("db."+req.body.tableName).destroy({
        where: {
            id : req.body.id
        }
    }).then(function(){
        res.send(true)
    })
})

route.post('/sendMail', function(req, res, next){
    db.emails.create({
        subject : req.body.subject,
        body : req.body.mainBody,
        users : req.body.usernames,
        tag : req.body.tag
    }).then((user) => {
        res.send(true)
    }).catch((err) => {
        res.send(false)
    })
})

route.post('/getMail', function(req, res, next){
    db.emails.findAll(
    ).then(function(allData) {
        res.send(allData)
    })
})

route.post('/askFeedbackAnalysis', function(req, res){
    var spawn = require("child_process").spawn
    var process = spawn('python',[
        "./feedbackAnalysisInitialiser.py"
    ])
    process.stdout.on('data', function(data) {
        res.send(data.toString())
    })
})

route.post('/addFeedback', function(req, res){
    if(req.user.isfeedbackmarked === 'false'){
        db.feedback.create({
            rating : req.body.rating,
            feedbackdata : req.body.feedbackdata,
            username : req.body.isAnonymous === 'true' ? 'anonymous' : req.user.username
        }).then(() => {
            db.user.update(
                {isfeedbackmarked :'true'},
                {where : {
                    username : req.user.username
                }}
            )
            res.send(true)
        }).catch(() => {
            res.send(false)
        })
    }
    else {
        res.send(false)
    }
})

route.post('/changePassword', function(req, res){
    if(encrypt(req.body.oldPassword)=== req.user.password){
        if(req.user != null ){
            db.user.update( { password: encrypt(req.body.password)},
            { where: { 
                username : req.user.username
            } })
            .then(function(ans){
                res.send(true)
            })
        }
        else{
            res.send(false);
        }
    }
    else{
        res.send(false);
    }
})

// GROUP CHAT

route.post('/noOfChats', function(req, res, next){
    db.groupchat.count({}
    ).then((i)=>{
        res.send({count : i})
    })
})

route.post('/getNextChat', function(req, res, next){
    db.groupchat.findAll({
        where : {
            id: {
                [Op.between]: [req.body.lastCount-19, req.body.lastCount]
            }
        }
    }).then(function(d) {
        let obj = {}
        let i =0;
        d.forEach(function (data) {
            obj[i] = data
            i++;
        })
        res.send(obj)
    })
})

route.post('/getUnreadChats', function(req, res, next){
    db.groupchat.findAll({
        where : {
            id: {
                [Op.between]: [req.body.lastCount-req.body.unreadChats+1, req.body.lastCount]
            }
        }
    }).then(function(d) {
        let obj = {}
        let i =0;
        d.forEach(function (data) {
            obj[i] = data
            i++;
        })
        res.send(obj)
    })
})

route.post('/updateReadChats', function(req, res){
    db.user.update(
        {readMsg : req.body.readMsg},
        {where : {
            username : req.user.username
        }}
    )
    res.send(true)
})
// CHATBOT POST REQUEST

route.post('/showChatBot', function(req, res, next){
    settings.findAll({where: {
        property : "chatbotsupport"
    }}).then(function(setting) {
        setting.forEach(function (data) {
            if(data.value== "true"){res.send(true)}
            else{res.send(false)}
        })
    })
})

route.post('/askChatBot', function(req, res){
    // Importing Node's 'child_process' module to spin up a child process. 
    // There are other ways to create a child process but we'll use the 
    // simple spawn function here.
    var spawn = require("child_process").spawn
    // The spawned python process which takes 2 arguments, the name of the 
    // python script to invoke and the query parameter text
    var nameOfUser = "User"
    if(req.user) nameOfUser = req.user.name
    var process = spawn('python',[
        "./chatBotInitialiser.py",
        req.body.query,
        nameOfUser
    ])
    // Listen for data output from stdout, in this case, from "chatBotInitailiser.py"
    process.stdout.on('data', function(data) {
        // Sends the output from "chatBotInitailiser.py" back to the user
        res.send(data.toString())
    })
})

module.exports = route