var express = require('express')
var router = express()

router.get('/', function(req, res, next) {
    res.render('admin/dashboard', {
        title: 'Perry in Disguise | Dashboard'
    })
})

router.get('/dashboard', function(req, res, next) {
    res.render('admin/dashboard', {
        title: 'Perry in Disguise | Dashboard'
    })
})

router.get('/inventory', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT * FROM inventory_tbl WHERE is_deleted = ?`

    db.query(sql, [0], (error, results, fields) => {
        if (error) {
            req.flash('error', error)
            res.render('admin/inventory', {
                title: 'Perry in Disguise | Inventory',
                data: ''
            })
        } else {
            // render to views/inventory.ejs template file
            res.render('admin/inventory', {
                title: 'Perry in Disguise | Inventory',
                data: results
            })
        }
    })
})

router.post('/account/loginsignup/login', function(req, res, next) {
    res.render('index', {
        title: 'Perry in Disguise | Welcome'
    })
})

router.post('/account/loginsignup/signup', function(req, res, next) {
    res.render('index', {
        title: 'Perry in Disguise | Welcome'
    })
})


module.exports = router;
