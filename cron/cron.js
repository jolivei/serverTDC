const cron = require('node-cron')
//const dotenv = require('dotenv');
//dotenv.config();
//const localserver = process.env.localserver
const moment = require('moment')
const funciones = require('./backups')
const ptoken = process.env.ptoken
const userTk = process.env.USTK
const fetch = require('node-fetch')
const jwt = require('jsonwebtoken')
const webpush = require('../webpush')
const pgdb = require('../pg/conpgtaberna');
const fs = require('fs')

const tokentelegraf = process.env.tokentelegraf

const adfb = require('../firebase/firestore');
const { start } = require('repl')
const dbfb = adfb.firestore()
const doc = dbfb.collection("ajustes")
const horabcCollection = dbfb.collection("horabc")
const resultbcCollection = dbfb.collection("resultadobc")
let iniciobc = new Date()
let iniciocierre = new Date()

let arrayScheduleBc = []
let arrayScheduleCierre = []
async function getIDhoraBc() {
    let idArray = []
    const idhorabcCollecction = await horabcCollection.get()
    idhorabcCollecction.forEach(el => {
        const id = el.id
        idArray.push(id)
    })
    return idArray[0]
}
async function getIDresultadoBc() {
    let idArray = []
    const idresultadobcCollecction = await resultbcCollection.get()
    idresultadobcCollecction.forEach(el => {
        const id = el.id
        idArray.push(id)
    })
    return idArray[0]
}

//console.log(idhorabcCollecction);
console.log(process.env.localserver);
let arrayAjustes = []
const observer = doc.onSnapshot(async docSnapshot => {

    /* const idhorabc = await  getIDhoraBc()
    const idresultadobc =await  getIDresultadoBc() */

    docSnapshot.forEach(async snapshot => {
        let origen = snapshot.data().origen

        if (iniciobc == new Date(snapshot.data().horabc.toDate()) && iniciocierre == new Date(snapshot.data().horacierre.toDate())) return
        console.log(iniciobc, iniciocierre, new Date(), 'kkkkkkkkkkkkkkkkk');
        if (origen == 'remoto') return

        let ninutosbc = new Date(snapshot.data().horabc.toDate()).getMinutes()
        let horabc = new Date(snapshot.data().horabc.toDate()).getHours()

        let scheduleBc = cron.schedule(`${ninutosbc} ${horabc} * * *`, async () => {

            console.log(horabc, ninutosbc);
            let token = jwt.sign({
                user: userTk,
            }, ptoken, { expiresIn: '60s' });
            const idhorabc = await getIDhoraBc()

            await horabcCollection.doc(idhorabc).update({ bccomandas: new Date() })
            let henvio = moment()
            await enviarSubs('SE INICIA BACKUP LOCAL Y REMOTE', `    En 1 minuto se verificara si se hizo el  backup, ${henvio.format("DD-MM-YYYY HH:mm:ss")}`)
            

            setTimeout(async () => {
                try {
                    const backLR = await pgdb.one('select horabackup from horabackup where idbackup=1')
                    console.log(backLR, henvio);
                    console.log(moment(new Date(backLR.horabackup)));
                    var isafter = moment(new Date(backLR.horabackup)).isAfter(henvio);
                    console.log(isafter);
                    if (isafter == true) await enviarSubs('SE HIZO BACKUP LOCAL Y REMOTE', `${moment().format("DD-MM-YYYY HH:mm")}`)
                    else await enviarSubs('FALLO BACKUP LOCAL Y REMOTE', `${moment().format("DD-MM-YYYY HH:mm")}`)
                } catch (error) {
                    console.log(error, 89);
                }




            }, 1000 * 60 * 2.5)



            //const resbackuppost = await fetch(`http://${localserver}/backuppostgres`, {headers: {'Accept': 'application/json', 'token':token},})
            /*  const resbackuppost = await fetch(`${server2}/backuppostgres`, { headers: { 'Accept': 'application/json', 'token': token }, })
             const databackuppost = await resbackuppost.json();
             if (databackuppost) await enviarSubs(`Hola, El  ${new Date()} se hizo backup en LOCAL y REMOTE server`)
             console.log(databackuppost);*/
        })
        arrayScheduleBc.push({ sc: scheduleBc })
        //init CRON
        if (iniciobc != new Date(snapshot.data().horabc.toDate()) && arrayScheduleBc.length == 1) {
            console.log(iniciobc, 116);
            arrayScheduleBc[0].sc.start()
            iniciobc = new Date(snapshot.data().horabc.toDate())
        }
        //next REARRANGE ARRAY CRON 
        if (iniciobc != new Date(snapshot.data().horabc.toDate()) && arrayScheduleBc.length > 1) {
            
            let format='hh:mm:ss'
            let actual=new Date(snapshot.data().horabc.toDate())
            let now5 = moment(actual, format).add(10, 'minute')
            let now_5 = moment(actual, format).subtract(6, 'minute')
            let iniciomoment = moment(iniciobc, format)
            console.log(now_5,iniciomoment, now5, 110);
            
            if(iniciomoment.isBetween(now_5,now5)){
                console.log('no margen');
                //return
            }

            arrayScheduleBc[arrayScheduleBc.length - 2].sc.destroy()
            arrayScheduleBc[arrayScheduleBc.length - 1].sc.start()
            iniciobc = new Date(snapshot.data().horabc.toDate())
            arrayScheduleBc.shift()
        }
        //console.log(arrayScheduleBc, 113);



        arrayAjustes.push(snapshot.data())
        console.log(arrayAjustes.length, 61);
        if (arrayAjustes.length > 1) {
            arrayAjustes = []
            arrayAjustes.push(snapshot.data())
        }

        let ninutos = new Date(snapshot.data().horacierre.toDate()).getMinutes()
        let hora = new Date(snapshot.data().horacierre.toDate()).getHours()
        let chatid = snapshot.data().chatid
        console.log(hora);

        console.log(hora);
        //if(origen=='remoto') return






        //.update({bccomandas:new Date()})
        /*         console.log(userTk,ptoken,31);
                let token= jwt.sign({
                    user: userTk,
                    }, ptoken, {expiresIn:'60s'}); 
                const ff1=await fetch(`http://epimast.duckdns.org:3000/ajustes`,{headers: {'Accept': 'application/json', 'token':token},})
                //const resff1=await ff1.json()
                //console.log(resff1);*/
        //awake Heroku

        let time = moment(new Date(snapshot.data().horacierre.toDate()))
        let timeFive = time.subtract(5, 'minute')
        let timeFiveMinutos = timeFive.format()
        let scheduleCierre = cron.schedule(`${ninutos} ${hora} * * *`, async () => {
            //console.log('ver ',new Date());
            let henvio=moment()
            console.log(ninutos, 'ver');
            let token = jwt.sign({
                user: userTk,
            }, ptoken, { expiresIn: '600s' });
            //const comandasbc = await horabcCollection.doc(idhorabc).update({ bccomandas: new Date() })
            const simulado=await funciones.simuladoReal() 
            if(simulado.length==0) {
                let mensaje=`NO Habia facturas simplificadas por guardar', ${henvio.format("DD-MM-YYYY HH:mm:ss")}`
                await funciones.sendMessageBot(tokentelegraf, chatid, mensaje)
                await enviarSubs('NO Habia facturas simplificadas por guaradar', `${henvio.format("DD-MM-YYYY HH:mm:ss")}`)
            } 
            else {

                let mensaje=`Se guardaron',  ${simulado.length} COMANDAS SIMULADAS, ${henvio.format("DD-MM-YYYY HH:mm:ss")}`
                await funciones.sendMessageBot(tokentelegraf, chatid, mensaje)
                await enviarSubs('Se guardaron', ` ${simulado.length} COMANDAS SIMULADAS, ${henvio.format("DD-MM-YYYY HH:mm:ss")}`)
            } 
            
            setTimeout(async () => {
                horabc
                const backupComandasFallidas = await funciones.backupComandasFallidas()

                if (backupComandasFallidas == true) {

                    let mensaje = `Hola, El  ${moment().format("DD-MM-YYYY HH:mm:ss")} No hay comandas ACTIVAS sin guardar`
                    await enviarSubs('backupComandasFallidas', mensaje)
                    await funciones.sendMessageBot(tokentelegraf, chatid, mensaje)

                }
                else if (backupComandasFallidas.resultado == 'saved-deleted') {
                    let mensaje = `Hola, El  ${moment().format("DD-MM-YYYY HH:mm:ss")} Se guardaron y borraron las comandas ACTIVAS `
                    await enviarSubs('backupComandasFallidas', mensaje)
                    await funciones.sendMessageBot(tokentelegraf, chatid, mensaje)

                }
                else if (backupComandasFallidas.resultado == 'text-saved') {


                    let mensaje = `Hola, El  ${moment().format("DD-MM-YYYY HH:mm:ss")} Se guardaron y backup en texto de  las comandas ACTIVAS `
                    await enviarSubs('backupComandasFallidas')
                    await funciones.sendMessageBot(tokentelegraf, chatid, mensaje)
                }


                else if (backupComandasFallidas == false) {

                    let mensaje = `Hola, El  ${moment().format("DD-MM-YYYY HH:mm:ss")} Algo fallo guardando las comandas ACTIVAS `
                    await enviarSubs('backupComandasFallidas', mensaje)
                    await funciones.sendMessageBot(tokentelegraf, chatid, mensaje)


                }

                //const comandasbc = await horabcCollection.doc(idhorabc).update({ bccomandas: new Date() })

                //const backupComandasFallidas = await fetch(`http://${localserver}/backupComandasFallidas`)

                // const backupComandasFallidas = await fetch(`${server2}/backupComandasFallidas`, {headers: {'Accept': 'application/json', 'token':token},})
                //const datafailconandas = await backupComandasFallidas.json();
                //if (datafailconandas == true) await enviarSubs(`Hola, El  ${new Date()} No hay comandas //ACTIVAS sin guardar`)
                //else if (datafailconandas.resultado == 'saved-deleted') await enviarSubs(`Hola, El  ${new Date//()} Se guardaron y borraron las comandas ACTIVAS `)
                //else if (datafailconandas.resultado == 'text-saved') await enviarSubs(`Hola, El  ${new Date()//} Se guardaron y backup en texto de  las comandas ACTIVAS `)
                //else if (datafailconandas == false) await enviarSubs(`Hola, El  ${new Date()} Algo fallo //guardando las comandas ACTIVAS `)
                //console.log(datafailconandas);
            }, 1000)
            setTimeout(async () => {
                const backupDetallesFallidos = await funciones.backupDetallesFallidos()

                if (backupDetallesFallidos == true) {

                    let mensaje = `Hola, El  ${moment().format("DD-MM-YYYY HH:mm:ss")} No hay DETALLES comandas ACTIVAS sin guardar`
                    await enviarSubs('backupDetallesFallidos', mensaje)
                    await funciones.sendMessageBot(tokentelegraf, chatid, mensaje)


                }
                else if (backupDetallesFallidos.resultado == 'saved-deleted') {

                    let mensaje = `Hola, El  ${moment().format("DD-MM-YYYY HH:mm:ss")} Se guardaron y borraron los DETALLES DE  comandas ACTIVAS `
                    await enviarSubs('backupDetallesFallidos', mensaje)
                    await funciones.sendMessageBot(tokentelegraf, chatid, mensaje)

                }
                else if (backupDetallesFallidos.resultado == 'text-saved') {
                    let mensaje = `Hola, El  ${moment().format("DD-MM-YYYY HH:mm:ss")} Se guardaron y backup en texto   los DETALLES de comandas ACTIVAS `
                    await enviarSubs('backupDetallesFallidos', mensaje)
                    await funciones.sendMessageBot(tokentelegraf, chatid, mensaje)

                }
                else if (backupDetallesFallidos == false) {

                    let mensaje = `Hola, El  ${moment().format("DD-MM-YYYY HH:mm:ss")} Algo fallo guardando los DETALLES de comandas ACTIVAS `
                    await enviarSubs('backupDetallesFallidos', mensaje)
                    await funciones.sendMessageBot(tokentelegraf, chatid, mensaje)

                }
                //        const detallesbc = await horabcCollection.doc(idhorabc).update({ bcdetalles: new Date() })

                //const backupDetallesFallidos = await fetch(`http://${localserver}/backupDetallesFallidos`)

            }, 60 * 1000)
            setTimeout(async () => {
                const backupComandasHist = await funciones.backupComandasHist()
                if (backupComandasHist == true) {

                    let mensaje = `Hola, El  ${moment().format("DD-MM-YYYY HH:mm:ss")} No hay comandas HISTORICAS para guardar`
                    await enviarSubs('backupComandasHist', mensaje)
                    await funciones.sendMessageBot(tokentelegraf, chatid, mensaje)

                }
                else if (backupComandasHist.resultado == 'saved-deleted') {
                    let mensaje = `Hola, El  ${moment().format("DD-MM-YYYY HH:mm:ss")} Se guardaron y borraron las comandas HISTORICAS `
                    await enviarSubs('backupComandasHist', mensaje)
                    await funciones.sendMessageBot(tokentelegraf, chatid, mensaje)
                } else if (backupComandasHist.resultado == 'text-saved') {
                    let mensaje = `Hola, El  ${moment().format("DD-MM-YYYY HH:mm:ss")} Se guardaron y backup en texto de  las comandas HISTORICAS `

                    await enviarSubs('backupComandasHist', mensaje)
                    await funciones.sendMessageBot(tokentelegraf, chatid, mensaje)

                }
                else if (backupComandasHist == false) {
                    let mensaje = `Hola, El  ${moment().format("DD-MM-YYYY HH:mm:ss")} Algo fallo guardando las  comandas HISTORICAS `
                    await enviarSubs('backupComandasHist', mensaje)
                    await funciones.sendMessageBot(tokentelegraf, chatid, mensaje)


                }

                //const historicasbc = await horabcCollection.doc(idhorabc).update({ bchistoricas: new Date() })

                //const backupComandasHist = await fetch(`http://${localserver}/backupComandasHist`)

            }, 2 * 60 * 1000)

            setTimeout(async () => {
                const backupDetallesHist = await funciones.backupDetallesHist()
                if (backupDetallesHist == true) {
                    let mensaje = `Hola, El  ${moment().format("DD-MM-YYYY HH:mm:ss")} No hay DETALLES  de comandas HISTORICAS para guardar`
                    await enviarSubs('backupDetallesHist', mensaje)
                    await funciones.sendMessageBot(tokentelegraf, chatid, mensaje)

                } else if (backupDetallesHist.resultado == 'saved-deleted') {
                    let mensaje = `Hola, El  ${moment().format("DD-MM-YYYY HH:mm:ss")} Se guardaron y borraron los DETALLES de comandas HISTORICAS `
                    await enviarSubs('backupDetallesHist', mensaje)
                    await funciones.sendMessageBot(tokentelegraf, chatid, mensaje)

                } else if (backupDetallesHist.resultado == 'text-saved') {
                    let mensaje = `Hola, El  ${moment().format("DD-MM-YYYY HH:mm:ss")} Se guardaron y backup en texto de  los DETALLES de comandas HISTORICAS `
                    // await enviarSubs('backupDetallesHist', mensaje)
                    await funciones.sendMessageBot(tokentelegraf, chatid, mensaje)
                }
                else if (backupDetallesHist == false) {
                    let mensaje = `Hola, El  ${moment().format("DD-MM-YYYY HH:mm:ss")} Algo fallo guardando las  DETALLES de comandas HISTORICAS `
                    await enviarSubs('backupDetallesHist', mensaje)
                    await funciones.sendMessageBot(tokentelegraf, chatid, mensaje)
                }
                //     const aaa = await horabcCollection.doc(idhorabc).update({ bccomandas: new Date() })

                //const backupDetallesHist = await fetch(`http://${localserver}/backupDetallesHist`)
            }, 3 * 60 * 1000)

        })
        arrayScheduleCierre.push({ sc: scheduleCierre })
        if (iniciocierre != new Date(snapshot.data().horacierre.toDate()) && arrayScheduleCierre.length == 1) {
            console.log(iniciocierre, 116);
            arrayScheduleCierre[0].sc.start()
            iniciocierre = new Date(snapshot.data().horacierre.toDate())
        }
        //next REARRANGE ARRAY CRON 
        if (iniciocierre != new Date(snapshot.data().horacierre.toDate()) && arrayScheduleCierre.length > 1) {
            let format='hh:mm:ss'
            let actual=new Date(snapshot.data().horacierre.toDate())
            let now5 = moment(actual, format).add(10, 'minute')
            let now_5 = moment(actual, format).subtract(6, 'minute')
            let iniciomoment = moment(iniciocierre, format)
            console.log(now_5,iniciomoment, now5, 110);
            
            if(iniciomoment.isBetween(now_5,now5)){
                console.log('no margen cierre');
                //return
            }
            arrayScheduleCierre[arrayScheduleCierre.length - 2].sc.destroy()
            arrayScheduleCierre[arrayScheduleCierre.length - 1].sc.start()
            iniciocierre = new Date(snapshot.data().horacierre.toDate())
            arrayScheduleCierre.shift()
        }
        //console.log(arrayScheduleCierre, 113);

        //const token=await auto.createCustomToken('p7VUBVXkC6dPCSmC9JKAEV4Pa2C3')


        //console.log(token);
        //const aj=await fetch(`http://epimast.duckdns.org:3000/ajustes`,{headers: {'Accept': 'application///json', 'token':token},})
        //const da=await aj.json() 
        //console.log(da);  


        //subject.next(new Date(snapshot.data().horabc.toDate()).getMinutes())
    })
    // ...
}, err => {
    console.log(`Encountered error: ${err}`);
});
let update = () => {
    //cron.schedule(`* * * * *`, async () => {
    //console.log(`http://${localserver}/ajustes`);
    //Backups
    /* const resbackuppost=await fetch(`http://${localserver}/backuppostgres`)
    const databackuppost=await resbackuppost.json();
    console.log(databackuppost); */
    //co fallidas
    /* const backupComandasFallidas=await fetch(`http://${localserver}/backupComandasFallidas`)
    const datafailconandas=await backupComandasFallidas.json();
    console.log(datafailconandas);
    //detalles co fallidos
    const backupDetallesFallidos=await fetch(`http://${localserver}/backupDetallesFallidos`)
    const datafaildetallesconandas=await backupDetallesFallidos.json();
    console.log(datafaildetallesconandas);
     */
    //backupComandasHist
    /*  const backupComandasHist=await fetch(`http://${localserver}/backupComandasHist`)
     const databackupComandasHist=await backupComandasHist.json();
     console.log(databackupComandasHist); */

    //backupDetallesHist
    // const backupDetallesHist=await fetch(`http://${localserver}/backupDetallesHist`)
    // const databackupDetallesHist=await backupDetallesHist.json();
    // console.log(databackupDetallesHist);
    //console.log(new Date());
    /* setTimeout(async () => {
        console.log(new Date());
        //webpush.sendNotification()
        //await enviarSubs(`Hola, ahora es:  ${new Date()}`)
    }, 2000)
*/
    //await execute('rm -rf content')
    //await execute('mkdir  content')
    //        await execute(`touch  ./cron/content/file${nu}.txt`)
    //await execute(`cd . > ./cron/content/file${nu}.txt`)
    //await execute(`cd . > ./content/file${nu}.txt`)
    //await execute(`touch  content/file${date}.txt`)

    //});
}
//update()
async function enviarSubs(titulo, mensaje) {
    /* const data =//await pgdb.one('select actualidado from usuarios where idusuariopg=5')//
        fs.readFileSync('subs.txt', { encoding: 'utf8', flag: 'r' })
    let token =//data//
        JSON.parse(data)
    console.log(token); */
    try {
        const usunotiCol = dbfb.collection('usuariosnotificaciones')
        const toSendNoti = await usunotiCol.get()
        toSendNoti.forEach(async element => {
            let credenciales = element.data().credenciales

            let id = element.id
            console.log(id);
            //const credencialesdatastring=element.data().credenciales
            //credencialesdatastring.id=element.id
            //fs.appendFileSync('credenciales.txt', JSON.stringify(credencialesdatastring));
            const payload = JSON.stringify({
                title: titulo,
                message: mensaje
            });

            try {
                let nn = await webpush.sendNotification(credenciales, payload);

            } catch (error) {
                console.log(error);
                //console.log(el.credenciales);
                try {
                    await usunotiCol.doc(id).delete()
                } catch (e) {
                    console.log(e);
                }

            }

        }

        );

    } catch (error) {
        console.log(error);
        try {
            const datapg = await pgdb.any('select credenciales,idusuariopg  from usuariosnotificaciones where idusuariopg=5')
            //console.log(datapg);
            datapg.forEach(async (el) => {
                console.log(el.idusuariopg)
                const payload = JSON.stringify({
                    title: "My Notification",
                    message: mensaje
                });

                try {
                    await webpush.sendNotification(el.credenciales, payload);
                } catch (error) {
                    console.log(error);
                    //console.log(el.credenciales);
                    try {
                        await pgdb.any('delete    from usuariosnotificaciones where credenciales=$1', [el.credenciales])
                    } catch (e) {
                        console.log(e);
                    }

                }

            }

            )

        } catch (error) {

        }
    }


}
//update()
//enviarSubs('hola')
module.exports = update