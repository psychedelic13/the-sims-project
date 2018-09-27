var express = require('express')
var router = express()

var moment = require('moment')

var expressValidator = require('express-validator')
var passport = require('passport')

var bcrypt = require('bcrypt-nodejs')
const saltRounds = 10

// Insert index.js and accounts.js from the former

// Customer side Routes

// Index / Home Routes

router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Perry in Disguise | Welcome'
    })
})

// Shop / Catalog Routes

router.get('/shop/allproducts', function(req, res, next) {
    // render to views/index.ejs template file
    res.render('shop/catalog', { title: 'Perry in Disguise | Shop' })

    const db = require('../db.js')
    let sql = `SELECT * FROM inventory_tbl WHERE is_deleted = ? AND is_phased_out = ? AND total_stock = ?`

    // This comment is for pagination

    // const db = require('../db.js')
    // let sql1 = `SELECT COUNT(*) as numRows FROM inventory_tbl`
    // let sql2 = `SELECT * FROM inventory_tbl ORDER BY product_no DESC LIMIT ?`
    // var numRows
    // var queryPagination
    // var numPerPage = parseInt(req.query.npp, 10) || 1
    // var page = parseInt(req.query.page, 10) || 0
    // var numPages
    // var skip = page * numPerPage
    // // Here we compute the LIMIT parameter for MySQL query
    // var limit = skip + ',' + skip + numPerPage;
    // db.queryAsync(sql)
    //     .then(function(results) {
    //         numRows = results[0].numRows;
    //         numPages = Math.ceil(numRows / numPerPage);
    //         console.log('number of pages:', numPages);
    //     })
    //     .then(() => db.queryAsync(sql, [limit]))
    //     .then(function(results) {
    //         var responsePayload = {
    //             results: results
    //         };
    //         if (page < numPages) {
    //             responsePayload.pagination = {
    //                 current: page,
    //                 perPage: numPerPage,
    //                 previous: page > 0 ? page - 1 : undefined,
    //                 next: page < numPages - 1 ? page + 1 : undefined
    //             }
    //         } else responsePayload.pagination = {
    //             error: 'queried page ' + page + ' is >= to maximum page number ' + numPages
    //         }
    //         res.json(responsePayload)
    //     })
    //     .catch(function(error) {
    //         console.error(error)
    //         res.json({
    //             error: error
    //         })
    //     })
    // })
})

// Check-out Routes



// Customer Routes

// Customer Profile

router.get('/customer/account/profile/(:id)', function(req, res, next) {
    res.render('customer/account/profile', {
        title: 'Perry in Disguise | Profile'
    })

    // const db = require('../db.js')
    // let sql = `SELECT *
    //     FROM customer_tbl
    //     WHERE customer_no = ?`
    //
    // db.query(sql, [req.params.id], (error, customer_results, fields) => {
    //     let sql = `SELECT *
    //         FROM addressbook_tbl
    //         WHERE customer_no = ?`
    //
    //     if (error) {
    //         req.flash('error', error)
    //         res.render('index', {
    //             title: 'Perry in Disguise | Home'
    //         })
    //     } else {
    //         db.query(sql, [req.params.id], (error, address_results, fields) => {
    //             let sql = `SELECT *
    //             FROM transaction_tbl
    //             WHERE customer_no = ?`
    //
    //             db.query(sql, [req.params.id], (error, transaction_results, fields) => {
    //                 req.render('customer/account/profile', {
    //                     title: 'Perry in Disguise | Profile',
    //                     customer_data: customer_results,
    //                     address_data: address_results,
    //                     transaction_data: transaction_results
    //                 })
    //             })
    //         })
    //     }
    // })
})

// Customer Cart

router.get('/customer/account/cart'/* /(:id) */, function(req, res, next) {
    res.render('customer/account/cart', {
        title: 'Perry in Disguise | Cart'
    })
    //
    // const db = require('../db.js')
    // let sql = `SELECT *, SUM(total_price) as 'cart_total'
    //     FROM cart_tbl
    //     WHERE customer_no = ?`
    //
    // db.query(sql, [req.params.id], (error, results, fields) => {
    //         res.render('customer/account/cart', {
    //             title: 'Perry in Disguise | Cart',
    //             data: results
    //         })
    //     }
    // })
})

// Customer Address Book



// About, FAQs, Contact Us, etc. Routes

router.get('/about', function(req, res, next) {
    // render to views/index.ejs template file
    res.render('about', { title: 'Perry in Disguise | About Us, FAQs' })
})

// Login - Register Routes

router.get('/customer/account/loginsignup', function(req, res, next) {
    res.render('customer/account/loginsignup', {
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

// // Error 404 catcher
// router.use(function(req, res, next) {
//     res.render('error-404', {
//         title: 'Perry in Disguise | Error 404 : Not Found'
//     })
// })

// Passport functions

passport.serializeUser(function(user, done) {
    done(null, user)
})

passport.deserializeUser(function(user, done) {
    done(null, user)
})

function authenticationMiddleware() {
    return (req, res, next) => {
        if (req.isAuthenticated()) return next();

        res.redirect('/customer/account/loginsignup')
    }
}

module.exports = router;
