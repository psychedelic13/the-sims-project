var express = require('express')
var router = express()

router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Perry in Disguise | Welcome'
    })
})

router.get('/customer/account/loginsignup', function(req, res, next) {
    res.render('loginsignup', {
        title: 'Perry in Disguise | Login / Signup'
    })
})

router.post('/customer/account/loginsignup/login', function(req, res, next) {
    res.render('index', {
        title: 'Perry in Disguise | Welcome'
    })
})

router.post('/customer/account/loginsignup/signup', function(req, res, next) {
    res.render('index', {
        title: 'Perry in Disguise | Welcome'
    })
})


module.exports = router;
