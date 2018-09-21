var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var mysql = require('mysql')
var app = express()

require('dotenv').config()

// Configure express to use views folder
app.set('views', path.join(__dirname, 'views'))
// Configure express to use public folder
app.use(express.static(path.join(__dirname + '/public')))
// Set templating engine
app.set('view engine', 'ejs')

// Express Validator Middleware for Form Validation
var expressValidator = require('express-validator')
app.use(expressValidator())

// Import routes
var index = require('./routes/index.js')
var admin = require('./routes/admin.js')

// This module let us use HTTP verbs such as PUT or DELETE in places where they are not supported
var methodOverride = require('method-override')

// using custom logic to override method
// there are other ways of overriding as well like using header & using query value
app.use(methodOverride(function(req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}))

// This is for parsing dates
var moment = require('moment')

// This module shows flash messages
// generally used to show success or error messages
// Flash messages are stored in session
// So, we also have to install and use cookie-parser & session modules
// Authentication Packages
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var flash = require('express-flash')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var MySQLStore = require('express-mysql-session')(session)
var bcrypt = require('bcrypt-nodejs')

var options = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    socketPath: '/var/run/mysqld/mysqld.sock'
}

var sessionStore = new MySQLStore(options)

// bodyParser.urlencoded() parses the text as URL encoded data
// (which is how browsers tend to send form data from regular forms set to POST and exposes the resulting object(containing the keys and values) on req. body.)
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use(cookieParser('keyboard cat'))
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    store: sessionStore,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000
    }
}))

app.use(passport.initialize())
// Persistent login sessions
app.use(passport.session())
app.use(flash())

app.use(function(req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated()
    next();
})

app.use('/', index)
app.use('/admin', admin)

passport.use(new LocalStrategy(
    function(username, password, done) {
        const db = require('./db')

        db.query('SELECT account_no, password FROM accounts_tbl WHERE username = ?', [username], function(err, results, fields) {
            if (err) {
                done(err)
            };

            if (results.length === 0) {
                done(null, false)
            } else {
                const hash = results[0].password.toString()

                bcrypt.compare(password, hash, function(err, response) {
                    if (response === true) {
                        return done(null, {
                            user_id: results[0].account_no
                        })
                    } else {
                        return done(null, false)
                    }
                })
            }
        })
    }
))

app.listen(3006, function() {
    console.log('Server running at port 3006! Woohoo!')
})
