const { Router } = require('express');

const router = Router()
const admin = require('../firebase/firestore')
const db=admin.firestore()
const firebase=admin.auth()
const pgdb = require('../pg/conpgtaberna');
const pgp = require('pg-promise')({
    /* initialization options */
    capSQL: true // capitalize all generated SQL
});
router.get('/caja',async (req,res)=>{
    const caja=await pgdb.any('select * from caja')
    console.log('Viendo caja');
    res.send(caja)
    
})
 
router.get('/flujoscaja',async (req,res)=>{
    const caja=await pgdb.any('select * from flujoscaja')
    res.send(caja)
     
})
router.post('/addcaja', async (req, res) => {
    let datoscaja = req.body
    const cs = new pgp.helpers.ColumnSet([
        'cerrado','cerradostatus',
        'comandas',
        'creado',
        'devuelto',
        'diferencia',
        'entrada',
        'horacerrado',
        'id',
        'ingresado',
        'inicial',
        'retirado'

    ], { table: 'caja' });
    const values = datoscaja;
    const query = pgp.helpers.insert(values, cs) + 'returning *';
    try {

        const cajainsertedpg = await pgdb.many(query);

        //console.log(datoscaja);
        res.send(cajainsertedpg)
    }catch(e){
        console.log(e);
    }
})
router.post('/addflujoscaja', async (req, res) => {
    let datosflujo = req.body
    datosflujo.forEach(el=>{
        el.fechahora=new Date(el.fechahora.seconds*1000)
    })
    if(datosflujo.length==0) {res.send(datosflujo); return}
    const cs = new pgp.helpers.ColumnSet([
        'cantidad','fecha',
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
    }catch(e){
        console.log(e);
    }
})
router.get('/cajasavehist', async (req,res)=>{
    const comandas=await backupComandasHist()
    await backupDetallesHist()
    res.send(comandas)
})

async function backupComandasHist() {
    let comandasArray = []
    const comandaCol = db.collection('comandashist')
    const col = await comandaCol.get();
    col.forEach(async (el) => {
        const comanda = el.data();
        comanda.idcomandahist = el.id
        comanda.fechahora = comanda.fechahora.toDate()
        comandasArray.push(comanda)

    })
    if(comandasArray.length==0){
        console.log('No data to be saved at comandashist Fire');
        return
    }
    //console.log(comandasArray);
    const cs = new pgp.helpers.ColumnSet([
        'activa',
        'idcomanda',
        'idmesa',
        'idcamarero',
        'nombrecamarero',
        'cuenta',
        'barra',
        'status',
        'cobrado',
        'fechahora',
        'uidcamarero',
        'mesa',
        'total',
        'servida',
        'idcomandahist', 'facturado', 'visa', 'entregado',
        'devuelto'], { table: 'comandashist' });
    const values = comandasArray;
    const query = pgp.helpers.insert(values, cs) + ' returning *';
    try {
        comandasArraydata = JSON.stringify(comandasArray)

        const datoscomandaspg= await pgdb.many(query);
        if (datoscomandaspg.length == comandasArray.length) {
            console.log('Todo fue ok con comandas. Comandashist saved af comandashistPG');
            //console.log(detallesArray);
            let deletedDocs=[]
            comandasArray.forEach(async (element) => {
                try {
                    const deletedoc = await comandaCol.doc(element.idcomandahist).delete()
                    //console.log(deletedoc);
                    deletedDocs.push(deletedoc)
                } catch (e) {
                    console.log(e);
                }

            })
            if(deletedDocs.length==datoscomandaspg.length) console.log('Comandashist deleted');
            console.log(deletedDocs);
        }

        else {
            let fechahora = moment(new Date).format('DD-MM-yy-HH-mm-ss')
            console.log(fechahora);
            fs.writeFile(path.join(__dirname, `./logdata/comandas${fechahora}.txt`), comandasArraydata, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('datos saved');
                    
                }

            })
        }
        return datoscomandaspg
    }
    catch (e) {
        console.log(e);
    }


}
async function backupDetallesHist() {
    let detallesArray = []
    const detalleCol = db.collection('detallescomandahist')
    const col = await detalleCol.get();
    col.forEach(async (el) => {
        const detalles = el.data();
        detalles.iddetalleshist = el.id
        detalles.horacomanda = detalles.horacomanda.toDate()
        detalles.horapedido = detalles.horapedido.toDate()
        detallesArray.push(detalles)




    })
    if(detallesArray.length==0){
        console.log('No data to be saved at detalleshist Fire');
        //enviarSubs('No data Detalles Comandas'+ new Date().toString())
        return
    }
    const cs = new pgp.helpers.ColumnSet([
        'horacomanda',
        'idcamarero',
        'uidcamarero',
        'nombrecamarero',
        'activa',
        'status',
        'servido',
        'nombre',
        'idproduct',
        'idmesa',
        'idcomanda',
        'idbebida',
        'horapedido',
        'mesa',
        'precio',
        'subcomanda',
        'destino',
        'nuevo',
        'iddetalleshist',
        'facturado',
        'visa',
        
    ], { table: 'detallescomandahist' });
    const values = detallesArray;
    const query = pgp.helpers.insert(values, cs) + 'returning *';
    try {
        detallesArraydata = JSON.stringify(detallesArray)
        const detallesinsertedpg = await pgdb.many(query);
        console.log(detallesinsertedpg.length);
        console.log(detallesArray.length);
        if (detallesinsertedpg.length == detallesArray.length) {
            console.log('Todo fue ok, DetallesHist saved at detalleshistPG');
          //  await enviarSubs('Todo fue ok, DetallesHist saved at detalleshistPG')
            //console.log(detallesArray);
            let deletedDocs=[]
            detallesArray.forEach(async (element) => {
                try {
                    const deletedoc = await detalleCol.doc(element.iddetalleshist).delete()
                    //console.log(deletedoc);
                    deletedDocs.push(deletedoc)
                } catch (e) {
                    console.log(e);
                }

            })
            console.log(deletedDocs);
            if(deletedDocs.length==detallesinsertedpg.length) console.log('Comandashist deleted');
        }

        else {
            let fechahora = moment(new Date).format('DD-MM-yy-HH-mm-ss')
            console.log(fechahora);
            fs.writeFile(path.join(__dirname, `./logdata/detalles${fechahora}.txt`), detallesArraydata, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('datos saved');
                }

            })
        }
        return detallesinsertedpg
        //console.log('despues pg', new Date().toString());
    }
    catch (e) {
        console.log(e);
    }


}





module.exports = router
