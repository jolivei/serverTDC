const { Router } = require('express');
//const bcrypt=require('bcrypt')
const bcrypt = require('bcrypt')

const router = Router()
const admin = require('../firebase/firestore')
const db = admin.firestore()
//const auth = admin.auth()





router.get('/ajustes', async (req, res) => {
    console.log(req.headers);
    let uid = req.headers.uid

    if (req.isAuthenticated()) {
        console.log('isAuthenticated');
        let ajustesArray = []
        const ajustesCol = db.collection('ajustes')
        const ajustesData = await ajustesCol.get()
        ajustesData.forEach(ajuste => {
            const ajusteData = ajuste.data()
            ajusteData.idusuariofs = ajuste.id
            ajustesArray.push(ajusteData)
        })
        res.send(ajustesArray)

    } /* else if (!req.isAuthenticated() && uid !== undefined || !req.isAuthenticated() && uid !== null || !req.isAuthenticated() && uid !== '' ) {
        try { 
            const user = await admin.auth().getUser(uid)
            console.log(user);
            if (user.disabled==false) {
                let ajustesArray = []
                const ajustesCol = db.collection('ajustes')
                const ajustesData = await ajustesCol.get()
                ajustesData.forEach(ajuste => {
                    const ajusteData = ajuste.data()
                    ajusteData.idusuariofs = ajuste.id
                    ajustesArray.push(ajusteData)
                })
                res.send(ajustesArray)
            }
            else{
                res.redirect('/usuario') 
            }
        } catch (error) {
            res.redirect('/usuario')
        }



    } */
    else {
        res.redirect('/usuario')
    }
    //let hashedPass = 'carola22' + 'Ca' //req.body.pass
    /*  const saltRounds=10
    /*  bcrypt.hash(hashedPass, saltRounds, async function(err, hash) {
         //await ajustesCol.doc(ajustesArray[0].idusuariofs).update({pass:hash})
         
     }); 
     const match = await bcrypt.compare(hashedPass, ajustesArray[0].pass);
         if(match)        res.send(hashedPass)
         else{
             res.send('NOOOOOO')
         } */

})
router.post('/usuario', (req, res, next) => {
    console.log(req.body);
    res.render('usuario.ejs')
    next()
})
router.get('/testingconexion', (req, res) => {
    res.send(true)
})
router.post('/ajustesupdatepass', async (req, res) => {
    let hashedPass = req.body.pass
    let idajuste = req.body.id//'carola22'//req.body.pass
    let idToken = req.headers.token
    let uidheader = req.headers.uid
    const ajustesCol = db.collection('ajustes')
    if (req.isAuthenticated()) {
        const ajustesData = await ajustesCol.doc(idajuste).get()
        let ajuste = ajustesData.data()
        ajuste.ciudad = ajuste.ciudad.slice(-3)
        const saltRounds = 10
        try {
            const hash = await bcrypt.hash(hashedPass + ajuste.ciudad, saltRounds)
            console.log(hash, 'rr');
            await ajustesCol.doc(idajuste).update({ pass: hash })
            res.send(true)
        } catch (e) {
            console.log(e);
            res.send(e)
        }

    } else if (idToken != undefined || idToken != null) {
        admin.auth().verifyIdToken(idToken)
            .then(async (decodedToken) => {
                const uid = decodedToken.uid;
                if (uid != uidheader) {
                    //console.log(uid);
                    //console.log(uidheader);
                    res.send('Token o identificacion NO VALIDOS ')
                } else {
                    const ajustesData = await ajustesCol.doc(idajuste).get()
                    let ajuste = ajustesData.data()
                    ajuste.ciudad = ajuste.ciudad.slice(-3)
                    const saltRounds = 10
                    try {
                        const hash = await bcrypt.hash(hashedPass + ajuste.ciudad, saltRounds)
                        console.log(hash, 'rr');
                        await ajustesCol.doc(idajuste).update({ pass: hash })
                        res.send(true)
                    } catch (e) {
                        console.log(e);
                        res.send(e)
                    }

                }
            }).catch((error) => {
                console.log(error);
                res.send(error.message)
            });
    } else {
        res.send('NO response')
    }

})

router.post('/checkajustespass', async (req, res) => {
    let hashedPass = req.body.pass
    let idToken = req.headers.token
    let uidheader = req.headers.uid
    console.log(109);
    let ajustesArray = []
    const ajustesCol = db.collection('ajustes')
    if (req.isAuthenticated()) {
        const ajustesData = await ajustesCol.get()
        ajustesData.forEach(ajuste => {
            const ajusteData = ajuste.data()
            ajusteData.idusuariofs = ajuste.id
            ajusteData.ciudad = ajusteData.ciudad.slice(-3)
            ajustesArray.push(ajusteData)
        })
        console.log(ajustesArray);
        const saltRounds = 10
        const match = await bcrypt.compare(hashedPass + ajustesArray[0].ciudad, ajustesArray[0].pass);
        if (match) res.send(true)
        else {
            res.send(false)
        }

    } else if (idToken != undefined || idToken != null) {
        admin.auth().verifyIdToken(idToken)
            .then(async (decodedToken) => {
                const uid = decodedToken.uid;
                if (uid != uidheader) {
                    //console.log(uid);
                    //console.log(uidheader);
                    res.send('Token o identificacion NO VALIDOS ')
                } else {
                    const ajustesData = await ajustesCol.get()
                    ajustesData.forEach(ajuste => {
                        const ajusteData = ajuste.data()
                        ajusteData.idusuariofs = ajuste.id
                        ajusteData.ciudad = ajusteData.ciudad.slice(-3)
                        ajustesArray.push(ajusteData)
                    })
                    console.log(ajustesArray);
                    const saltRounds = 10
                    const match = await bcrypt.compare(hashedPass + ajustesArray[0].ciudad, ajustesArray[0].pass);
                    if (match) res.send(true)
                    else {
                        res.send(false)
                    }



                }

            })
            .catch((error) => {
                console.log(error);
                res.send(error.message)
            });
    } else {
        res.send('NO response')
    }
})





router.get('/getajustes', isAuthenticated, async (req, res) => {
    let ajustesArray = []
    const ajustesCol = db.collection('ajustes')
    const ajustesData = await ajustesCol.get()
    ajustesData.forEach(el => {
        /*  let solad=el.data().solad
         let todo=el.data().todo */

        let ciudad = el.data().ciudad
        let nu = el.data().nu
        let id = el.id

        let web = el.data().web
        ajustesArray.push({ ciudad, nu, web, id })
    })
    console.log(ajustesArray);
    res.send(ajustesArray[0])
})
router.get('/ajustes/:id', isAuthenticated, async (req, res) => {
    let idajuste = req.params.id
    let data = req.body
    console.log(idajuste, data);
})
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/')

}





module.exports = router