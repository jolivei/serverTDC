const { Router } = require('express');
const fs = require('fs');
const router = Router()
//const webpush = require("../webpush");
const pgdb = require('../pg/conpgtaberna');
//const passport = require('passport');
const encriptar = require('../passport/encript')
//let pushSubscripton;
const adfb = require('../firebase/firestore');
const dbfb = adfb.firestore()
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.send({res:'Usuario NO AUTENTICADO'})
    res.redirect('/')

}
router.post('/ajustesupdatetodo',isAuthenticated, async (req, res) => {
    let hashedPass = req.body.pass//'carola22'//req.body.pass
    console.log(hashedPass);
    console.log(req.body);
     let ajustesArray = []
    const ajustesCol = dbfb.collection('ajustes')
    const ajustesDoc=ajustesCol.doc(req.body.id)
    const actualizarDatos=await ajustesDoc.update({estableciniento:req.body.estableciniento,local:req.body.local,direccion:req.body.direccion, ciudad:req.body.ciudad,niflocal:req.body.niflocal})
    const ajustesData =await ajustesCol.get()
    ajustesData.forEach(ajuste => {
        const ajusteData = ajuste.data()
        ajusteData.idusuariofs = ajuste.id
        ajusteData.ciudad = ajusteData.ciudad.slice(-3)
        ajustesArray.push(ajusteData)
    })
    console.log(ajustesArray[0]);
    const saltRounds = 10
    try{
        const hash=await encriptar.encriptar(hashedPass + ajustesArray[0].ciudad,
        saltRounds)
        console.log(hash,'rr');
        await ajustesCol.doc(ajustesArray[0].idusuariofs).update({ pass: hash })
        res.send(true)
    }catch(e){
        console.log(e);
    } 
})

router.post('/actualizarsolad',isAuthenticated, async (req, res)=>{
    let soladdata=req.body.solad
    
    console.log(req.body);
    const ajustesCol = dbfb.collection('ajustes')
     const ajustesDoc=ajustesCol.doc(req.body.id)
    try{
        const actualizarDatos=await ajustesDoc.update({solad:soladdata})
        res.send(true)
    }catch(e){
        res.send(false)
    } 
    
})
router.post('/actualizarelegir',isAuthenticated, async (req, res)=>{
    let elegirdata=req.body.elegir
    
    
    console.log(req.body);
    const ajustesCol = dbfb.collection('ajustes')
     const ajustesDoc=ajustesCol.doc(req.body.id)
    try{
        const actualizarDatos=await ajustesDoc.update({elegir:elegirdata})
        res.send(true)
    }catch(e){
        res.send(false)
    } 
    
})
router.post('/actualizartodo', isAuthenticated,async function(req, res){
    let tododata=req.body.todo
    const ajustesCol = dbfb.collection('ajustes')
    const ajustesDoc=ajustesCol.doc(req.body.id)
    try{
        const actualizarDatos=await ajustesDoc.update({todo:tododata})
        res.send(true)
    }catch(e){
        res.send(false)
    }
    
})
router.post('/actualizarorigen', isAuthenticated,async function(req, res){
    let tododata=req.body.todo
    const ajustesCol = dbfb.collection('ajustes')
    const ajustesDoc=ajustesCol.doc(req.body.id)
    try{
        const actualizarDatos=await ajustesDoc.update({origen:tododata})
        res.send(true)
    }catch(e){
        res.send(false)
    }
    
})
router.post('/actualizarhorabc',isAuthenticated, async (req, res) => {
    console.log(req.body);
    let horabcdata=new Date(req.body.horabc)
    const ajustesCol = dbfb.collection('ajustes')
    const ajustesDoc=ajustesCol.doc(req.body.id)
    try{
        const actualizarDatos=await ajustesDoc.update({horabc:horabcdata})
        res.send(true)
    }catch(e){
        res.send(false)
    }
})
router.post('/actualizarhoracierre',isAuthenticated, async (req, res) => {
    console.log(req.body);
    let horacierredata=new Date(req.body.horacierre)
    const ajustesCol = dbfb.collection('ajustes')
    const ajustesDoc=ajustesCol.doc(req.body.id)
    try{
        const actualizarDatos=await ajustesDoc.update({horacierre:horacierredata})
        res.send(true)
    }catch(e){
        console.log(e);
        res.send(false)
    }
})


router.post('/updates1',isAuthenticated, async (req, res) => {
    console.log(req.body);
    let server1data=req.body.server1
    const ajustesCol = dbfb.collection('ajustes')
    const ajustesDoc=ajustesCol.doc(req.body.id)
    try{
        const actualizarDatos=await ajustesDoc.update({server1:server1data})
        res.send(true)
    }catch(e){
        console.log(e);
        res.send(false)
    }
})
router.post('/updates2',isAuthenticated, async (req, res) => {
    console.log(req.body);
    let server2data=req.body.server2
    const ajustesCol = dbfb.collection('ajustes')
    const ajustesDoc=ajustesCol.doc(req.body.id)
    try{
        const actualizarDatos=await ajustesDoc.update({server2:server2data})
        res.send(true)
    }catch(e){
        console.log(e);
        res.send(false)
    }
})
router.post('/updates3',isAuthenticated, async (req, res) => {
    console.log(req.body);
    let server3data=req.body.server3
    const ajustesCol = dbfb.collection('ajustes')
    const ajustesDoc=ajustesCol.doc(req.body.id)
    try{
        const actualizarDatos=await ajustesDoc.update({server3:server3data})
        res.send(true)
    }catch(e){
        console.log(e);
        res.send(false)
    }
})
router.get('/testingconexion1', async(req,res)=>{
    /* try{
        
        //const pdb=pgdb('localhost');
        //console.log(pdb);
        const resulta= await pgdb.one('select * from usuarios limit(1)')
        console.log(resulta,137);
    res.send(true)
    }catch(e){
        res.send(false)
    }  */
    
})

module.exports = router