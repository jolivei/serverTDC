const { Router } = require('express');
const fs = require('fs');
const router = Router()
const webpush = require("../webpush");
const pgdb = require('../pg/conpgtaberna');//local
const pgdbHeroku = require('../pg/conpgtabernaHeroku');//Heroku
const passport = require('passport');
const encriptar = require('../passport/encript')
let pushSubscripton;
const adfb = require('../firebase/firestore');
const dbfb = adfb.firestore()
const fetch=require('node-fetch')

const moment = require('moment');


/* router.post('/subscribete', passport.authenticate('local-subscripcion',{
  successRedirect:'/usuario',
  failureRedirect:'/',
  passReqToCallback:true
})) */
router.get('/isactive', async (req,res)=>{

    res.send({activo:true})
})
router.get('/testarfetch' ,async (req,res)=>{
     //res.redirect('/usuario')
     //const datos=await fetch('https://tabernasaid.duckdns.org/comandashistunmes')
     //const datosok=await datos.json()
     console.log('jjjjjjj')
     try{
    //const response = await fetch('https://github.com/');
    //const body = await response.text();
    //res.send(body)
    const datos=await fetch('https://tabernasaid.duckdns.org/comandashistunmes')
    const datosok=await datos.json()
    console.log(datosok);
    res.send(datosok)
     }
     catch(e){
         console.log(e)
     }
     
     
     //console.log(datosok)
     
})
router.get('/testarfetchgit' ,async (req,res)=>{
     
     console.log('jjjjjjj')
     try{
    const response = await fetch('https://api.github.com/users/github');
    const body = await response.json();
    res.send(body)
    //const datos=await fetch('https://tabernasaid.duckdns.org/comandashistunmes')
    //const datosok=await datos.json()
    //console.log(datosok);
    //res.send(datosok)
     }
     catch(e){
         console.log(e)
     }
     
     
     //console.log(datosok)
     
})
router.post('/subscribete'/* ,(req,res)=>{
     res.redirect('/usuario')
 } */
    , passport.authenticate('local-login'
        , {
            successRedirect: '/usuario',
            failureRedirect: '/',
            passReqToCallback: true
        })
)
router.get('/alta', isAuthenticated, (req, res) => {
    res.send('hola')
} /* ,passport.authenticate('local-subscripcion'
,{
 successRedirect:'/',
 failureRedirect:'/',
 passReqToCallback:true
}) */)

router.get('/usuario1', isAuthenticated, async (req, res, next) => {
    let usr = req.body.usuario
    console.log(req.body);
    res.render('newpass.ejs')
    try {
        /* const user = await pgdb.one('select * from usuarios where email=$1 ', [usr])
        //console.log(user,26);
        //res.send(user)
        //res.setHeader('Content-Type', 'text/html');
    
        if (user) {
          console.log('iiiiiiiiiiiiiiiiii');
          //res.send(user)
          res.render('usuario1.ejs')
          
        }
     */
        //res.send(path.join(__dirname,'../public/cuenta.html'))
        /* res.send(`<html> <body><h1> ${user} This page was render direcly from the server <p>Hello there welcome to my website</p></h1></body></html>`); */
        //res.send(path.join(__dirname,'../public/cuenta.html')) 
        //next()
    } catch (e) {
/*     console.log(e);
    res.render('index')
 */  }

    //res.send(path.join(__dirname,'../public/cuenta.html'))
    //res.render('cuenta')
    //next()


})

router.post("/usuario/subscription/:user", isAuthenticated, async (req, res) => {
    pushSubscripton = req.body;
    let iduser = req.params.user;
    //console.log(pushSubscripton, 74);

    let auth = pushSubscripton.keys.auth;
    let p256dh = pushSubscripton.keys.p256dh;
    let endpoint = pushSubscripton.endpoint;
    let expirationTime = pushSubscripton.expirationTime;

    //console.log(pushSubscripton.keys.auth, 61);
    fs.writeFileSync('subs.txt', JSON.stringify(pushSubscripton), (err) => {
        if (err) console.log(err);
        else console.log('subs saved');
    })
    let subs = []
    let subsPG = []
    let subsPGHeroku = []

    try {
        console.log('hola');
        //and endpoint=$4 and expirationTime=$5 [endpoint,expirationTime]
        const usunotiCol = dbfb.collection('usuariosnotificaciones')
        const filterfs = await usunotiCol.where('idusuariofb', '==', iduser).where('credenciales.keys.auth', '==', auth).where('credenciales.keys.p256dh', '==', p256dh).get()
        filterfs.forEach(el => {
            //console.log(el.data());
            subs.push(el.data(), el.id);
        })
        //console.log(subs, 73);
        if (subs.length == 0) {

            //console.log(insertado, 75);
            try {
                await dbfb.collection('usuariosnotificaciones').add({ idusuariopg: 5, idusuariofb: iduser, credenciales: pushSubscripton, created_at: new Date(), actualizado: new Date() })
            } catch (e) {
                console.log(e);

            }


        }
        try {
            subsPGHeroku = await pgdbHeroku.any("select * from (select idusu as idusuariofb, keys->>'auth' as auth , keys->>'p256dh' as p256dh,  endpoint, expirationTime from(  select (credenciales->>'keys')::jsonb as keys ,(credenciales->>'endpoint') as endpoint , (credenciales->>'expirationTime') as expirationTime,  idusuariofb as idusu from usuariosnotificaciones) as bb) as aa where  idusuariofb=$1 and  auth=$2 and p256dh= $3 ", [iduser, auth, p256dh])
            //console.log('subsPG',112);
        } catch (e) {
            console.log(e);
        }
        try {
            subsPG = await pgdb.any("select * from (select idusu as idusuariofb, keys->>'auth' as auth , keys->>'p256dh' as p256dh,  endpoint, expirationTime from(  select (credenciales->>'keys')::jsonb as keys ,(credenciales->>'endpoint') as endpoint , (credenciales->>'expirationTime') as expirationTime,  idusuariofb as idusu from usuariosnotificaciones) as bb) as aa where  idusuariofb=$1 and  auth=$2 and p256dh= $3 ", [iduser, auth, p256dh])
            //console.log('subsPG',112);
        } catch (e) {
            console.log(e);
        }
        if (subsPG == 0) {
            try {
                const insertado = await pgdb.one('insert into usuariosnotificaciones (idusuariopg,idusuariofb,credenciales,created_at,actualizado) values(5,$1,$2,$3,$4) returning *', [iduser, pushSubscripton, new Date(), new Date()]);
                res.status(201).json();

            }
            catch (err) {
                console.log(err, 86);

            }
        }
        if (subsPGHeroku == 0) {
            try {
                const insertado = await pgdbHeroku.one('insert into usuariosnotificaciones (idusuariopg,idusuariofb,credenciales,created_at,actualizado) values(5,$1,$2,$3,$4) returning *', [iduser, pushSubscripton, new Date(), new Date()]);
                res.status(201).json();

            }
            catch (err) {
                console.log(err, 86);

            }
        }
        //const tt=await pgdb.any('select * from  usuariosnotificaciones')
        //tt.forEach(async el=>{
        //    await dbfb.collection('usuariosnotificaciones').add(el)
        //})
        //await dbfb.collection('usuariosnotificaciones').add({idusuariopg:5,idusuariofb:iduser,credenciales:pushSubscripton,created_at:new Date(),actualizado:new Date()})

    } catch (e) {
        console.log(e, 79);
        /* 
        try {
            const insertado = await pgdb.one('insert into usuariosnotificaciones (idusuariopg,credenciales,created_at,actualizado) values($1,$2,$3,$4) returning *', [iduser, pushSubscripton, new Date(), new Date()]);
            res.status(201).json();
            console.log(insertado, 75);
            try{
                await dbfb.collection('usuariosnotificaciones').add({idusuariopg:iduser,credenciales:pushSubscripton,created_at:new Date(),actualizado:new Date()})
            }catch(e){
                console.log(e);
            }
        }
        catch (err) {
            console.log(err, 86);
        } */

    }



    // Server's Response



});
router.post('/newpass', isAuthenticated, (req, res) => {
    console.log(req.body);
    res.redirect('newpass')
})
router.get('/newpass', isAuthenticated, (req, res) => {
    res.render('newpass')
})
router.post("/new-message", async (req, res) => {
    const { message } = 'hola'// req.body;
    // Payload Notification
    const payload = JSON.stringify({
        title: "My Custom Notification",
        message
    });
    res.status(200).json();
    try {
        await webpush.sendNotification(pushSubscripton, payload);
    } catch (error) {
        console.log(error);
    }
});

async function send(message) {
    const payload = JSON.stringify({
        title: "My Custom Notification",
        message
    });

    try {
        await webpush.sendNotification(pushSubscripton, payload);
    } catch (error) {
        console.log(error);
    }

}
/* setTimeout(() => {
  send('hola')
  console.log('5s');
}, 10000) */

router.get('/detalleshist/:idcomanda', async (req, res, next) => {
    let idcomanda = req.params.idcomanda
    let idToken = req.headers.token
    let uidheader = req.headers.uid
    if (req.isAuthenticated()) {
        try {
            const detallehist = await pgdb.any('select * from detallescomandahist where idcomanda=$1', [idcomanda])
            console.log(detallehist);
            res.send(detallehist)
        } catch (e) {
            console.log(e);
        }
    }
    else if (idToken != undefined || idToken != null) {//||  idToken!=null || idToken!=''){

        adfb.auth().verifyIdToken(idToken)
            .then(async (decodedToken) => {
                const uid = decodedToken.uid;
                if (uid != uidheader) {
                    //console.log(uid);
                    //console.log(uidheader);
                    res.send('Token o identificacion NO VALIDOS ')
                } else {
                    try {
                        const detallehist = await pgdb.any('select * from detallescomandahist where idcomanda=$1', [idcomanda])
                        console.log(detallehist);
                        res.send(detallehist)
                    } catch (e) {
                        console.log(e);
                        res.send(e)
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


}


)
router.get('/comandashist', async (req, res, next) => {
    /* let idcomanda = req.params
    try {
        let ano = new Date().getFullYear()
        const comandashist = await pgdb.any('select  * from comandashist where EXTRACT(year from fechahora)=extract(year from now()) ')
        console.log(comandashist);
        res.send(comandashist)
    } catch (e) {
        console.log(e);
    } */
    let idToken = req.headers.token
    let uidheader = req.headers.uid

    //  console.log(idToken,165);
    if (req.isAuthenticated()) {
        try {
            let ano = new Date().getFullYear()
            const comandashist = await pgdb.any('select  * from comandashist where EXTRACT(year from fechahora)='+ano)//extract(year from now()) ')
            //console.log(comandashist);
            res.send(comandashist)
        } catch (e) {
            console.log(e);
        }
    }
    else if (idToken != undefined || idToken != null) {//||  idToken!=null || idToken!=''){

        adfb.auth().verifyIdToken(idToken)
            .then(async (decodedToken) => {
                const uid = decodedToken.uid;
                if (uid != uidheader) {
                    //console.log(uid);
                    //console.log(uidheader);
                    res.send('Token o identificacion NO VALIDOS ')
                } else {
                    let ano = new Date().getFullYear()
                    console.log('Token e identificacion VALIDOS');
                    const comandashist = await pgdb.any('select  * from comandashist where EXTRACT(year from fechahora)=$1 and eliminado=false ', [ano])
                    //console.log(comandashist);
                    console.log(comandashist);
                    res.send(comandashist)
                    // ...
                }

            })
            .catch((error) => {
                console.log(error);
                res.send(error.message)
            });
    } else {
        res.send('NO response')
    }

}



)
router.get('/comandashistsietedias', async function (req, res) {
    let dia = moment(new Date())
    startdate = dia.subtract(7, "days");
    let ulti7dias = startdate.format("YYYY-MM-DD") + ' 05:00'
    let idToken = req.headers.token
    let uidheader = req.headers.uid

    //  console.log(idToken,165);
    if (req.isAuthenticated()) {
        try {
            const comandashist7dias = await pgdb.any('select  * from comandashist where fechahora>=$1 and eliminado=false ', [ulti7dias])
            //console.log(comandashist);
            console.log(comandashist7dias);
            res.send(comandashist7dias)
        } catch (e) {
            console.log(e);
        }
    }
    else if (idToken != undefined || idToken != null) {//||  idToken!=null || idToken!=''){

        adfb.auth().verifyIdToken(idToken)
            .then(async (decodedToken) => {
                const uid = decodedToken.uid;
                if (uid != uidheader) {
                    //console.log(uid);
                    //console.log(uidheader);
                    res.send('Token o identificacion NO VALIDOS ')
                } else {
                    try {
                        const comandashist7dias = await pgdb.any('select  * from comandashist where fechahora>=$1 and eliminado=false ', [ulti7dias])
                        //console.log(comandashist);
                        console.log(comandashist7dias);
                        res.send(comandashist7dias)
                
                    } catch (error) {
                        console.log(error)
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
router.get('/comandashistunmes', async function (req, res) {
    let dia = moment(new Date())
    startdate = dia.subtract(1, "months");
    let ulti1mes = startdate.format("YYYY-MM-DD") + ' 05:00'
    console.log(ulti1mes);
    let idToken = req.headers.token
    let uidheader = req.headers.uid

    //  console.log(idToken,165);
    if (req.isAuthenticated()) {
        try {
            const comandashist1mes = await pgdb.any('select  * from comandashist where fechahora>=$1 and eliminado=false ', [ulti1mes])
            //console.log(comandashist);
           // console.log(comandashist7dias);
            res.send(comandashist1mes)
        } catch (e) {
            console.log(e);
        }
    }
    else if (idToken != undefined || idToken != null) {//||  idToken!=null || idToken!=''){

        adfb.auth().verifyIdToken(idToken)
            .then(async (decodedToken) => {
                const uid = decodedToken.uid;
                if (uid != uidheader) {
                    //console.log(uid);
                    //console.log(uidheader);
                    res.send('Token o identificacion NO VALIDOS ')
                } else {
                    try {
                        const comandashist1mes = await pgdb.any('select  * from comandashist where fechahora>=$1 and eliminado=false ', [ulti1mes])
                        //console.log(comandashist);
                        console.log(comandashist1mes);
                        res.send(comandashist1mes)
                
                    } catch (error) {
                        console.log(error)
                    }
                }

            })
            .catch((error) => {
                console.log(error);
                res.send(error.message)
            });
    } else {
        //res.send('NO response')
        try {
            const comandashist1mes = await pgdb.any('select  * from comandashist where fechahora>=$1 and eliminado=false ', [ulti1mes])
            //console.log(comandashist);
           // console.log(comandashist7dias);
            res.send(comandashist1mes)
        } catch (e) {
            console.log(e);
        }
    }


})
router.get('/comandashisttodas', async (req, res, next) => {
    let idcomanda = req.params
    try {
        let ano = new Date().getFullYear()
        const comandashist = await pgdb.any('select * from comandashist')
        console.log(comandashist);
        res.send(comandashist)
    } catch (e) {
        console.log(e);
    }
}



)
router.delete('/borrarcomanda/:idcomanda', async (req, res) => {
    let idcomanda = req.params.idcomanda
    let idToken = req.headers.token
    let uidheader = req.headers.uid

    //  console.log(idToken,165);
    if (req.isAuthenticated()) {
        try {
            const comandaDelete = await pgdb.any('delete from comandashist where idcomanda=$1 RETURNING *', [idcomanda])
            const detallesDelete = await pgdb.any('delete from detallescomandahist where idcomanda=$1 RETURNING *', [idcomanda])

            res.json({ comanda: comandaDelete, detalles: detallesDelete })
        } catch (err) {
            console.log(err);
            res.send(err)
        }
    } else if (idToken != undefined || idToken != null) {//||  idToken!=null || idToken!=''){

        adfb.auth().verifyIdToken(idToken)
            .then(async (decodedToken) => {
                const uid = decodedToken.uid;
                if (uid != uidheader) {
                    //console.log(uid);
                    //console.log(uidheader);
                    res.send('Token o identificacion NO VALIDOS ')
                } else {
                    try {
                        //const comandaDelete = await pgdb.any('delete from comandashist where idcomanda=$1 RETURNING *', [idcomanda])
                        let fechaeliminado=new Date()
                        const comandaDelete = await pgdb.any('update comandashist set eliminado=true ,fechaeliminado=$1  where idcomanda=$2 RETURNING *', [fechaeliminado,idcomanda])

                        //const detallesDelete = await pgdb.any('delete from detallescomandahist where idcomanda=$1 RETURNING *', [idcomanda])
                        const detallesDelete = await pgdb.any('update  detallescomandahist set eliminado=true ,fechaeliminado=$1  where idcomanda=$2 RETURNING *', [fechaeliminado,idcomanda])

                        res.json({ comanda: comandaDelete, detalles: detallesDelete })
                    } catch (err) {
                        console.log(err);
                        res.send(err)
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

router.put('/actualizarcomandahist/:idpg', async (req, res) => {
    let idcomanda = req.params.idpg
    let facturado = req.body.facturado
    let visa = req.body.visa
    let idToken = req.headers.token
    let uidheader = req.headers.uid

    //  console.log(idToken,165);
    if (req.isAuthenticated()) {
        try {
            let datosactualizado = await pgdb.any('update comandashist set facturado =$1,visa=$2 where idcomhistpg=$3 returning *', [facturado, visa, idcomanda])
            //let datosactualizado=await pgdb.any(' select * from comandashist where idcomhistpg=$1 ', [idcomanda])
            res.send(datosactualizado)
        } catch (e) {
            console.log(e);
        }

    }
    else if (idToken != undefined || idToken != null) {//||  idToken!=null || idToken!=''){

        adfb.auth().verifyIdToken(idToken)
            .then(async (decodedToken) => {
                const uid = decodedToken.uid;
                if (uid != uidheader) {
                    //console.log(uid);
                    //console.log(uidheader);
                    res.send('Token o identificacion NO VALIDOS ')
                } else {
                    try {
                        let datosactualizado = await pgdb.any('update comandashist set facturado =$1,visa=$2 where idcomhistpg=$3 returning *', [facturado, visa, idcomanda])
                        //let datosactualizado=await pgdb.any(' select * from comandashist where idcomhistpg=$1 ', [idcomanda])
                        res.send(datosactualizado)
                    } catch (e) {
                        console.log(e);
                        res.send(e)
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

router.get('/usuario', isAuthenticated, (req, res) => { // 
    //console.log(req.session.passport.user.idusuariopg, 129)
    //${req.session.passport.user.idusuariopg}
    //req.isAuthenticated()
    /*  res.send(`<head>
   <meta charset="UTF-8">
   <meta http-equiv="X-UA-Compatible" content="IE=edge">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet"
       integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
 </head>
 
 <input type="text" id="iduser" value="${req.session.passport.user.idusuariopg}">
    <div class="container">
   <div class="row">
       <div id="col"  class="col-sm-8 col-md-6 col-lg-4 mx-auto">
           <h1>Bienvenido</h1>
           <div class="card  mt-4 text-center">
               <div class="card-header text-white bg-dark">
                   Para recibir notificaciones pincha en permitir
       
               </div>
               <div class="card-body bg-light">
                   <form class="mt-5" action="/logout" method="post">
                       <button class="btn btn-dark" type="submit">Logout</button>
                   </form>
               </div>
               <div id="botonalta" class=" mt-4 text-center">
               <div class="row">
 
                   <div class="col-12">
                   <form class="mt-5" action="/newpass" method="get">
                       <button class="btn btn-dark" type="submit">Cambiar password1</button>
                   </form>
                   <form class="mt-5" action="/changeajustesfb" method="get">
                       <button class="btn btn-dark" type="submit">Ajustes</button>
                   </form>
                     </div>
                       <div class="mt-2 col-12"><button class="btn btn-dark" id="message">
                           Nuevo mensaje
                       </button></div>
                       hola
               </div>
           </div>
           </div>
       </div>    
   </div>
 </div>
 <script type="text/javascript" src="cuenta.js"></script> 
 ` ) */
    if (req.session.views) {
        res.render('usuario', { session: req.session })
        console.log(req.session);
    } else {
        req.session.views = 1
        res.render('usuario', { session: req.session })

    }

})
router.get('/', (req, res) => {
    res.render('index')
})
function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/')

}
router.post('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

router.get('/altausuario', (req, res) => {
    console.log('alta');
    res.render('altausuario')
})
router.post('/pgchangeuserpass', isAuthenticated, async (req, res) => {
    let reqiduser = req.session.passport.user.id
    let usuario = req.body.usuario;
    let repcontrasena = req.body.repcontrasena;
    let contrasena = req.body.contrasena
    console.log(usuario, repcontrasena, contrasena);
    if (repcontrasena != contrasena) return
    console.log(req.session.passport.user, 324);
    try {
        /* const user = await pgdb.one('select * from usuarios where email=$1  ', [usuario])
        console.log(user); */
        const user = await pgdbHeroku.one('select * from usuarios where email=$1 and idusuariofs=$2 ', [usuario, reqiduser])
        let iduser = user.idusuariopg
        let hashedPass = await encriptar.encriptar(contrasena)
        const userCol = dbfb.collection('usuarios')
        const userDoc = await userCol.where('uid', '==', req.session.passport.user.uid).get()
        let userArray = []
        userDoc.forEach(el => {
            const idfb = el.id
            userArray.push({ id: idfb })
        })
        console.log(userArray);
        if (hashedPass) {
            const newpass = await pgdb.one('update usuarios set pass=$1 where idusuariopg=$2 returning*', [hashedPass, iduser])
            const newpassHeroku = await pgdbHeroku.one('update usuarios set pass=$1 where idusuariopg=$2 returning*', [hashedPass, iduser])
            const newUserPass = await userCol.doc(userArray[0].id).update({ pass: hashedPass })
            console.log(newpass.pass, newpassHeroku.pass);
            req.logout()
            res.redirect('/')

        } else {
            res.redirect('/newpass')
        }


    } catch (err) {
        console.log(err);
        res.redirect('/newpass')
    }

    //req.logout()

})
router.get('/changeajustesfb', isAuthenticated
    , async (req, res) => {
        console.log(req.session);
        let ajustesArray = [{
            niflocal: '76863770R',
            ciudad: 'Cambados',
            todo: false,
            solad: true,
            nu: 1,
            local: 'Carolina Vila Ribadomar',
            server3: 'http://192.168.1.132:3000',
            server2: 'http://192.168.1.132:3000',
            server1: 'https://tabernada.herokuapp.com',
            direccion: 'San Gregorio 2',
            pass: '',
            estableciniento: 'Taberna da Calzada',
            idusuariofs: '64loWobvunc6kuzm2tK2',
            horacierre: new Date(),
            horabc: new Date()
        }]
        const ajustesCol = dbfb.collection('ajustes')
        const ajustesData = await ajustesCol.get()
        ajustesData.forEach(ajuste => {
            const ajusteData = ajuste.data()
            ajusteData.idusuariofs = ajuste.id
            ajusteData.pass = ''

            ajusteData.horacierre = ajuste.data().horacierre.toDate()
            ajusteData.horabc = ajuste.data().horabc.toDate()



            ajustesArray.push(ajusteData)
        })
        /* const ajustesCol = dbfb.collection('ajustes')
        const ajustesData = await ajustesCol.get()
        ajustesData.forEach(el=>{
             let solad=el.data().solad
            let todo=el.data().todo 
    
            let ciudad=el.data().ciudad
            let nu=el.data().nu
            let id=el.id
            let niflocal=el.data().niflocal
            let server1 =el.data().server1
            let server2 =el.data().server2
            let server3 =el.data().server3
            let local=el.data().local
            let direccion=el.data().direccion
            let estableciniento=el.data().estableciniento
            let idusuariofs=el.id
            let horacierre= new Date()
            let horabc=new Date()
            ajustesArray.push({niflocal,ciudad,nu,server3,server1,server2,id,solad,todo,local,direccion,estableciniento, idusuariofs,horacierre,horabc})
        }) */
        console.log(ajustesArray)

        res.render('ajustesp', { ajustes: ajustesArray[1] })
        //res.send('jjjjj')
    })




module.exports = router
