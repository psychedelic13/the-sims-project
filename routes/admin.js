var express = require('express')
var router = express()

var moment = require('moment')

var expressValidator = require('express-validator')
var passport = require('passport')

var bcrypt = require('bcrypt-nodejs')
const saltRounds = 10

var multer  = require('multer')
var storage = multer.diskStorage({
  destination: './public/uploads',
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({
    storage: storage,
    limits: { filesize: 100000000 }
}).single('images')

// Admin Routes

// Dashboard Routes

router.get('/', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT product_name, total_stock FROM inventory_tbl ORDER BY total_stock ASC LIMIT 10;`

    db.query(sql, (error, gauge_results, fields) => {
        let sql = `SELECT product_name, jacket_sold FROM inventory_tbl ORDER BY jacket_sold ASC LIMIT 10;`

        db.query(sql, (error, selling_results, fields) => {
            let sql = `SELECT SUM(jacket_made) as jacketmade FROM inventory_tbl;`

            db.query(sql, (error, jacket_made, fields) => {
                let sql = `SELECT SUM(jacket_sold) as jacketsold FROM inventory_tbl;`

                db.query(sql, (error, jacket_sold, fields) => {
                    let sql = `SELECT COUNT(transaction_no) as successfultrans FROM transaction_tbl WHERE status = 4 AND is_deleted = 0;`

                    db.query(sql, (error, successful_trans, fields) => {
                        let sql = `SELECT COUNT(stransaction_no) as stallcatered FROM stalltransaction_tbl;`

                        db.query(sql, (error, stall_catered, fields) => {
                            let sql = `SELECT * FROM inventory_tbl WHERE total_stock <= 10 ORDER BY total_stock ASC LIMIT 10;`

                            db.query(sql, (error, warning_results, fields) => {
                                // render to views/admin/dashboard.ejs template file
                                res.render('admin/dashboard', {
                                    title: 'Perry in Disguise | Dashboard',
                                    gauge_results: gauge_results,
                                    selling_results: selling_results,
                                    jacketmade: jacket_made[0].jacketmade,
                                    jacketsold: jacket_sold[0].jacketsold,
                                    successfultransaction: successful_trans[0].successfultrans,
                                    eventcatered: stall_catered[0].stallcatered,
                                    gauge_data: warning_results,
                                    max_stocks: warning_results[9].total_stocks
                                })
                            })
                        })
                    })
                })
            })
        })
    })
})

router.get('/dashboard', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT product_name, total_stock FROM inventory_tbl ORDER BY total_stock ASC LIMIT 10;`

    db.query(sql, (error, gauge_results, fields) => {
        let sql = `SELECT product_name, jacket_sold FROM inventory_tbl ORDER BY jacket_sold ASC LIMIT 10;`

        db.query(sql, (error, selling_results, fields) => {
            let sql = `SELECT SUM(jacket_made) as jacketmade FROM inventory_tbl;`

            db.query(sql, (error, jacket_made, fields) => {
                let sql = `SELECT SUM(jacket_sold) as jacketsold FROM inventory_tbl;`

                db.query(sql, (error, jacket_sold, fields) => {
                    let sql = `SELECT COUNT(transaction_no) as successfultrans FROM transaction_tbl WHERE status = 4 AND is_deleted = 0;`

                    db.query(sql, (error, successful_trans, fields) => {
                        let sql = `SELECT COUNT(stalltransaction_no) as stallcatered FROM stalltransaction_tbl;`

                        db.query(sql, (error, stall_catered, fields) => {
                            let sql = `SELECT * FROM inventory_tbl WHERE total_stock <= 10 ORDER BY total_stock ASC LIMIT 10;`

                            db.query(sql, (error, warning_results, fields) => {
                                // render to views/admin/dashboard.ejs template file
                                var product_name = []
                                var total_stock = []
                                for (var i = 0; i < gauge_results.length; i++) {
                                    productname = gauge_results[i].product_name
                                    totalstock = gauge_results[i].total_stock
                                }
                                console.log(productname, totalstock);
                                res.render('admin/dashboard', {
                                    title: 'Perry in Disguise | Dashboard',
                                    productname: product_name,
                                    totalstock: total_stock,
                                    selling_results: selling_results,
                                    jacketmade: jacket_made[0].jacketmade,
                                    jacketsold: jacket_sold[0].jacketsold,
                                    successfultransaction: successful_trans[0].successfultrans,
                                    eventcatered: stall_catered[0].stallcatered,
                                    gauge_data: warning_results,
                                    max_stocks: warning_results.slice(-1)[0].total_stock
                                })
                            })
                        })
                    })
                })
            })
        })
    })
})

// Inventory Routes

router.get('/inventory', authenticationMiddleware(), function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT * FROM inventory_tbl WHERE is_deleted = ?;`

    db.query(sql, [0], (error, results, fields) => {
        if (error) {
            req.flash('error', error)
            // render to views/admin/inventory.ejs template file
            res.render('admin/inventory', {
                title: 'Perry in Disguise | Inventory',
                data: ''
            })
        } else {
            // render to views/admin/inventory.ejs template file
            res.render('admin/inventory', {
                title: 'Perry in Disguise | Inventory',
                data: results
            })
        }
    })
})

router.get('/inventory/product/add', function(req, res, next) {
    // render to views/inventory/product/add.ejs template file
    res.render('admin/inventory/product/add', {
        title: 'Perry in Disguise | Add Product',
        productslug: '',
        productcat: '',
        productorigin: '',
        productname: '',
        productprice: '',
        productdesc: ''
    })
})

router.post('/inventory/product/add', function(req, res, next) {
    // Validate data
    req.assert('productslug', 'Product Slug is required').notEmpty()
    req.assert('productcat', 'Product Category is required').notEmpty()
    req.assert('productorigin', 'Product Inspiration is required').notEmpty()
    req.assert('productname', 'Product Name is required').notEmpty()
    req.assert('productprice', 'Product Price is required').notEmpty()
    req.assert('productdesc', 'Product Description is required').notEmpty()

    var errors = req.validationErrors()

    // No errors were found. Passed Validation!
    if (!errors) {
        // Express-validator modules
        // req.body.comment = 'a <span>comment</span>';
        // req.body.productname = '     a product     '

        // req.sanitize('comment').escape(); // returns 'a &lt;span&gt;comment&lt;/span&gt;'
        // req.sanitize('productname').trim(); // returns 'a product'
        var product = {
            productslug: req.sanitize('productslug').escape().trim(),
            productcat: req.sanitize('productcat').escape().trim(),
            productorigin: req.sanitize('productorigin').escape().trim(),
            productname: req.sanitize('productname').escape().trim(),
            productprice: req.sanitize('productprice').escape().trim(),
            productdesc: req.sanitize('productdesc').escape().trim()
        }

        const db = require('../db.js')
        let sql = `INSERT INTO inventory_tbl(product_slug, product_category, product_origin, product_name, product_price, product_cog, product_desc, total_stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`

        db.query(sql, [product.productslug, product.productcat, product.productorigin, product.productname, product.productprice, 0, product.productdesc, 0], (error, results, fields) => {
            if (error) {
                req.flash('error', error)

                // render to views/inventory/product/add.ejs
                res.render('admin/inventory/product/add', {
                    title: 'Perry in Disguise | Add Product',
                    productslug: product.productslug,
                    productcat: product.productcat,
                    productorigin: product.productorigin,
                    productname: product.productname,
                    productprice: product.productprice,
                    productdesc: product.productdesc
                })
            } else {
                req.flash('success', 'Data added successfully!')

                res.redirect('/admin/inventory')
            }
        })
    } else {
        // Display errors to the user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        // Using req.body.name
        // because req.param('name') is depreciated
        res.render('admin/inventory/product/add', {
            title: 'Perry in Disguise | Add Product',
            productslug: req.body.productslug,
            productcat: req.body.productcat,
            productorigin: req.body.productorigin,
            productname: req.body.productname,
            productprice: req.body.productprice,
            productdesc: req.body.productdesc
        })
    }
})

router.get('/inventory/product/edit/(:id)', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT * FROM inventory_tbl WHERE product_no = ?;`

    db.query(sql, [req.params.id], (error, results, fields) => {
        if (error) throw error

        // if product not found
        if (results.length <= 0) {
            req.flash('error', 'Product not found with reference no. of ' + req.params.id)
            res.redirect('/admin/inventory')
        } else {
            // if product found
            // render to view/inventory/editproduct.ejs template file
            res.render('admin/inventory/product/edit', {
                title: 'Perry in Disguise | Edit Product',
                productno: req.params.id,
                productslug: results[0].product_slug,
                productcat: results[0].product_category,
                productorigin: results[0].product_origin,
                productname: results[0].product_name,
                productprice: results[0].product_price,
                productdesc: results[0].product_desc
            })
        }
    })
})

router.post('/inventory/product/edit/(:id)', function(req, res, next) {
    req.assert('productslug', 'Product Slug is required').notEmpty()
    req.assert('productcat', 'Product Category is required').notEmpty()
    req.assert('productorigin', 'Product Inspiration is required').notEmpty()
    req.assert('productname', 'Product Name is required').notEmpty()
    req.assert('productdesc', 'Product Description is required').notEmpty()

    var errors = req.validationErrors()

    if (!errors) {
        var product = {
            productslug: req.sanitize('productslug').escape().trim(),
            productcat: req.sanitize('productcat').escape().trim(),
            productorigin: req.sanitize('productorigin').escape().trim(),
            productname: req.sanitize('productname').escape().trim(),
            productdesc: req.sanitize('productdesc').escape().trim()
        }

        const db = require('../db.js')
        let sql = `UPDATE inventory_tbl SET product_slug = ?, product_category = ?, product_origin = ?, product_name = ?, product_desc = ? WHERE product_no = ?;`

        db.query(sql, [product.productslug, product.productcat, product.productorigin, product.productname, product.productdesc, req.params.id], (error, results, fields) => {
            if (error) {
                req.flash('error', error)
                console.log('error')

                res.render('admin/inventory/product/edit', {
                    title: 'Perry in Disguise | Edit Product',
                    productno: product.productno,
                    productslug: product.productslug,
                    productcat: product.productcat,
                    productorigin: product.productorigin,
                    productname: product.productname,
                    productdesc: product.productdesc
                })
            } else {
                req.flash('success', 'Data updated successfully!')
                console.log('success');

                res.render('admin/inventory/product/edit', {
                    title: 'Perry in Disguise | Edit Product',
                    productno: product.productno,
                    productslug: product.productslug,
                    productcat: product.productcat,
                    productorigin: product.productorigin,
                    productname: product.productname,
                    productdesc: product.productdesc
                })
            }
        })
    } else {
        // Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        console.log('Error')

        res.render('admin/inventory/product/edit', {
            title: 'Perry in Disguise | Edit Product',
            productno: req.params.id,
            productslug: req.body.productslug,
            productcat: req.body.productcat,
            productorigin: req.body.productorigin,
            productname: req.body.productname,
            productdesc: req.body.productdesc
        })
    }
})

router.delete('/inventory/product/phaseout/(:id)', function(req, res, next) {
    const db = require('../db.js')
    let sql = `UPDATE inventory_tbl SET is_phased_out = 1 WHERE product_no = ?`

    db.query(sql, [req.params.id], (error, results, fields) => {
        if (error) {
            req.flash('error', error)
            // redirect to inventory page
            res.redirect('/admin/inventory')
        } else {
            req.flash('success', 'Product phased out successfully! Reference No: ' + req.params.id)
            // redirect to inventory page
            res.redirect('/admin/inventory')
        }
    })
})

router.delete('/inventory/product/delete/(:id)', function(req, res, next) {
    const db = require('../db.js')
    let sql = `UPDATE inventory_tbl SET is_deleted = 1 WHERE product_no = ?`

    db.query(sql, [req.params.id], (error, results, fields) => {
        if (error) {
            req.flash('error', error)
            // redirect to inventory page
            res.redirect('/admin/inventory')
        } else {
            req.flash('success', 'Product deleted successfully! Reference No: ' + req.params.id)
            // redirect to inventory page
            res.redirect('/admin/inventory')
        }
    })
})

router.get('/inventory/product/(:id)', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT * FROM inventory_tbl WHERE product_no = ?;`

    db.query(sql, [req.params.id], (error, product_results, fields) => {
        if (error) {
            req.flash('error', error)
            res.render('admin/inventory/product', {
                title: 'Perry in Disguise | Product',
                data: '',
                product_no: product_results[0].product_no,
                product_slug: product_results[0].product_slug,
                product_cat: product_results[0].product_category,
                product_origin: product_results[0].product_origin,
                product_name: product_results[0].product_name,
                product_price: product_results[0].product_price,
                product_cog: product_results[0].product_cog,
                product_desc: product_results[0].product_desc
            })
        } else {
            let sql = `SELECT * FROM product_tbl WHERE product_no = ?`
            db.query(sql, [req.params.id], (error, stock_results, fields) => {
                if (error) throw error

                if (stock_results == '') {
                    res.render('admin/inventory/product', {
                        title: 'Perry in Disguise | Product',
                        data1: product_results,
                        check: 'nope',
                        product_no: product_results[0].product_no,
                        product_slug: product_results[0].product_slug,
                        product_cat: product_results[0].product_category,
                        product_origin: product_results[0].product_origin,
                        product_name: product_results[0].product_name,
                        product_price: product_results[0].product_price,
                        product_cog: product_results[0].product_cog,
                        product_desc: product_results[0].product_desc
                    })
                } else {
                    let sql = `SELECT * FROM stocks_tbl WHERE product_no = ?`
                    db.query(sql, [req.params.id], (error, batch_results, fields) => {
                        if (error) throw error

                        if (stock_results == '') {
                            res.render('admin/inventory/product', {
                                title: 'Perry in Disguise | Product',
                                data1: product_results,
                                data2: stock_results,
                                check: 'yes',
                                product_no: product_results[0].product_no,
                                product_slug: product_results[0].product_slug,
                                product_cat: product_results[0].product_category,
                                product_origin: product_results[0].product_origin,
                                product_name: product_results[0].product_name,
                                product_price: product_results[0].product_price,
                                product_desc: product_results[0].product_desc
                            })
                        } else {
                            res.render('admin/inventory/product', {
                                title: 'Perry in Disguise | Product',
                                data1: product_results,
                                data2: stock_results,
                                data3: batch_results,
                                moment: moment,
                                check: 'yes',
                                product_no: product_results[0].product_no,
                                product_slug: product_results[0].product_slug,
                                product_cat: product_results[0].product_category,
                                product_origin: product_results[0].product_origin,
                                product_name: product_results[0].product_name,
                                product_price: product_results[0].product_price,
                                product_cog: product_results[0].product_cog,
                                product_desc: product_results[0].product_desc
                            })
                        }
                    })
                }
            })
        }
    })
})

router.get('/inventory/product/images/(:id)', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT * FROM productimage_tbl;`

    db.query(sql, (error, results, fields) => {
        if (error) {
            req.flash('error', error)
            // render to views/admin/inventory.ejs template file
            res.render('admin/inventory/product/images', {
                title: 'Perry in Disguise | Product Images',
                data: '',
                product_no: req.params.id
            })
        } else {
            // render to views/admin/inventory.ejs template file
            res.render('admin/inventory/product/images', {
                title: 'Perry in Disguise | Product Images',
                data: results,
                division: results.length/4,
                product_no: req.params.id
            })
        }
    })
})

router.post('/inventory/product/images/add/(:id)', function(req, res, next) {
    upload(req, res, (error) => {
        const db = require('../db.js')
        let sql = `INSERT INTO productimage_tbl(product_no, image_path) VALUES (?, ?)`

        db.query(sql, [req.params.id, '/uploads/' + req.file.filename], (error, results, fields) => {
            if (error) {
                req.flash('error', error)
                console.log(error);
                console.log(req.file.destination, req.file.filename, req.params.id);

                res.render('admin/inventory/product/images', {
                    title: 'Perry in Disguise | Product images',
                    data: '',
                    product_no: req.params.id
                })
            } else {
                console.log(req.file);
                res.render('admin/inventory/product/images', {
                    title: 'Perry in Disguise | Product images',
                    data: '',
                    division: results.length/4,
                    product_no: req.params.id
                })
            }
        })
    })
})

router.get('/inventory/stocks/add/(:id)', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT * FROM inventory_tbl WHERE product_no = ?`

    db.query(sql, [req.params.id], (error, inventory_results, fields) => {
        let sql = `SELECT * FROM product_tbl WHERE product_no = ?`
        db.query(sql, [req.params.id], (error, results, fields) => {
            if (error) {
                req.flash('error', error)
                res.render('admin/inventory/stocks/add', {
                    title: 'Perry in Disguise | Stocks',
                    data: '',
                    product_name: inventory_results[0].product_name,
                    cog: '',
                    productno: req.params.id,
                    sizeslug: '',
                    sizename: '',
                    initialstock: ''
                })
            } else {
                res.render('admin/inventory/stocks/add', {
                    title: 'Perry in Disguise | Stocks',
                    data: results,
                    product_name: inventory_results[0].product_name,
                    cog: '',
                    productno: req.params.id,
                    sizeslug: '',
                    sizename: '',
                    initialstock: ''
                })
            }
        })
    })
})

router.post('/inventory/stocks/add/(:id)', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT product_slug FROM inventory_tbl WHERE product_no = ?;`

    db.query(sql, [req.params.id], (error, results, fields) => {
        if (error) throw error

        var productno = req.params.id
        var cog = req.body.cog
        var productslug = results[0].product_slug
        var sizeslug = req.body.sizeslug
        var sizename = req.body.sizename
        var initialstock = req.body.initialstock
        var stock = []
        var rowinserted = 0
        var pastIds = []

        for (var x = 0; x < sizeslug.length; x++) {
            var productsku = productslug + sizeslug[x]
            var slug = sizeslug[x]
            var name = sizename[x]
            var initstock = initialstock[x]
            if (sizeslug != '') {
                stock.push({
                    product_sku: productsku,
                    product_no: productno,
                    size_slug: slug,
                    size_name: name,
                    total_stock: initstock,
                    available_stock: initstock,
                    reserved_stock: '0'
                })
            }
        }

        var batch_id = []

        for (var i = 0; i < stock.length; i++) {
            let sql = `INSERT INTO product_tbl(product_sku, product_no, product_sizeslug, product_sizename, total_stock, available_stock, reserved_stock) VALUES (?, ?, ?, ?, ?, ?, ?);`
            db.query(sql, [stock[i].product_sku, req.params.id, stock[i].size_slug, stock[i].size_name, stock[i].total_stock, stock[i].available_stock, stock[i].reserved_stock], (error, results, fields) => {
                let sql = `INSERT INTO stocks_tbl(product_sku, product_no, production_date, batch_cog, initial_stock, stock_left) VALUES (?, ?, CURRENT_DATE, ?, ?, ?);`
                db.query(sql, [stock[i].product_sku, req.params.id, cog, stock[i].total_stock, stock[i].available_stock], (error, results, fields) => {
                    db.query(`SELECT LAST_INSERT_ID() AS id;`, (error, results, fields) => {
                        batch_id[i] = results[0].id
                    })
                })
            })
            pastIds[i] = stock[i].product_sku
            rowinserted = rowinserted + 1
        }

        if (rowinserted != sizeslug.length) {
            for (x = 0; x < rowinserted; x++) {
                let sql = `DELETE FROM product_tbl WHERE product_sku = ?`
                db.query(sql, [pastIds[x]], (error, results, fields) => {
                    if (error) throw error
                    let sql = `DELETE FROM stocks_tbl WHERE batch_no = ?`
                    db.query(sql, [batch_id[x]], (error, results, fields) => {
                        if (error) throw error
                    })
                })
            }
            req.flash('error', error)
            console.log('error')

            res.redirect('/admin/inventory')
        } else {
            let sql = `SELECT SUM(total_stock) as total_stock, SUM(available_stock) as available_stock, SUM(reserved_stock) as reserved_stock FROM product_tbl WHERE product_no = ?`

            db.query(sql, [req.params.id], (error, results, fields) => {
                if (error) throw error

                let sql = `UPDATE inventory_tbl SET total_stock = ?, available_stock = ?, reserved_stock = ? WHERE product_no = ?`

                db.query(sql, [results[0].total_stock, results[0].available_stock, results[0].reserved_stock, req.params.id], (error, results, fields) => {
                    if (error) throw error

                    req.flash('success', 'Data added successfully!')

                    // redirect to inventory page
                    res.redirect('/admin/inventory')
                })
            })
        }
    })
})

router.get('/inventory/stocks/update/add/(:id)', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT * FROM inventory_tbl WHERE product_no = ?`

    db.query(sql, [req.params.id], (error, inventory_results, fields) => {
        let sql = `SELECT * FROM product_tbl WHERE product_no = ?`
        db.query(sql, [req.params.id], (error, results, fields) => {
            if (error) {
                req.flash('error', error)
                res.render('admin/inventory/stocks/update/add', {
                    title: 'Perry in Disguise | Add Stocks',
                    data: '',
                    productname: inventory_results[0].product_name,
                    cog: '',
                    productno: req.params.id,
                    addstock: 0
                })
            } else {
                res.render('admin/inventory/stocks/update/add', {
                    title: 'Perry in Disguise | Add Stocks',
                    data: results,
                    productname: inventory_results[0].product_name,
                    cog: '',
                    productno: req.params.id,
                    data: results,
                    addstock: 0
                })
            }
        })
    })
})

router.post('/inventory/stocks/update/add/(:id)', function(req, res, next) {
    var cog = req.body.cog
    var productsku = req.body.productsku
    var addstock = req.body.addstock
    var rowsupdated = 0
    var batch_id = []

    const db = require('../db.js')
    let sql = `UPDATE product_tbl SET total_stock = (total_stock + ?), available_stock = (available_stock + ?) WHERE product_sku = ?;`

    for (var i = 0; i < addstock.length; i++) {
        db.query(sql, [addstock[i], addstock[i], productsku[i]], (error, results, fields) => {
            let sql = `INSERT INTO stocks_tbl(product_sku, production_date, batch_cog, initial_stock, stock_left) VALUES (?, CURRENT_DATE(), ?, ?, ?, ?);`
            db.query(sql, [product_sku[i], cog, addstock[i], addstock[i]], (error, results, fields) => {
                db.query(`SELECT LAST_INSERT_ID() AS id;`, (error, results, error) => {
                    batch_id[i] = results[0].id
                })
            })
        })
        rowsupdated = rowsupdated + 1
    }

    if (rowsupdated != productsku.length) {
        for (x = 0; x < rowsupdated; x++) {
            let sql = `UPDATE product_tbl SET total_stock = (total_stock - ?), available_stock = (available_stock - ?) WHERE product_sku = ?;`
            db.query(sql, [addstock[x], addstock[x], productsku[x]], (err, results, fields) => {
                let sql = `DELETE FROM stocks_tbl WHERE batch_no = ?`
                db.query(sql, [batch_id[x]], (error, results, fields) => {
                    if (error) throw error
                })
            })
            x = x + 1
            req.flash('error', err)
            console.log('error')
        }

        res.redirect('/admin/inventory/product/' + req.params.id)
    } else {
        req.flash('success', 'Data added successfully!')

        // redirect to inventory page
        res.redirect('/admin/inventory/product/' + req.params.id)
    }
})

// Remove is not done yet!
router.get('/inventory/stocks/update/remove/(:id)', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT * FROM inventory_tbl WHERE product_no = ?`

    db.query(sql, [req.params.id], (error, inventory_results, fields) => {
        let sql = `SELECT * FROM product_tbl WHERE product_no = ?`
        db.query(sql, [req.params.id], (error, results, fields) => {
            if (error) {
                req.flash('error', error)
                res.render('admin/inventory/stocks/update/remove', {
                    title: 'Perry in Disguise | Stocks',
                    data: '',
                    product_name: inventory_results[0].product_name,
                    cogs: '',
                    productno: req.params.id,
                    removestock: 0
                })
            } else {
                res.render('admin/inventory/stocks/update/remove', {
                    title: 'Perry in Disguise | Remove Stocks',
                    data: results,
                    product_name: inventory_results[0].product_name,
                    cogs: '',
                    productno: req.params.id,
                    data: results,
                    removestock: 0
                })
            }
        })
    })
})

router.post('/inventory/stocks/update/remove/(:id)', function(req, res, next) {
    var productsku = req.body.productsku
    var removestock = req.body.removestock
    var rowsupdated = 0

    const db = require('../db.js')
    let sql = `UPDATE stocks_tbl SET total_stock = (total_stock + ?), available_stock = (available_stock + ?) WHERE product_sku = ?;`

    for (var i = 0; i < removestock.length; i++) {
        db.query(sql, [removestock[i], removestock[i], productsku[i]], (error, results, fields) => {

        })
        rowsupdated = rowsupdated + 1
    }

    if (rowsupdated != productsku.length) {
        let sql = `UPDATE stocks_tbl SET total_stock = (total_stock + ?), available_stock = (available_stock + ?) WHERE product_sku = ?;`
        for (x = 0; x < rowsupdated; x++) {
            db.query(sql, [removestock[i], removestock[i], productsku[i]], (err, results, fields) => {

            })
            rowsupdated = rowsupdated + 1
            req.flash('error', err)
            console.log('error')
        }

        res.redirect('/admin/inventory/product/' + req.params.id)
    } else {
        req.flash('success', 'Data added successfully!')

        // redirect to inventory page
        res.redirect('/admin/inventory/product/' + req.params.id)
    }
})

// Customer Profiles Routes

router.get('/customers', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT * FROM customer_tbl ORDER BY customer_no DESC`

    db.query(sql, (error, results, fields) => {
        if (error) {
            req.flash('error', error)
            res.render('admin/customers', {
                title: 'Perry in Disguise | Customers',
                data: ''
            })
        } else {
            res.render('admin/customers', {
                title: 'Perry in Disguise | Customers',
                data: results
            })
        }
    })
})

router.get('/customers/edit/(:id)', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT * FROM customer_tbl WHERE customer_no = ?`

    db.query(sql, [req.params.id], (error, results, fields) => {
        if (error) throw error

        if (results.length <= 0) {
            req.flash('error', 'Customer not found with reference no. of ' + req.params.id)
            res.redirect('/admin/customers')
        } else {
            res.render('admin/customers/edit', {
                title: 'Perry in Disguise | Edit Customer Info',
                customerno: results[0].customerno,
                accountno: results[0].accountno,
                lastname: results[0].lastname,
                firstname: results[0].firstname,
                email: results[0].email,
                contactno: results[0].contactno,
                streetaddress: results[0].streetaddress,
                streetaddress2: results[0].streetaddress2,
                addresscity: results[0].addresscity,
                addressprovince: results[0].addressprovince
            })
        }
    })
})

router.put('/customers/edit/(:id)', function(req, res, next) {
    req.assert('lastname', 'Last Name is required').notEmpty()
    req.assert('firstname', 'First Name is required').notEmpty()
    req.assert('emailaddress', 'Email Address is required').notEmpty()
    req.assert('contactno', 'Contact No is required').notEmpty()
    req.assert('streetaddress', 'Complete Address is required').notEmpty()
    req.assert('streetaddress2', 'Complete Address is required').notEmpty()
    req.assert('addresscity', 'Complete Address is required').notEmpty()
    req.assert('addressprovince', 'Complete Address is required').notEmpty()
    req.assert('zipcode', 'Zip Code is required').notEmpty()

    var errors = req.validationErrors()

    if (!errors) {
        var customer = {
            lastname: req.sanitize('lastname').escape().trim(),
            firstname: req.sanitize('firstname').escape().trim(),
            emailaddress: req.sanitize('emailaddress').escape().trim(),
            contactno: req.sanitize('contactno').escape().trim(),
            streetaddress: req.sanitize('streetaddress').escape().trim(),
            streetaddress2: req.sanitize('streetaddress2').escape().trim(),
            addresscity: req.sanitize('addresscity').escape().trim(),
            addressprovince: req.sanitize('addressprovince').escape().trim()
        }

        const db = require('../db.js')
        let sql = `UPDATE customer_tbl SET last_name = ?, first_name = ?, email_address = ? WHERE customer_no = ?;`

        db.query(sql, [customer.lastname, customer.firstname, customer.emailaddress, req.params.id], (error, customer_results, fields) => {
            if (error) {
                req.flash('error', error)
                console.log('error')

                res.render('admin/customers/edit', {
                    title: 'Perry in Disguise | Edit Customer Info',
                    lastname: customer.lastname,
                    firstname: customer.firstname,
                    emailaddress: customer.emailaddress,
                    contactno: customer.contactno,
                    streetaddress: customer.streetaddress,
                    streetaddress2: customer.streetaddress2,
                    addresscity: customer.addresscity,
                    addressprovince: customer.addressprovince,
                    zipcode: customer.zipcode
                })
            } else {
                let sql = `UPDATE addressbook_tbl SET phone_number = ?, street_address = ?, street_address_2 = ?, city = ?, province = ?, zip_code = ?`

                db.query(sql, [customer.contact_no, customer.addressno, customer.streetaddress, customer.streetaddress2, customer.addresscity, customer.addressprovince, customer.zipcode], (error, address_results, fields) => {
                    req.flash('success', 'Data updated successfully!')
                    console.log('success')

                    res.render('admin/customers/edit', {
                        title: 'Perry in Disguise | Edit Customer',
                        lastname: customer.lastname,
                        firstname: customer.firstname,
                        emailaddress: customer.emailaddress,
                        contactno: customer.contactno,
                        streetaddress: customer.streetaddress,
                        streetaddress2: customer.streetaddress2,
                        addresscity: customer.addresscity,
                        addressprovince: customer.addressprovince,
                        zipcode: customer.zipcode
                    })
                })
            }
        })
    } else {
        // Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        console.log('Error')

        res.render('admin/customers/edit', {
            title: 'Perry in Disguise | Edit Product',
            lastname: customer.lastname,
            firstname: customer.firstname,
            emailaddress: customer.emailaddress,
            contactno: customer.contactno,
            streetaddress: customer.streetaddress,
            streetaddress2: customer.streetaddress2,
            addresscity: customer.addresscity,
            addressprovince: customer.addressprovince,
            zipcode: customer.zipcode
        })
    }
})

router.delete('/customers/delete/(:id)', function(req, res, next) {
    const db = require('../db.js')
    let sql = `UPDATE customer_tbl SET is_deleted = 1 WHERE customer_no = ?;`

    db.query(sql, [req.params.id], (error, results, fields) => {
        if (err) {
            req.flash('error', err)
            // redirect to inventory page
            res.redirect('/customers')
        } else {
            req.flash('success', 'Customer deleted successfully! Reference No: ' + req.params.id)
            // redirect to inventory page
            res.redirect('/customers')
        }
    })
})

// Online Transactions Routes

router.get('/onlinetransactions/ongoing', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT * FROM transaction_tbl WHERE is_deleted = ? AND status < ? ORDER BY transaction_no`

    db.query(sql, [0, 4], (error, results, fields) => {
        if (error) {
            req.flash('error', error)
            res.render('admin/onlinetransactions', {
                title: 'Perry in Disguise | Online Transactions',
                moment: moment,
                data: ''
            })
        } else {
            res.render('admin/onlinetransactions', {
                title: 'Perry in Disguise | Online Transactions',
                moment: moment,
                data: results
            })
        }
    })
})

router.get('/onlinetransactions/all', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT * FROM transaction_tbl WHERE is_deleted = ? ORDER BY transaction_no`

    db.query(sql, [0], (error, results, fields) => {
        if (error) {
            req.flash('error', error)
            res.render('admin/alltransactions', {
                title: 'Perry in Disguise | Online Transactions',
                moment: moment,
                data: ''
            })
        } else {
            res.render('admin/alltransactions', {
                title: 'Perry in Disguise | Online Transactions',
                moment: moment,
                data: results
            })
        }
    })
})

// Stall Transactions Routes

router.get('/stalltransactions', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT * FROM stalltransaction_tbl WHERE is_deleted = ? ORDER BY stalltransaction_no DESC`

    db.query(sql, [0], (error, results, fields) => {
        if (error) {
            req.flash('error', error)
            res.render('admin/stalltransactions', {
                title: 'Perry in Disguise | Stall Transactions',
                moment: moment,
                data: ''
            })
        } else {
            res.render('admin/stalltransactions', {
                title: 'Perry in Disguise | Stall Transactions',
                moment: moment,
                data: results
            })
        }
    })
})

router.get('/stalltransactions/add', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT * FROM stocks_tbl S JOIN inventory_tbl I ON I.product_no = S.product_no WHERE I.is_deleted = ?`

    db.query(sql, [0], (error, results, fields) => {
        if (error) {
            req.flash('error', error)
            res.render('admin/stalltransactions/add', {
                title: 'Perry in Disguise | Add Stall Transaction',
                moment: moment,
                data: '',
                eventname: '',
                eventplace: '',
                eventdate: '',
                totalamount: '',
                itemsold: '0'
            })
        } else {
            res.render('admin/stalltransactions/add', {
                title: 'Perry in Disguise | Add Stall Transaction',
                moment: moment,
                data: results,
                eventname: '',
                eventplace: '',
                eventdate: '',
                totalamount: '',
                itemsold: '0'
            })
        }
    })
})

router.post('/stalltransactions/add', function(req, res, next) {
    req.assert('eventname', 'Event Name is required').notEmpty()
    req.assert('eventplace', 'Event Place is required').notEmpty()
    req.assert('eventdate', 'Event Date is required').notEmpty()
    req.assert('totalamount', 'Total Amount is required').notEmpty()

    var errors = req.validationErrors()

    if (!errors) {
        var stalldetails = {
            eventname: req.sanitize('eventname').escape().trim(),
            eventplace: req.sanitize('eventplace').escape().trim(),
            eventdate: req.sanitize('eventdate').escape().trim(),
            totalamount: req.sanitize('totalamount').escape().trim()
        }

        const db = require('../db.js')
        let sql = `INSERT INTO stalltransaction_tbl(event_name, event_place, event_date, total_amount) VALUES (?, ?, ?, ?)`

        var productsku = req.body.productsku
        var itemsold = req.body.itemsold

        db.query(sql, [stalldetails.eventname, stalldetails.eventplace, stalldetails.eventdate, stalldetails.totalamount], (error, results, fields) => {
            if (error) throw error
        })

        var insertedRows = 0

        sql = `SELECT LAST_INSERT_ID() as lastId`

        db.query(sql, (error, results, fields) => {
            if (error) throw error
            var lastId = results[0].lastId

            let sql = `INSERT INTO stallitems_tbl(stalltransaction_no, stallitem_no, product_sku, quantity) VALUE (?, ?, ?, ?)`

            for (var i = 0; i < productsku.length; i++) {
                db.query(sql, [lastId, i, productsku[i], itemsold[i]], (error, results, fields) => {
                    if (error) throw error
                })
                insertedRows = insertedRows + 1
            }

            if (insertedRows != productsku.length) {
                let sql = `DELETE FROM stallitem_tbl WHERE stalltransaction_no = ?`

                db.query(sql, [lastId], (error, results, fields) => {
                    if (error) throw error
                })
                // for (x = 0; x < insertedRows; x++) {
                //     conn.query('DELETE FROM stallitem_tbl WHERE stalltransaction_no = ' + lastId, function(err, results, fields) {
                //         if (err) throw err
                //     })
                // }
                req.flash('error', error)
                console.log('error')

                res.redirect('/admin/stalltransactions')
            } else {
                req.flash('success', 'Data added successfully!')

                res.redirect('/admin/stalltransactions')
            }
        })
    }
})

// Payments Routes

router.get('/onlinetransactions/payments', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT * FROM payment_tbl WHERE is_deleted = ? ORDER BY payment_no DESC`

    db.query(sql, [0], (error, results, fields) => {
        if (error) {
            req.flash('error', error)
            res.render('admin/onlinetransactions/payments', {
                title: 'Perry in Disguise | Payment Records',
                moment: moment,
                data: ''
            })
        } else {
            res.render('admin/onlinetransactions/payments', {
                title: 'Perry in Disguise',
                moment: moment,
                data: results
            })
        }
    })
})

router.get('/onlinetransactions/payments/add/(:id)', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT * FROM transaction_tbl WHERE transaction_no = ?`

    db.query(sql, [req.params.id], (error, results, fields) => {
        if (error) throw error

        if (results.length <= 0) {
            req.flash('error', 'Transaction record not found with reference no. of ' + req.params.id)
            res.redirect('/admin/onlinetransactions')
        } else {
            // if Transaction found
            res.render('admin/onlinetransactions/payments/add', {
                title: 'Perry in Disguise | Add Payment',
                moment: moment,
                transactionno: req.params.id,
                payorsname: '',
                paymentmode: '',
                paymentdate: '',
                amount: ''
            })
        }
    })
})

// Is the paid amount sufficient for the total amount?
router.post('/onlinetransactions/payments/add/(:id)', function(req, res, next) {
    req.assert('payorsname', 'Payors Name is required').notEmpty()
    req.assert('paymentmode', 'Payment Mode is required').notEmpty()
    req.assert('paymentdate', 'Payment Date is required').notEmpty()
    req.assert('amount', 'Amount is required').notEmpty()

    var errors = req.validationErrors()

    // No errors were found. Passed Validation!
    if (!errors) {
        var payment = {
            payorsname: req.sanitize('payorsname').escape().trim(),
            paymentmode: req.sanitize('paymentmode').escape().trim(),
            paymentdate: req.sanitize('paymentdate').escape().trim(),
            amount: req.sanitize('amount').escape().trim()
        }

        const db = require('../db.js')
        let sql = `INSERT INTO payment_tbl(transaction_no, payors_name, payment_mode, payment_date, amount) VALUES (?, ?, ?, ?, ?)`

        db.query(sql, [req.params.id, payment.payorsname, payment.paymentmode, payment.paymentdate, parseFloat(payment.amount)], (error, results, fields) => {
            let sql = `UPDATE transaction_tbl SET status = ? WHERE transaction_no = ?`

            db.query(sql, [2, req.params.id], (error, results, fields) => {
                if (err) {
                    req.flash('error', err)

                    res.render('admin/onlinetransactions/payments/add', {
                        title: 'Perry in Disguise | Add Payment',
                        moment: moment,
                        transactionno: req.params.id,
                        payorsname: payment.payorsname,
                        paymentmode: payment.paymentmode,
                        paymentdate: payment.paymentdate,
                        amount: payment.amount
                    })
                } else {
                    req.flash('success', 'Data added successfully!')

                    res.redirect('/admin/onlinetransactions/ongoing')
                }
            })
        })
    } else {
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        res.render('admin/onlinetransactions/payments/add', {
            title: 'Perry in Disguise | Add Payment',
            moment: moment,
            transactionno: req.params.id,
            payorsname: req.body.payorsname,
            paymentmode: req.body.paymentmode,
            paymentdate: req.body.paymentdate,
            amount: req.body.amount
        })
    }
})

// Should I put edit payment?

router.delete('/onlinetransactions/payments/delete/(:id)', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT transaction_no FROM payment_tbl WHERE payment_no = ?`

    db.query(sql, [req.params.id], (error, results, fields) => {
        if (err) throw err

        let sql = `SELECT * FROM shipping_tbl WHERE is_deleted = 0 AND transaction_no = ?`
        var transactionno = results.transaction_no[0]

        db.query(sql, [transactionno], (error, results, fields) => {
            if (results.length > 0) {
                req.flash('error', 'Shipping record exists, delete that first. Maybe?')
                res.redirect('/admin/onlinetransactions/payments')
            } else {
                let sql = `UPDATE payment_tbl SET is_deleted = 1 WHERE payment_no = ?`

                db.query(sql, [req.params.id], (error, results, fields) => {
                    if (error) throw error

                    let sql = `UPDATE transaction_tbl SET status = "1" WHERE transaction_no = ?`

                    db.query(sql, [transactionno], (error, results, fields) => {
                        // if (err) throw err
                        if (err) {
                            req.flash('error', err)

                            res.redirect('/onlinetransactions/payments')
                        } else {
                            req.flash('success', 'Payment deleted successfully! Reference No: ' + req.params.id)

                            res.redirect('/onlinetransactions/payments')
                        }
                    })
                })
            }
        })
    })
})

// Shipping Routes

router.get('/onlinetransactions/shippings', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT * FROM shipping_tbl WHERE is_deleted = ? ORDER BY release_date DESC`

    db.query(sql, [0], (error, results, fields) => {
        if (error) {
            req.flash('error', error)
            res.render('admin/onlinetransactions/shippings', {
                title: 'Perry in Disguise | Shippings',
                moment: moment,
                data: ''
            })
        } else {
            res.render('admin/onlinetransactions/shippings', {
                title: 'Perry in Disguise | Shippings',
                moment: moment,
                data: results
            })
        }
    })
})

router.get('/onlinetransactions/shippings/add/(:id)', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT * FROM transaction_tbl WHERE status = ? AND transaction_no = ?`

    db.query(sql, [2, req.params.id], (error, results, fields) => {
        if (error) throw error

        if (results.length <= 0) {
            req.flash('error', 'The process doesn&qt;t meet the requirements. This might help, maybe. #' + req.params.id)
            res.redirect('/admin/onlinetransactions')
        } else {
            // if Transaction found
            res.render('admin/onlinetransactions/shippings/add', {
                title: 'Perry in Disguise | Add Shipping',
                moment: moment,
                transactionno: req.params.id,
                courier: '',
                shippingnotes: '',
                releasedate: ''
            })
        }
    })
})

router.post('/onlinetransactions/shippings/add/(:id)', function(req, res, next) {
    req.assert('courier', 'Courier is required').notEmpty()
    req.assert('releasedate', 'Release Date is required').notEmpty()

    var errors = req.validationErrors()

    // No errors were found. Passed Validation!
    if (!errors) {
        var shipping = {
            courier: req.sanitize('courier').escape().trim(),
            shippingnotes: req.sanitize('shippingnotes').escape().trim(),
            releasedate: req.sanitize('releasedate').escape().trim()
        }

        const db = require('../db.js')
        let sql = `INSERT INTO shipping_tbl(transaction_no, courier, shipping_notes, release_date) VALUES (?, ?, ?, ?);`

        db.query(sql, [req.params.id, shipping.courier, shipping.shippingnotes, shipping.releasedate], (error, results, fields) => {
            let sql = `UPDATE transaction_tbl SET status = ? WHERE transaction_no = ?`

            db.query(sql, [3, req.params.id], (error, results, fields) => {
                // if(err) throw err
                if (err) {
                    req.flash('error', err)

                    res.render('admin/onlinetransactions/shippings/add', {
                        title: 'Perry in Disguise | Add Shipping',
                        moment: moment,
                        transactionno: req.params.id,
                        courier: shipping.courier,
                        shippingnotes: shipping.shippingnotes,
                        releasedate: shipping.releasedate
                    })
                } else {
                    req.flash('success', 'Data added successfully!')

                    res.redirect('/admin/onlinetransactions/ongoing')
                }
            })
        })
    } else {
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        res.render('admin/onlinetransactions/shippings/add', {
            title: 'Perry in Disguise | Add Shipping',
            moment: moment,
            transactionno: req.params.id,
            courier: req.body.courier,
            shippingnotes: req.body.shippingnotes,
            releasedate: req.body.releasedate
        })
    }
})

router.get('/onlinetransactions/shippings/edit/(:id)', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT * FROM shipping_tbl WHERE shipping_no = ?`

    db.query(sql, [req.params.id], (error, results, fields) => {
        if (error) throw error

        if (results.length <= 0) {
            req.flash('error', 'The process doesn&qt;t meet the requirements. This might help, maybe.' + req.params.id)
            res.redirect('/admin/onlinetransactions/shippings')
        } else {
            // if shipping found
            res.render('admin/onlinetransactions/shippings/edit', {
                title: 'Perry in Disguise | Edit Shipping',
                moment: moment,
                shippingno: results[0].shipping_no,
                courier: results[0].courier,
                shippingnotes: results[0].shipping_notes,
                releasedate: results[0].release_date
            })
        }
    })
})

router.put('/onlinetransactions/shippings/edit/(:id)', function(req, res, next) {
    req.assert('courier', 'Courier is required').notEmpty()
    req.assert('releasedate', 'Release Date is required').notEmpty()

    var errors = req.validationErrors()

    if (!errors) {
        var shipping = {
            courier: req.sanitize('courier').escape().trim(),
            shippingnotes: req.sanitize('shippingnotes').escape().trim(),
            releasedate: req.sanitize('releasedate').escape().trim()
        }

        const db = require('../db.js')
        let sql = `UPDATE shipping_tbl SET courier = ?, shipping_notes = ?, release_date = ? WHERE shipping_no = ?;`

        db.query(sql, [shipping.courier, shipping.shippingnotes, shipping.releasedate, req.params.id], (error, results, fields) => {
            if (error) {
                req.flash('error', error)
                console.log('error')

                res.render('admin/onlinetransactions/shippings/edit', {
                    title: 'Perry in Disguise | Edit Shipping',
                    moment: moment,
                    shippingno: req.params.id,
                    courier: shipping.courier,
                    shippingnotes: shipping.shippingnotes,
                    releasedate: shipping.releasedate
                })
            } else {
                req.flash('success', 'Data updated successfully!')
                console.log('success');

                res.redirect('/admin/onlinetransactions/shippings')
            }
        })
    } else {
        // Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        console.log('Error')

        res.render('admin/onlinetransactions/shippings/edit', {
            title: 'Perry in Disguise | Edit Shipping',
            moment: moment,
            shippingno: req.params.id,
            courier: req.body.courier,
            shippingnotes: req.body.shippingnotes,
            releasedate: req.body.releasedate
        })
    }
})

router.delete('/onlinetransactions/shippings/delete/(:id)', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT transaction_no FROM shipping_tbl WHERE shipping_no = ?`

    db.query(sql, [req.params.id], (error, shipping_results, fields) => {
        let sql = `SELECT status FROM transaction_tbl WHERE is_deleted = ? AND shipping_no = ?`

        db.query(sql, [0, req.params.id], (error, transaction_results, fields) => {
            if (transaction_results[0].status == '4') {
                req.flash('error', 'You already finished the transaction. Why would you delete a part of finished transaction? Perhaps, delete the whole transaction?')
                res.redirect('/admin/onlinetransactions/shippings')
            } else {
                let sql = `UPDATE shipping_tbl SET is_deleted = ? WHERE shipping_no = ?`

                db.query(sql, [1, req.params.id], (error, results, fields) => {
                    let sql = ` UPDATE transaction_tbl SET status = ? WHERE transaction_no = ?`

                    db.query(sql, [2, shipping_results[0].transaction_no], (error, results, fields) => {
                        // if (err) throw err
                        if (err) {
                            req.flash('error', err)

                            res.redirect('/onlinetransactions/shippings')
                        } else {
                            req.flash('success', 'Shipping deleted successfully! Reference No: ' + req.params.id)

                            res.redirect('/onlinetransactions/shippings')
                        }
                    })
                })
            }
        })
    })
})

// Expenses Routes

router.get('/expenses', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT * FROM expenses_tbl WHERE is_deleted = ?`

    db.query(sql, [0], (error, results, fields) => {
        if (error) {
            req.flash('error', error)
            res.render('admin/expenses', {
                title: 'Perry in Disguise | Expenses',
                moment: moment,
                data: ''
            })
        } else {
            res.render('admin/expenses', {
                title: 'Perry in Disguise | Expenses',
                moment: moment,
                data: results,
                expensedate: moment(results.expensedate)
            })
        }
    })
})

router.get('/expenses/add', function(req, res, next) {
    res.render('admin/expenses/add', {
        title: 'Perry in Disguise | Add Expense',
        moment: moment,
        expensebiller: '',
        expensedate: '',
        amount: '',
        expensedesc: ''
    })
})

router.post('/expenses/add', function(req, res, next) {
    req.assert('expensebiller', 'Expense Biller is required').notEmpty()
    req.assert('amount', 'Expense Amount is required').notEmpty()
    req.assert('expensedesc', 'Expense Description is required').notEmpty()

    var errors = req.validationErrors()

    // No errors were found. Passed Validation!
    if (!errors) {
        var expense = {
            expensebiller: req.sanitize('expensebiller').escape().trim(),
            amount: req.sanitize('amount').escape().trim(),
            expensedesc: req.sanitize('expensedesc').escape().trim()
        }

        const db = require('../db.js')
        let sql = `INSERT INTO expenses_tbl(expense_biller, expense_date, expense_desc, amount) VALUES (?, CURRENT_DATE(), ?, ?);`

        db.query(sql, [expense.expensebiller, expense.expensedesc, expense.amount], (error, results, fields) => {
            if (error) {
                req.flash('error', error)

                res.render('admin/expenses/add', {
                    title: 'Perry in Disguise | Add Expense',
                    moment: moment,
                    expensebiller: expense.expensebiller,
                    expensedate: expense.expensedate,
                    amount: expense.amount,
                    expensedesc: expense.expensedesc
                })
            } else {
                req.flash('success', 'Data added successfully!')

                res.render('admin/expenses/add', {
                    title: 'Perry in Disguise | Add Expense',
                    moment: moment,
                    expensebiller: '',
                    expensedate: '',
                    amount: '',
                    expensedesc: ''
                })
            }
        })
    } else {
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        res.render('admin/expenses/add', {
            title: 'Perry in Disguise | Add Expense',
            moment: moment,
            expensebiller: req.body.expensebiller,
            expensedate: req.body.expensedate,
            amount: req.body.amount,
            expensedesc: req.body.expensedesc
        })
    }
})

router.get('/expenses/edit/(:id)', function(req, res, next) {
    const db = require('../db.js')
    let sql = `SELECT * FROM expenses_tbl WHERE expense_no = ?`

    db.query(sql, [req.params.id], (error, results, next) => {
        if (error) throw error

        if (results.length <= 0) {
            req.flash('error', 'Expense record not found with reference no. of ' + req.params.id)
            res.redirect('/admin/expenses')
        } else {
            // if expense found
            res.render('admin/expenses/edit', {
                title: 'Perry in Disguise | Edit Expense',
                moment: moment,
                expenseno: results[0].expense_no,
                expensebiller: results[0].expense_biller,
                expensedate: results[0].expense_date,
                amount: results[0].amount,
                expensedesc: results[0].expense_desc
            })
        }
    })
})

router.put('/expenses/edit/(:id)', function(req, res, next) {
    req.assert('expensebiller', 'Expense Biller is required').notEmpty()
    req.assert('amount', 'Expense Amount is required').notEmpty()
    req.assert('expensedesc', 'Expense Description is required').notEmpty()

    var errors = req.validationErrors()

    if (!errors) {
        var expense = {
            expensebiller: req.sanitize('expensebiller').escape().trim(),
            amount: req.sanitize('amount').escape().trim(),
            expensedesc: req.sanitize('expensedesc').escape().trim()
        }

        const db = require('../db.js')
        let sql = `UPDATE expenses_tbl SET expensebiller = ?, amount = ?, expense_desc = ? WHERE expense_no = ?`

        db.query(sql, [expense.expensebiller, parseFloat(expense.amount), expense.expensedesc, req.params.id], (error, results, fields) => {
            if (error) {
                req.flash('error', error)
                console.log('error')

                res.render('admin/expenses/edit', {
                    title: 'Perry in Disguise | Edit Expense',
                    moment: moment,
                    expenseno: expense.expenseno,
                    expensebiller: expense.expensebiller,
                    expensedate: expense.expensedate,
                    amount: expense.amount,
                    expensedesc: expense.expensedesc
                })
            } else {
                req.flash('success', 'Data updated successfully!')
                console.log('success');

                res.render('admin/expenses/edit', {
                    title: 'Perry in Disguise | Edit Expense',
                    moment: moment,
                    expenseno: expense.expenseno,
                    expensebiller: expense.expensebiller,
                    expensedate: expense.expensedate,
                    amount: expense.amount,
                    expensedesc: expense.expensedesc
                })
            }
        })
    } else {
        // Display errors to user
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)
        console.log('Error')

        res.render('admin/expenses/edit', {
            title: 'Perry in Disguise | Edit Expense',
            moment: moment,
            expenseno: req.params.id,
            expensebiller: req.body.expensebiller,
            expensedate: req.body.expensedate,
            amount: req.body.amount,
            expensedesc: req.body.expensedesc
        })
    }
})

router.delete('/expenses/delete/(:id)', function(req, res, next) {
    const db = require('../db.js')
    let sql = `UPDATE expenses_tbl SET is_deleted = ? WHERE expense_no = ?`

    db.query(sql, [1, req.params.id], (error, results, fields) => {
        if (error) {
            req.flash('error', error)

            res.redirect('/expenses')
        } else {
            req.flash('success', 'Expense deleted successfully! Reference No: ' + req.params.id)

            res.redirect('/expenses')
        }
    })
})

// Login - Register Routes

router.get('/login', function(req, res) {
    res.render('admin/login', {
        title: 'Perry in Disguise | Login',
        username: ''
    })
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login'
}))

router.get('/register', function(req, res) {
    res.render('admin/register', {
        title: 'Perry in Disguise | Register',
        lastname: '',
        firstname: '',
        username: ''
    })
})

router.post('/register', function(req, res, next) {
    req.assert('lastname', 'Last Name is required').notEmpty()
    req.assert('firstname', 'First Name is required').notEmpty()
    req.assert('username', 'Username is required').notEmpty()
    req.assert('password', 'Password is required').notEmpty()
    req.assert('repassword', 'Confirm Password is required').notEmpty()
    req.assert('repassword', 'Passwords does not match').equals(req.body.password)

    var errors = req.validationErrors()

    if (!errors) {
        var account = {
            lastname: req.sanitize('lastname').escape().trim(),
            firstname: req.sanitize('firstname').escape().trim(),
            username: req.sanitize('username').escape().trim(),
            password: req.sanitize('password').escape().trim()
        }

        bcrypt.hash(account.password, bcrypt.genSaltSync(10), null, function(err, hash) {
            // Store hash in your password DB.
            const db = require('../db.js')

            db.query(`INSERT INTO accounts_tbl(last_name, first_name, username, password, account_type) VALUES (?, ?, ?, ?, ?)`, [account.lastname, account.firstname, account.username, hash, 'admin'], function(error, results, fields) {
                if (error) throw error

                res.render('admin/login', {
                    title: 'Perry in Disguise | Login',
                    message: 'Registration complete, please login to continue!'
                })
            })
        })
    } else {
        var error_msg = ''
        errors.forEach(function(error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        res.render('admin/login', {
            title: 'Perry in Disguise | Register',
            lastname: req.body.lastname,
            firstname: req.body.firstname,
            username: req.body.username
        })
    }
})

// // Error 404 catcher
// router.use(function(req, res, next) {
//     res.render('admin/error-404', {
//         title: 'Perry in Disguise | Error 404 : Not Found'
//     })
// })
//
// // Error Handler
// router.use(function(err, req, res, next) {
//     // Set locals , only providing error in development
//     res.locals.message = err.message
//     res.locals.error = req.app.get('env') === 'development' ? err : {}
//
//     // Render the error page
//     res.status(err.status || 500)
//     res.render('admin/error-500', {
//         title: 'Perry in Disguise | Error 500 : Internal Server Error'
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

        res.redirect('/admin/login')
    }
}

module.exports = router;
