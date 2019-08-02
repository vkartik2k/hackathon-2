const Sequelize = require("sequelize")

const database = new Sequelize('nameOfDB', 'root', 'SYSADMIN@1234!',{
    host : 'localhost',
    dialect : 'mysql',
    pool : {
        min:0,
        max:5
    },
    logging: false
})

const user = database.define('Users', {
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement: true
    },
    username : {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    name : {
        type: Sequelize.STRING
    },
    password : {
        type: Sequelize.STRING
    },
    email : {
        type: Sequelize.STRING
    },
    phoneno : {
        type: Sequelize.STRING
    },
    isfeedbackmarked : {
        type: Sequelize.STRING
    },
    type : {
        type: Sequelize.STRING
    },
    readMsg : {
        type: Sequelize.INTEGER
    }

})

const feedback = database.define('Feedback', {
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement: true
    },
    rating :{
        type : Sequelize.INTEGER
    },
    feedbackdata:{
        type : Sequelize.STRING
    },
    username:{
        type: Sequelize.STRING
    }
})

const settings = database.define('Settings', {
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement: true
    },
    property : {
        type: Sequelize.STRING
    },
    value : {
        type: Sequelize.STRING
    }
})

const quickfeedback = database.define('QuickFeedback', {
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement: true
    },
    emotion : {
        type: Sequelize.STRING,
    },
    value : {
        type: Sequelize.INTEGER
    }
})

const numusers = database.define('NumUsers', {
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement: true
    },
    month : {
        type: Sequelize.STRING,
    },
    value : {
        type: Sequelize.INTEGER
    }
})

const emails = database.define('Emails', {
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement: true
    },
    subject : {
        type: Sequelize.STRING,
    },
    body : {
        type: Sequelize.STRING,
    },
    tag : {
        type: Sequelize.STRING,
    },
    users : {
        type: Sequelize.STRING,
    }
})

const groupchat = database.define('GroupChat', {
    id : {
        type : Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement: true
    },
    message : {
        type: Sequelize.STRING
    },
    username : {
        type: Sequelize.STRING
    },
    time :{
        type: Sequelize.STRING
    },
    date : {
        type: Sequelize.STRING
    }
})

database.sync()
    .then(() => console.log("DATABASE HAS BE SYNCED."))
    .catch((err) => console.error("PROBLEM IN SYNCING DATABASE."))

exports = module.exports = {user, settings, quickfeedback, numusers, emails,feedback, groupchat}