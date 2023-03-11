//const db = admin.firestore()
const uniqueid = require('uniqid')
const adminfirestore = require('../firebase/firestore')
const dbfirestore = adminfirestore.firestore()
const moment = require('moment')
var cron = require('node-cron');
const pgdb = require('../pg/conpgtaberna')
const pgp = require('pg-promise')({
    /*initialization options */
    capSQL: true // capitalize all generated SQL
});
const { Router } = require('express')
const router = Router()
///FALTA PROTGER RUTAS CON HEADERS DESDE FIREBASE AUTH
router.post('/cobrar', async (req, res) => {
    console.log('cccccccco');
    let datoscomanda = req.body
    datoscomanda.nfactura = ''
    if(new Date(datoscomanda.fechahora.seconds * 1000)>0) datoscomanda.fechahora = new Date(datoscomanda.fechahora.seconds * 1000)
    delete datoscomanda.email
    
    const query = pgp.helpers.insert(datoscomanda, null, 'comandashist') + ' returning *';
    console.log(query);

    try {
        const datoscomandaspg = await pgdb.one(query);
        console.log(datoscomandaspg);
        res.send(datoscomandaspg)

    } catch (error) {
        console.log(error);

    }
})
router.post('/insertardetalles', async (req, res) => {
    let detallescomanda = req.body
    //datoscomanda.nfactura=''
    if(new Date(detallescomanda.horacomanda.seconds * 1000)>0)   detallescomanda.horacomanda = new Date(detallescomanda.horacomanda.seconds * 1000)
    if( new Date(detallescomanda.horapedido.seconds * 1000)>0)  detallescomanda.horapedido = new Date(detallescomanda.horapedido.seconds * 1000)
    //console.log(detallescomanda)
    const query = pgp.helpers.insert(detallescomanda, null, 'detallescomandahist') + ' returning *';
    console.log(query);

    try {
        const detallescomandaspg = await pgdb.one(query);
        console.log(detallescomandaspg);
        res.send(detallescomandaspg)

    } catch (error) {
        console.log(error);

    }
})
router.post('/addcaja', async (req, res) => {

    let datoscaja = req.body
    console.log(datoscaja);

    const query = pgp.helpers.insert(datoscaja, null, 'caja') + ' returning *';
    //console.log(query);

    try {
        const datoscomandaspg = await pgdb.one(query);
        res.send(datoscomandaspg)

    } catch (error) {
        console.log(error);

    }
})

router.post('/addflujoscaja', async (req, res) => {
    let datosflujo = req.body
    datosflujo.forEach(el => {
        el.fechahora = new Date(el.fechahora.seconds * 1000)
    })
    if (datosflujo.length == 0) { res.send(datosflujo); return }
    console.log(datosflujo);
    let gg = []
    const cs = new pgp.helpers.ColumnSet([
        'cantidad', 'fecha',
        'fechahora',
        'flujo',
        'hora',
        'id',
        'idcaja',
        'retiradopor',

    ], { table: 'flujoscaja' });

    const values = datosflujo;
    const query = pgp.helpers.insert(values, cs) + 'returning *';
    try {

        const flujoinsertedpg = await pgdb.many(query);

        //console.log(datoscaja);
        res.send(flujoinsertedpg)
    } catch (e) {
        console.log(e);
    }
})


router.post('/updatescanner', async (req, res) => {
    let idcomandas = req.body
    arra = []
    idcomandas.forEach(el => {
        arra.push({ idcomanda: el, facturado: false, scanner: true })
    })

    const dataMulti = arra
    const cs = new pgp.helpers.ColumnSet(['?idcomanda',
        'facturado', 'scanner'], { table: 'comandashist' });

    const query = pgp.helpers.update(dataMulti, cs) + ' WHERE v.idcomanda = t.idcomanda returning v.idcomanda';
    console.log(query);
    try {
        const update = await pgdb.many(query);
        console.log(update);
        res.send(update)

    } catch (error) {
        console.log(error);
    }


})
router.post('/checkpgscanner', async (req, res) => {
    let idcomandas = req.body
    arra = []
    idcomandas.forEach(el => {
        arra.push({ idcomanda: el })
    })

    const dataMulti = arra

    let resArrSI = []
    let resArrNO = []
    try {
        const sele = await pgdb.many('select idcomanda,facturado,visa,fechahora,scanner,mesa,total from comandashist where idcomanda in($1:csv) ', [idcomandas]);

        sele.forEach(el => {
            if (el.facturado == true && el.visa == false) resArrSI.push(el)
            else resArrNO.push(el)
        })
        res.send({ resSI: resArrSI, resNO: resArrNO })

    } catch (error) {
        //console.log(error);
        res.send({ resSI: resArrSI, resNO: resArrNO })
    }


})
router.get('/getscanner', async (req, res) => {
    try {
        const sele = await pgdb.any('select * from comandashist where scanner=true ');
        res.send(sele)
    } catch (error) {
        let sele = []
        console.log(err);
        res.send(sele)
    }

})
router.get('/getcajas', async (req, res) => {
    try {
        const sele = await pgdb.any('select * from caja');
        res.send(sele)
    } catch (error) {
        let sele = []
        console.log(err);
        res.send(sele)
    }

})
router.get('/correlativos', async (req, res) => {
    dbfirestore
    const correlativosCol = dbfirestore.collection('correlativos')
    const correlativosData = await correlativosCol.get()
    let correlativosFb = []
    correlativosData.forEach(el => {
        correlativosFb.push(el)
    })
    //res.send(correlativosFb)
    if (correlativosFb.length == 0) {
        /* const cajaCol = dbfirestore.collection('caja')
        const cajaData = await cajaCol.get()
        let cajaFb = []
        cajaData.forEach(el => {
            cajaFb.push(el.id)

        }) */
        const cajaCol = dbfirestore.collection('caja')
        const cajaData = await cajaCol.get()
        let cajahoy = ''
        let seriehoy = ''
        cajaData.forEach(el => {
            cajahoy = el.id
            seriehoy = el.data().nserie
        })
        //cajahoy =  'Oyoc9M23ShN5knxE3qMX'// "B9IfkhhOCqqIsOuRQCoN"
        //res.send(cajaFb)
        //seriehoy='Serie2023-13%'
        console.log(cajahoy, seriehoy);
        try {

            // const max =await pgdb.any(`select max(nfactsimpli) from comandashist where idcaja=$1 and  nfactsimpli like '${seriehoy}'`,[cajahoy]);
            const max = await pgdb.any(`select nfactsimpli as max from comandashist where nserie  like '${seriehoy}%' and nfactsimpli !=''  and ndentroserie=(select max(ndentroserie) from comandashist where  nfactsimpli like '${seriehoy}%')`);
            //const min = await pgdb.any(`select min(nfactsimpli) from comandashist where nfactsimpli like '${seriehoy}%'`);
            const min = await pgdb.any(`select nfactsimpli as min from comandashist where nserie  like '${seriehoy}%' and nfactsimpli !=''  and ndentroserie=(select min(ndentroserie) from comandashist where  nfactsimpli like '${seriehoy}%')`);
            console.log(max,209,min);
            if (max.length==0 && min.length==0) {
                res.send({ min: seriehoy + 1, max: seriehoy + 1, inicio: true })
            }
            else {
                console.log('jjjjjj');
                res.send({ min: min[0].min, max: max[0].max, inicio: false })
            }

        } catch (error) {
            let sele = [] 
            console.log(error);
            res.send(sele)
        }

    }
})
router.get('/histcorrelativos', async (req, res) => {
    const cajaCol = dbfirestore.collection('caja')
    const cajaData = await cajaCol.get()
    let cajahoy = ''
    let seriehoy = ''
    cajaData.forEach(el => {
        cajahoy = el.id
        seriehoy = el.data().nserie
    })
    //cajahoy =  'Oyoc9M23ShN5knxE3qMX'// "B9IfkhhOCqqIsOuRQCoN"
    //res.send(cajaFb)
    //seriehoy='Serie2023-13%'
    console.log(cajahoy, seriehoy);
    const canceladasCol = dbfirestore.collection('canceladas')
    const canceladasData = await canceladasCol.get()
    let canceladasFb = []
    canceladasData.forEach(el => {
        let objeto = el.data()
        objeto.idcancelada = el.id
        canceladasFb.push(objeto)
    })
    canceladasFb=canceladasFb.sort((a, b) => a.ndentroserie-b.ndentroserie);
    //console.log(canceladasFb);
    try {
        const serieTotal = await pgdb.any(`select *  from comandashist where nserie  like '${seriehoy}%' and nfactsimpli !='' `);
        console.log(serieTotal);
        let maxdentroserie = Math.max(...serieTotal.map(o => o.ndentroserie))

        const results = canceladasFb.filter(function (o1) {
            return !serieTotal.some(function (o2) {    //  for diffrent we use NOT (!) befor obj2 here
                return o1.ndentroserie == o2.ndentroserie;          // id is unnique both array object
            });
        });
        /* const simulado=`INSERT INTO "comandashist"("uidcamarero","ndentroserie","activa","idcorrelativo","nfactsimpli","fechahora","idmesa","cobrado","barra","cuenta","servida","idcamarero","diaserie","total","mesa","nserie","status","anoserie","nombrecamarero","idcomanda","entregado","facturado","visa","confactura","devuelto","idcaja","nfactura") VALUES('p7VUBVXkC6dPCSmC9JKAEV4Pa2C3',7,false,'',${nfactsimpli},,'jOC1xo2KUephBCFcyiHW',true,false,true,false,'vikz2feijTUN5XvWa6cJ',18,3.44,'T-bar','Serie:2023-18/Num','cobrado',2023,'Javier','RH0mLkHwniAQaVrjTcvs',3.5,false,false,false,0,'pSmAAc0zPy07r7yDUyIt','') returning *
        `
        const detallesimul=`INSERT INTO "detallescomandahist"("uidcamarero","precio","status","mesa","servido","nuevo","idmesa","horapedido","nombrecamarero","idcomanda","idcamarero","nombre","subcomanda","horacomanda","idbebida","destino","activa","idproduct","facturado","visa","horabarra","horaservido") VALUES('p7VUBVXkC6dPCSmC9JKAEV4Pa2C3',3.44,'pedido','T-bar',false,false,'jOC1xo2KUephBCFcyiHW','2023-01-18T17:21:21.000+01:00','Javier','RH0mLkHwniAQaVrjTcvs','vikz2feijTUN5XvWa6cJ','Pan',null,'2023-01-18T17:21:13.000+01:00','j7PFGdPxdFlCpjSaAvql','barra',false,'OcyOEEXZvC0K0Ca0xhy7',false,false,null,null) returning *
        ` */
        //console.log(results);
        let insertar = []
        for (let result of results) {
            const idcomanda = uniqueid()
            const nfactsimpli = result.nu
            const ndentroserie = result.ndentroserie
            const diaserie = result.diaserie
            const nserie = result.nserie
            const anoserie = result.anoserie
            const ahora = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            console.log(ahora);

            const comandasimulado = `INSERT INTO "comandashist"("uidcamarero","ndentroserie","activa","idcorrelativo","nfactsimpli","fechahora","idmesa","cobrado","barra","cuenta","servida","idcamarero","diaserie","total","mesa","nserie","status","anoserie","nombrecamarero","idcomanda","entregado","facturado","visa","confactura","devuelto","idcaja","nfactura") VALUES('p7VUBVXkC6dPCSmC9JKAEV4Pa2C3',${ndentroserie},false,'','${nfactsimpli}','${ahora}','jOC1xo2KUephBCFcyiHW',true,false,true,false,'vikz2feijTUN5XvWa6cJ',${diaserie},1,'T-bar','${nserie}','cobrado',${anoserie},'Javier','${idcomanda}',1,false,false,false,0,'${cajahoy}','') returning *`
            //console.log(comandasimulado);
            const detallesimulado = `INSERT INTO "detallescomandahist"("uidcamarero","precio","status","mesa","servido","nuevo","idmesa","horapedido","nombrecamarero","idcomanda","idcamarero","nombre","subcomanda","horacomanda","idbebida","destino","activa","idproduct","facturado","visa","horabarra","horaservido") VALUES('p7VUBVXkC6dPCSmC9JKAEV4Pa2C3',1,'servido','T-bar',true,false,'jOC1xo2KUephBCFcyiHW','${ahora}','Javier','${idcomanda}','vikz2feijTUN5XvWa6cJ','Pan',null,'${ahora}','j7PFGdPxdFlCpjSaAvql','barra',false,'OcyOEEXZvC0K0Ca0xhy7',false,false,null,null) returning *`
            //console.log(detallesimulado);
            if (ndentroserie > maxdentroserie) {
                console.log('Se elimina solo canceladas' ,maxdentroserie,result.ndentroserie);
                await canceladasCol.doc(result.idcancelada).delete()
                
            } else {
                console.log('Se elimina  canceladas y se simula las anteriores',maxdentroserie,result.ndentroserie);
                 const comandasimuladodata=await pgdb.one(comandasimulado)
            const detallessimuladodata=await pgdb.one(detallesimulado)
            await canceladasCol.doc(result.idcancelada).delete() 
                insertar.push({comanda:comandasimuladodata,detalles:detallessimuladodata})
                console.log('Se elimina  canceladas y se simula las anteriores',maxdentroserie,result.ndentroserie);
            }

        }

        res.send(insertar)
    } catch (err) {
        console.log(err);
    }

})



module.exports = router