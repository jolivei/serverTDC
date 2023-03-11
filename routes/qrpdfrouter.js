const pgdb = require('../pg/conpgtaberna')
const pgp = require('pg-promise')({
    /*initialization options */
    capSQL: true // capitalize all generated SQL
});
const { Router } = require('express')
const router = Router()
router.get('/qrcodepdf', (req,res)=>{
    res.render('qrpdf')
})