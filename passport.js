const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const users = require('./database.js').user
const crypto = require('crypto')

function encrypt(text){
    var cipher = crypto.createCipher('aes-256-cbc','wu23x7po')
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

passport.serializeUser(function(user, done){
    done(null, user.username)
})

passport.deserializeUser(function(username, done){
    users.findOne({
        where : {
            username : username
        }
    }).then((user) => {
        if (!user) {
            return done(new Error("No such user"))
        }
        return done(null, user)
    }).catch((err) => {
        done(err)
    })
})

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
},
function (username, password, done) {
    users.findOne({
        where: {
            username: username
        }
    }).then((user) => {
        if (!user) {
            return done(null, false)
        }
        if (user.password !== encrypt(password)) {
            return done(null, false)
        }
        return done(null, user)
    }).catch((err) => {
        return done(err)
    })
}))

exports = module.exports = passport