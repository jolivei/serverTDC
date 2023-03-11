const fs = require('fs')
const path = require('path');
const admin = require('../firebase/firestore')
const db = admin.firestore()
const moment = require('moment')
const uniqueid = require('uniqid')
var cron = require('node-cron');
const pgdb = require('../pg/conpgtaberna')
const pgp = require('pg-promise')({
    /* initialization options */
    capSQL: true // capitalize all generated SQL
});
const { Router } = require('express')
const router = Router()
const nanoid=require('nanoid')


const doc = db.collection("ajustes")
const horabcCollection = db.collection("horabc")
const resultbcCollection = db.collection("resultadobc")
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
/* const observer = horabcCollection.onSnapshot(async docSnapshot => {
 
    const idhorabc = await  getIDhoraBc()
    const idresultadobc =await  getIDresultadoBc()

    docSnapshot.forEach(async snapshot => {
        console.log(new Date(snapshot.data().bccomandas.toDate()),46)
        let ninutos = new Date(snapshot.data().bccomandas.toDate()).getMinutes()
        let hora = new Date(snapshot.data().bccomandas.toDate()).getHours()
       
        cron.schedule(`${ninutos} ${hora} * * *`, async () => {


        })
    })
}) */
let funciones = {}


funciones.backupUsuarios = async function backupUsuarios() {
    let usuariosArray = []
    const usuariosCol = db.collection('usuarios')
    const usuariosData = await usuariosCol.get()
    usuariosData.forEach(usuario => {
        const userData = usuario.data()
        userData.idusuariofs = usuario.id
        usuariosArray.push(userData)
    })
    console.log(usuariosArray);
    const cs = new pgp.helpers.ColumnSet([
        'email',
        'usuario',
        'baja',
        'uid',
        'rol',
        'idusuariofs',
    ], { table: 'usuarios' });
    values = usuariosArray
    const query = pgp.helpers.insert(values, cs) + ' returning *';
    try {
        let usuariosArraydata = JSON.stringify(usuariosArray)

        const datosUsuariospg = await pgdb.many(query);
        if (datosUsuariospg.length == usuariosArray.length) {
            console.log('Todo fue ok con usuarios');
            let fechahora = moment(new Date).format('DD-MM-yy-HH-mm-ss')
            console.log(fechahora);
            fs.writeFile(path.join(__dirname, `./logdata/usuarios${fechahora}.txt`), usuaariosArraydata, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('datos Usuarios saved');
                }

            })

        }

        else {
            let fechahora = moment(new Date).format('DD-MM-yy-HH-mm-ss')
            console.log(fechahora);
            fs.writeFile(path.join(__dirname, `./logdata/usuariosError${fechahora}.txt`), usuariosArraydata, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('datos usuarios Error saved');
                }

            })
        }
    }
    catch (e) {
        console.log(e);
    }



}

async function backupMesas() {
    let mesasArray = []
    const mesasCol = db.collection('mesas')
    const mesasData = await mesasCol.get()
    mesasData.forEach(mesa => {
        const mesaData = mesa.data()
        mesaData.idmesafs = mesa.id
        mesaData.mesa = mesaData.task
        mesaData.idcomanda = ''
        mesaData.comandadata = mesaData.comandaData

        mesasArray.push(mesaData)
    })
    console.log(mesasArray);
    const cs = new pgp.helpers.ColumnSet([
        'uid',
        'mesa',
        'idcomanda',
        'idmesafs',
        'comandadata',
    ], { table: 'mesas' });
    values = mesasArray
    const query = pgp.helpers.insert(values, cs) + ' returning *';
    try {
        let mesasArraydata = JSON.stringify(mesasArray)

        const datosMesaspg = await pgdb.many(query);
        if (datosMesaspg.length == mesasArray.length) {
            console.log('Todo fue ok con mesas');
            let fechahora = moment(new Date).format('DD-MM-yy-HH-mm-ss')
            console.log(fechahora);
            fs.writeFile(path.join(__dirname, `./logdata/mesas${fechahora}.txt`), mesasArraydata, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('datos mesas saved');
                }

            })


        } else {
            console.log('Algo fue MAL con mesas');
            let fechahora = moment(new Date).format('DD-MM-yy-HH-mm-ss')
            fs.writeFile(path.join(__dirname, `./logdata/mesasError${fechahora}.txt`), mesasArraydata, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('datos mesas Error saved');
                }

            })
        }
    }
    catch (e) {
        console.log(e);
    }

}

async function deleteComandasMesas() {
    let mesasArray = []
    mesasColTodas = db.collection('mesas')
    const mesasCol = db.collection('mesas')
    const mesasData = await mesasCol.where('idcomanda', '!=', '').get()
    mesasData.forEach(mesa => {
        const mesaData = mesa.data()
        mesaData.idmesafs = mesa.id
        mesaData.mesa = mesaData.task
        mesaData.uid = mesaData.comandaData.uidcamarero
        //mesaData.idcomanda = ''
        mesaData.comandadata = mesaData.comandaData

        mesasArray.push(mesaData)
    })
    console.log(mesasArray);
    if (mesasArray.length == 0) {
        //await enviarSubs('Todo las mesas estaban cerradas correctamente')
        return
    }
    const cs = new pgp.helpers.ColumnSet([
        'uid',
        'mesa',
        'idcomanda',
        'idmesafs',
        'comandadata',
    ], { table: 'mesas' });
    values = mesasArray
    const query = pgp.helpers.insert(values, cs) + ' returning *';
    try {
        let mesasArraydata = JSON.stringify(mesasArray)

        const datosMesaspg = await pgdb.many(query);
        console.log(datosMesaspg);

        if (datosMesaspg.length == 0) {
            //await enviarSubs('Todo las mesas estaban cerradas correctamente')
        }
        else {
            //await enviarSubs('Algunas mesas NO estaban cerradas correctamente')
        }
        if (datosMesaspg.length == mesasArray.length) {
            // console.log('Todo fue ok con mesasComanda no Guardadas');
            let fechahora = moment(new Date).format('DD-MM-yy-HH-mm-ss')
            datosMesaspg.forEach(async (element) => {
                //                console.log(element.idmesafs);
                await mesasCol.doc(element.idmesafs).update({ idcomanda: '' })
            })





        } else {
            //console.log('Algo fue MAL con mesas');
            let fechahora = moment(new Date).format('DD-MM-yy-HH-mm-ss')
            fs.writeFile(path.join(__dirname, `./logdata/mesasError${fechahora}.txt`), mesasArraydata, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('datos mesas Error saved');
                }

            })
        }
    }
    catch (e) {
        console.log(e);
    }

}

async function backupArticulos() {
    let articulosArray = []
    const articulosCol = db.collection('articulos')
    const articulosData = await articulosCol.get()
    articulosData.forEach(articulo => {
        const articuloData = articulo.data()
        articuloData.idarticulofs = articulo.id

        articulosArray.push(articuloData)
    })
    console.log(articulosArray);
    const cs = new pgp.helpers.ColumnSet([
        'precio',
        'nombre',
        'boton',
        'familia',
        'destino',
        'idarticulofs'
    ], { table: 'articulos' });
    values = articulosArray
    const query = pgp.helpers.insert(values, cs) + ' returning *';
    try {
        let articulosArraydata = JSON.stringify(articulosArray)

        const datosArticulospg = await pgdb.many(query);
        if (datosArticulospg.length == articulosArray.length) {
            console.log('Todo fue ok con articulos');
            let fechahora = moment(new Date).format('DD-MM-yy-HH-mm-ss')
            console.log(fechahora);
            fs.writeFile(path.join(__dirname, `./logdata/articulos${fechahora}.txt`), articulosArraydata, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('datos articulos saved');
                }

            })


        } else {
            console.log('Algo fue MAL con articulos');
            let fechahora = moment(new Date).format('DD-MM-yy-HH-mm-ss')
            fs.writeFile(path.join(__dirname, `./logdata/articulosError${fechahora}.txt`), articulosArraydata, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('datos articulos Error saved');
                }

            })
        }
    }
    catch (e) {
        console.log(e);
    }

}
let comadetaailfailed = false
funciones.backupComandasFallidas = async function backupComandasFallidas() {
    let comandasArray = []
    const comandaCol = db.collection('comandas')
    const col = await comandaCol.get();
    col.forEach(async (el) => {
        const comanda = el.data();
        comanda.idcomanda = el.id
        comanda.fechahora = comanda.fechahora.toDate()
        comandasArray.push(comanda)
    })
    if (comandasArray.length == 0) {
        console.log('No error in comandas');
        //enviarSubs('No errors en Comandas ' + new Date().toString())
        //res.send(true)
        return true
    }
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
    ], { table: 'comandas' });
    const values = comandasArray;
    const query = pgp.helpers.insert(values, cs) + ' returning *';
    let resultado = {}
    try {
        let comandasArraydata = JSON.stringify(comandasArray)

        const datoscomandaspg = await pgdb.many(query);
        if (datoscomandaspg.length == comandasArray.length) {
            console.log('Todo fue ok con comandas');
            //console.log(detallesArray);
            console.log('Errors comandas saved in comandasPG');
            let deletedDocs = []
            comandasArray.forEach(async (element) => {
                try {
                    const deletedoc = await comandaCol.doc(element.idcomanda).delete()
                    console.log('deletedoc');

                    //deletedDocs.push(deletedoc)
                } catch (e) {
                    //res.send('saved')
                    console.log(e);
                }

            })
            if (deletedDocs.length > 0) console.log('hola');
            resultado = { resultado: 'saved-deleted' }
            //res.send(resultado)
            return resultado
            //enviarSubs('Errores de Comandas Coleccion guradados and deleted' + new Date().toString())
        }

        else {
            let fechahora = moment(new Date).format('DD-MM-yy-HH-mm-ss')
            console.log(fechahora);
            fs.writeFile(path.join(__dirname, `./logdata/comandasError${fechahora}.txt`), comandasArraydata, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('datos saved');
                }

            })
            resultado = { resultado: 'text-saved' }
            //res.send(resultado)
            return resultado
        }
    }
    catch (e) {
        console.log(e);
        //res.send(false)
        return false
    }


}


//
funciones.backupDetallesFallidos = async () => {
    let detallesArray = []
    const detalleCol = db.collection('detallescomanda')
    const col = await detalleCol.get();
    col.forEach(async (el) => {
        const detalles = el.data();
        detalles.iddetalle = el.id
        detalles.horacomanda = detalles.horacomanda.toDate()
        detalles.horapedido = detalles.horapedido.toDate()
        detallesArray.push(detalles)



    })
    if (detallesArray.length == 0) {
        console.log('No error detallescomanda');

        //enviarSubs('No errors en detallComandas ' + new Date().toString())
        //res.send(true)
        return true
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
        'idmesa',
        'idcomanda',
        'idbebida',
        'horapedido',
        'mesa',
        'precio',
        'subcomanda',
        'destino',
        'nuevo',
        'iddetalle',

    ], { table: 'detallescomanda' });
    const values = detallesArray;
    let resultado = {}
    const query = pgp.helpers.insert(values, cs) + 'returning *';
    try {
        detallesArraydata = JSON.stringify(detallesArray)
        const datainsertedpg = await pgdb.many(query);
        //  console.log(datainsertedpg);
        if (datainsertedpg.length == detallesArray.length) {
            console.log('Todo fue ok con detallescomanda');
            console.log('Errors detallescomanda saved in detallescomandaPG');
            //console.log(detallesArray);
            let deletedDocs = []
            detallesArray.forEach(async (element) => {
                try {
                    const deletedoc = await detalleCol.doc(element.iddetalle).delete()

                    //deletedDocs.push(deletedoc)
                    console.log('deletedoc');
                } catch (e) {
                    console.log(e);
                }

                //enviarSubs('detalles Erros saved and deleted' + new Date().toString())

            })
            if (deletedDocs.length > 0) console.log('jjj');
            resultado = { resultado: 'saved-deleted' }
            //res.send(resultado)
            return resultado
        }

        else {
            let fechahora = moment(new Date).format('DD-MM-yy-HH-mm-ss')
            console.log(fechahora);
            fs.writeFile(path.join(__dirname, `./logdata/detallesError${fechahora}.txt`), detallesArraydata, (error) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log('datos saved');
                }

            })
            resultado = { resultado: 'text-deleted' }
            //res.send(resultado)
            return resultado
        }
        //console.log('despues pg', new Date().toString());
    }
    catch (e) {
        console.log(e);
        //res.send(false)
        return false
    }


}

async function backupCaja(ingresadoComandas) {
    console.log('backupCajann');
    let datosCierre = []
    let ahora = new Date()
    let cajaColeccion = db.collection('caja')
    let ingresosColeccion = db.collection('ingresos')
    let cajaCol = await cajaColeccion.get();
    let ingresosCol = await ingresosColeccion.get();

    let datosIngresos = []
    ingresosCol.forEach(ingreso => {
        const ingresosdata = ingreso.data()
        ingresosdata.id = ingreso.id
        datosIngresos.push(ingresosdata)
    })
    let datoIngresos = datosIngresos[0]
    console.log(moment(ahora).format('HH:mm:ss'));
    cajaCol.forEach(caja => {
        const cajad = caja.data();
        cajad.id = caja.id
        cajad.idcaja = caja.id
        //console.log(cajad);
        cajad.cerrado = ahora
        cajad.creado = cajad.creado.toDate()
        cajad.ingresado = 0//ingresadoComandas

        cajad.cerradostatus = true;
        cajad.horacerrado = moment(ahora).format('HH:mm:ss')
        cajad.comandascash = datoIngresos.ncash
        cajad.comandasvisa = datoIngresos.nvisa
        cajad.comandas = datoIngresos.nu
        cajad.ingresado = datoIngresos.ingresos
        cajad.ingresadocash = datoIngresos.ingresoscash
        cajad.ingresadovisa = datoIngresos.ingresosvisa
        cajad.devuelto = datoIngresos.devuelto
        cajad.devueltocash = datoIngresos.devueltocash
        cajad.devueltovisa = datoIngresos.devueltovisa
        cajad.diferencia = cajad.inicial + cajad.entrada - cajad.retirado + cajad.ingresado - cajad.devuelto;
        cajad.diferenciacash = cajad.inicial + cajad.entrada - cajad.retirado + cajad.ingresadocash - cajad.devueltocash;
        cajad.diferenciavisa = cajad.inicial + cajad.entrada - cajad.retirado + cajad.ingresadovisa - cajad.devueltovisa;
        cajad.netofinalcaja = cajad.inicial + cajad.entrada + cajad.ingresadocash - cajad.retirado - cajad.devueltovisa - cajad.devueltocash

        datosCierre.push(cajad)

        //console.log(cajad);

        // console.log(cajad);

    })
    console.log(ahora);
    console.log(datosCierre, 'kkk');
    console.log();
    if (datosCierre.length > 1) {
        console.log('Hay mas de una caja');
        //return
    }
    const cs = new pgp.helpers.ColumnSet([
        'cerrado', 'cerradostatus',
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
    let datoscaja = datosCierre[0]

    const values = datoscaja;
    /* let nuevaCaja = {
        cerrado: ahora, comandas: 0, creado: ahora,
        //horacreado: ahora,
        devuelto: 0, diferencia: 0,
        ingresado: 0, inicial: 0, retirado: 0,
        horacerrado: ahora,
        entrada: 0, cerradostatus: false
    } */
    const anoSerie = moment().year()
    const diaSerie = moment().dayOfYear()
    const nSerie = 'Serie:' + anoSerie + '-' + diaSerie + '/Num:'
    let nuevaCaja = {
        cerrado: ahora, comandas: 0, creado: ahora,
        //horacreado: ahora,
        devuelto: 0, diferencia: 0,
        ingresado: 0, inicial: 0, retirado: 0,
        horacerrado: ahora,
        entrada: 0, cerradostatus: false,
        comandascash: 0, ingresadocash: 0, devueltocash: 0, diferenciacash: 0,
        comandasvisa: 0, ingresadovisa: 0, devueltovisa: 0, diferenciavisa: 0, anoserie: anoSerie, diaserie: diaSerie,
        nserie: nSerie
    }
    console.log(nuevaCaja);

    const query = pgp.helpers.insert(values, null, 'caja') + ' returning *';
    console.log(query);
    try {

        const cajainsertedpg = await pgdb.one(query);

        if (cajainsertedpg) {

            await cajaColeccion.doc(cajainsertedpg.id).delete()

            const nuevacajaid = (await (await cajaColeccion.add(nuevaCaja)).get()).id
            console.log('nuevacaja', nuevacajaid);
            console.log('ingresoid', datoIngresos.id);
            //TODO update ingresos con nueva caja
            await ingresosColeccion.doc(datoIngresos.id).update({ devuelto: 0, devueltocash: 0, devueltovisa: 0, idcaja: nuevacajaid, ingresos: 0, ingresoscash: 0, ingresosvisa: 0, nu: 0, ncash: 0, nvisa: 0 })
            console.log('correcto');
        }
        //console.log(cajainsertedpg, 'pg insert Cierre')
    } catch (e) {
        console.log(e,'erroor');
        let cajaColeccionHist = db.collection('cajahist')
        datosCierre.forEach(el => {
            cajaColeccion.doc(el.id).delete()
            cajaColeccion.add(nuevaCaja)
            cajaColeccionHist.add(el)
        })
        const nuevacajaid = await (await cajaColeccion.add(nuevaCaja)).get().id
        //TODO update ingresos con nueva caja
        await ingresosColeccion.doc(datoIngresos.id).update({ devuelto: 0, devueltocash: 0, devueltovisa: 0, idcaja: nuevacajaid, ingresos: 0, ingresoscash: 0, ingresosvisa: 0, nu: 0, ncash: 0, nvisa: 0 })
 
    }
    //console.log(datosCierre[0])

    //  )
    //console.log(nuevaCaja,'nuevaCaja');
    //console.log(datosCierre);
    let idCierre = datosCierre.id
    //console.log( datoscaja,'flujosCol');
    let flujosColeccion = db.collection('flujoscaja')
    let flujosCol = await flujosColeccion.where('idcaja', '==', datoscaja.id).get();
    let flujosData = []
    flujosCol.forEach(el => {
        const flujosDatos = el.data()
        flujosDatos.id = el.id
        flujosDatos.fechahora = flujosDatos.fechahora.toDate()
        flujosDatos.fecha = JSON.parse(JSON.stringify(moment(flujosDatos.fechahora).format('DD/MM/yy')))
        flujosDatos.hora = JSON.parse(JSON.stringify(moment(flujosDatos.fechahora).format('HH:mm:ss')))

        flujosData.push(flujosDatos)
    })
    if (flujosData.length == 0) {
        console.log('No hay flujos de caja');
        return;
    }

    console.log(flujosData, 'flujos Caja');
    const csflujos = new pgp.helpers.ColumnSet([
        'cantidad', 'fecha',
        'fechahora',
        'flujo',
        'hora',
        'id',
        'idcaja',

        'retiradopor'

    ], { table: 'flujoscaja' });
    const queryflujos = pgp.helpers.insert(flujosData, csflujos) + 'returning *';
    try {

        const flujoinsertedpg = await pgdb.many(queryflujos);

        //       console.log(flujoinsertedpg, 'flujospg');
        if (flujoinsertedpg.length > 0) {
            flujoinsertedpg.forEach(el => {
                flujosColeccion.doc(el.id).delete()
            })

        }
        console.log(flujoinsertedpg, 'pg insert flujoshist')
    } catch (e) {
        console.log(e);
        let flujosColeccionHist = db.collection('flujoshist')
        flujosData.forEach(el => {
            flujosColeccionHist.add(el)
            flujosColeccion.doc(el.id).delete()

        })
    }


}
let min = '07'
funciones.backupComandasHist = async () => {

    let comandasArray = []
    const comandaCol = db.collection('comandashist')
    const col = await comandaCol.get();
    let seriehoy
    col.forEach(async (el) => {
        const comanda = el.data();
        comanda.idcomandahist = el.id
        comanda.fechahora = comanda.fechahora.toDate()
        if (!comanda.nfactura) comanda.nfactura = ''
        comandasArray.push(comanda)
        seriehoy=comanda.nserie

    })
    
    const serieTotal = await pgdb.any(`select anoserie,diaserie, ndentroserie, nfactsimpli  from comandashist where nserie  like '${seriehoy}%' and nfactsimpli !='' order by ndentroserie `);
        //console.log(serieTotal);
    let maxdentroserie = Math.max(...serieTotal.map(o => o.ndentroserie))
    for(let comanda of comandasArray){
        if(comanda.facturado){
            maxdentroserie++
            comanda.nfactsimpli=comanda.nserie+maxdentroserie
            comanda.ndentroserie=maxdentroserie
        }
    }
    let totalingresos = comandasArray.map((r) => r.total).reduce((acc, value) => acc + value, 0)
    console.log(comandasArray, 'coandas hist', totalingresos);
    await backupCaja(totalingresos)
    console.log('Se hizo backup caja');
    if (comandasArray.length == 0) {
        console.log('No data to be saved at comandashist Fire');
        //enviarSubs('No data to be saved and deleted  comandashist' + new Date().toString())
        //res.send(true)
        return true
    }
    console.log(comandasArray);
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
        'devuelto', 'confactura', 'nfactura',
        'anoserie', 'diaserie','idcaja', 'idcorrelativo','ndentroserie','nfactsimpli','nserie'], { table: 'comandashist' });
    const values = comandasArray;
    const query = pgp.helpers.insert(values, cs) + ' returning *';
    let resultado = {}
    try {
        let comandasArraydata = JSON.stringify(comandasArray)

        const datoscomandaspg = await pgdb.many(query);
        console.log('se salvo coandas hist');
        if (datoscomandaspg.length == comandasArray.length) {
            console.log('Todo fue ok con comandas. Comandashist saved af comandashistPG');
            //await enviarSubs('Todo fue ok con comandas. Comandashist saved af comandashistPG')
            //console.log(detallesArray);
            let deletedDocs = []
            comandasArray.forEach(async (element) => {
                try {
                    const deletedoc = await comandaCol.doc(element.idcomandahist).delete()
                    //console.log(deletedoc);
                    //deletedDocs.push(deletedoc)
                } catch (e) {
                    console.log(e);
                }

            })
            if (deletedDocs.length == datoscomandaspg.length) console.log('Comandashist deleted');
            console.log(deletedDocs);
            //enviarSubs('Comandas historicas saved and deleted' + new Date().toString())
            resultado = { resultado: 'saved-deleted' }
            //res.send(resultado)
            return resultado
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
            resultado = { resultado: 'text-saved' }
            //res.send(resultado)
            return resultado
        }
    }
    catch (e) {

        console.log(e);
        /*  comandasArray.forEach(el => {
             comandaCol.doc(el.idcomandahist).delete()
             let comandahistpgColeccion = db.collection('comandahistpg')
             comandahistpgColeccion.add(el)
         }) */
        //res.send(false)
        return false
    }


}

funciones.backupDetallesHist = async () => {
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
    if (detallesArray.length == 0) {
        console.log('No data to be saved at detalleshist Fire');
        //enviarSubs('No data Detalles Comandas' + new Date().toString())
        //res.send(true)
        return true
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
    let resultado = {}
    try {
        detallesArraydata = JSON.stringify(detallesArray)
        const detallesinsertedpg = await pgdb.many(query);
        console.log(detallesinsertedpg.length);
        console.log(detallesArray.length);
        if (detallesinsertedpg.length == detallesArray.length) {
            console.log('Todo fue ok, DetallesHist saved at detalleshistPG');
            //            await enviarSubs('Todo fue ok, DetallesHist saved at detalleshistPG')
            //console.log(detallesArray);
            let deletedDocs = []
            detallesArray.forEach(async (element) => {
                try {
                    const deletedoc = await detalleCol.doc(element.iddetalleshist).delete()
                    //console.log(deletedoc);
                    //deletedDocs.push(deletedoc)
                } catch (e) {
                    console.log(e);
                }

            })
            console.log(deletedDocs);
            if (deletedDocs.length == detallesinsertedpg.length) console.log('Comandashist deleted');
            resultado = { resultado: 'saved-deleted' }
            //res.send(resultado)
            return resultado
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
            resultado = { resultado: 'text-saved' }
            return resultado
            //res.send(resultado)
        }
        //console.log('despues pg', new Date().toString());
    }
    catch (e) {
        console.log(e);
        return false;
        res.send(false)
        /* comandasArray.forEach(el => {
            detalleCol.doc(el.iddetalleshist).delete()
            let detallescomandahistpgColeccion = db.collection('detallescomandahistpg')
            detallescomandahistpgColeccion.add(el)
        }) */

    }


}
const webpush = require('web-push')
async function enviarSubs(mensaje) {
    const data =//await pgdb.one('select actualidado from usuarios where idusuariopg=5')//
        fs.readFileSync('subs.txt', { encoding: 'utf8', flag: 'r' })
    let token =//data//
        JSON.parse(data)
    console.log(token);
    const datapg = await pgdb.any('select credenciales from usuariosnotificaciones where idusuariopg=5')
    console.log(datapg);
    datapg.forEach(async (el) => {
        const payload = JSON.stringify({
            title: "My Notification",
            message: mensaje
        });

        try {
            await webpush.sendNotification(el.credenciales, payload);
        } catch (error) {
            console.log(error);
            console.log(el.credenciales);
            try {
                await pgdb.any('delete    from usuariosnotificaciones where credenciales=$1', [el.credenciales])
            } catch (e) {
                console.log(e);
            }

        }

    }

    )
}

let update = () => {
    cron.schedule(`55 * * * *`, async () => {
        console.log('running a task every minute', new Date().toString());
        //
        /*  await backupComandasFallidas()
        await backupDetallesFallidos()
        await backupComandasHist()
        await backupDetallesHist()   */

        // si falla pg antener en firestore hist

        console.log('bien');
        //deleteComandasMesas()--
        //await enviarSubs('Notificaciones de firebase y PG'+ new Date().toString())
        //await backupCaja(0)
        //await hola()
        console.log(new Date().toString())
    });
}
const fetch = require('node-fetch')
funciones.sendMessageBot = async (token, chatid, message) => {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatid}&text=${message}`)
}


funciones.simulado = async () => {
    const cajaCol = db.collection('caja')
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
    const canceladasCol = db.collection('canceladas')
    const canceladasData = await canceladasCol.get()
    let canceladasFb = []
    canceladasData.forEach(el => {
        let objeto = el.data()
        objeto.idcancelada = el.id
        canceladasFb.push(objeto)
    })
    canceladasFb = canceladasFb.sort((a, b) => a.ndentroserie - b.ndentroserie);
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

            const comandasimulado = `INSERT INTO "comandashist"("uidcamarero","ndentroserie","activa","idcorrelativo","nfactsimpli","fechahora","idmesa","cobrado","barra","cuenta","servida","idcamarero","diaserie","total","mesa","nserie","status","anoserie","nombrecamarero","idcomanda","entregado","facturado","visa","confactura","devuelto","idcaja","nfactura", "simulado") VALUES('p7VUBVXkC6dPCSmC9JKAEV4Pa2C3',${ndentroserie},false,'','${nfactsimpli}','${ahora}','jOC1xo2KUephBCFcyiHW',true,false,true,false,'vikz2feijTUN5XvWa6cJ',${diaserie},1,'T-bar','${nserie}','cobrado',${anoserie},'Javier','${idcomanda}',1,false,false,false,0,'${cajahoy}','',true) returning *`
            //console.log(comandasimulado);
            const detallesimulado = `INSERT INTO "detallescomandahist"("uidcamarero","precio","status","mesa","servido","nuevo","idmesa","horapedido","nombrecamarero","idcomanda","idcamarero","nombre","subcomanda","horacomanda","idbebida","destino","activa","idproduct","facturado","visa","horabarra","horaservido", "simulado") VALUES('p7VUBVXkC6dPCSmC9JKAEV4Pa2C3',1,'servido','T-bar',true,false,'jOC1xo2KUephBCFcyiHW','${ahora}','Javier','${idcomanda}','vikz2feijTUN5XvWa6cJ','Agua',null,'${ahora}','zOc2acKhQUxtROX6lv64','barra',false,'${idcomanda}',false,false,null,null,true) returning *`
            //console.log(detallesimulado);
            if (ndentroserie > maxdentroserie) {
                console.log('Se elimina solo canceladas', maxdentroserie, result.ndentroserie);
                //await canceladasCol.doc(result.idcancelada).delete()

            } else { 
                console.log('Se elimina  canceladas y se simula las anteriores', maxdentroserie, result.ndentroserie);
                const comandasimuladodata = await pgdb.one(comandasimulado)
                const detallessimuladodata = await pgdb.one(detallesimulado)
                //await canceladasCol.doc(result.idcancelada).delete()
                insertar.push({ comanda: comandasimuladodata, detalles: detallessimuladodata })
                console.log('Se elimina  canceladas y se simula las anteriores', maxdentroserie, result.ndentroserie);
            }

        }

        return insertar
    } catch (err) {
        console.log(err);
    }

}
funciones.simuladoReal = async () => {
    const cajaCol = db.collection('caja')
    const cajaData = await cajaCol.get()
    let cajahoy = ''
    let seriehoy = ''
    let diaserie = ''
    let anoserie = ''
    cajaData.forEach(el => {
        cajahoy = el.id
        seriehoy = el.data().nserie
        diaserie = el.data().diaserie
        anoserie = el.data().anoserie
    })
    //cajahoy =  'Oyoc9M23ShN5knxE3qMX'// "B9IfkhhOCqqIsOuRQCoN"
    //res.send(cajaFb)
    //seriehoy='Serie2023-13%'
    console.log(cajahoy, anoserie,diaserie,seriehoy);
      const canceladasCol = db.collection('canceladas')
    const canceladasData = await canceladasCol.get()
    let canceladasFb = []
    canceladasData.forEach(el => {
        let objeto = el.data()
        objeto.idcancelada = el.id
        canceladasFb.push(objeto)
    })
    //canceladasFb = canceladasFb.sort((a, b) => a.ndentroserie - b.ndentroserie); */
    //console.log(canceladasFb);
    try {
        const serieTotal = await pgdb.any(`select anoserie,diaserie, ndentroserie, nfactsimpli  from comandashist where nserie  like '${seriehoy}%' and nfactsimpli !='' order by ndentroserie `);
        //console.log(serieTotal);
        let maxdentroserie = Math.max(...serieTotal.map(o => o.ndentroserie))

        console.log(maxdentroserie);
        const findMissing = num => {
            //console.log(num);
            const max = Math.max(...num.map(o => o.ndentroserie))// Will find highest number
            const min = 1//Math.min(...num.map(o => o.ndentroserie)); // Will find lowest number
            const missing = []
          
            for(let i=min; i<= max; i++) {
              if(!num.map(r=> r.ndentroserie).includes(i)) { // Checking whether i(current value) present in num(argument)
                missing.push(i); // Adding numbers which are not in num(argument) array
              }
            }
            return missing;
          }
          let faltan=findMissing(serieTotal)
          console.log(faltan);
        /* const results = canceladasFb.filter(function (o1) {
            return !serieTotal.some(function (o2) {    //  for diffrent we use NOT (!) befor obj2 here
                return o1.ndentroserie == o2.ndentroserie;          // id is unnique both array object
            });
        }); */
        let insertar=[]
        if(faltan.length==0) {
            console.log('Se eliminanan solo canceladas');
            for(let cancelada of canceladasFb){
                await canceladasCol.doc(cancelada.idcancelada).delete()
                
            }
            return insertar
        } 
        
        for(let fndentro of faltan ){
            console.log(seriehoy);
            console.log(anoserie);
            console.log(diaserie);
            let idcomandasimulado=nanoid(20)
            let idproductosimulado=nanoid(20)

            let fecha= moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
            const simuladocomanda=`INSERT INTO "comandashist" ("uidcamarero","ndentroserie","activa","idcorrelativo","nfactsimpli","fechahora","idmesa","cobrado","barra","cuenta","servida","idcamarero","diaserie","total","mesa","nserie","status","anoserie","nombrecamarero","idcomanda","entregado","facturado","visa","confactura","devuelto","idcaja","nfactura","simulado") VALUES('p7VUBVXkC6dPCSmC9JKAEV4Pa2C3',${fndentro},false,'','${seriehoy}${fndentro}','${fecha}','jOC1xo2KUephBCFcyiHW',true,true,true,true,'vikz2feijTUN5XvWa6cJ',${diaserie},1,'T-bar','${seriehoy}','cobrado',${anoserie},'Javier','${idcomandasimulado}',1,true,false,false,0,'${cajahoy}','', true) returning * `
            //console.log(simulado);
            const comandasimuladoI=await pgdb.any(simuladocomanda)
            //console.log(data);
            const detallesimulado = `INSERT INTO "detallescomandahist"
            ("uidcamarero","precio","status","mesa","servido","nuevo","idmesa","horapedido","nombrecamarero","idcomanda","idcamarero","nombre","subcomanda","horacomanda","idbebida","destino","activa","idproduct","facturado","visa","horabarra","horaservido", "simulado") 
            VALUES
            ('p7VUBVXkC6dPCSmC9JKAEV4Pa2C3',1,'servido','T-bar',true,false,'jOC1xo2KUephBCFcyiHW','${fecha}','Javier','${idcomandasimulado}','vikz2feijTUN5XvWa6cJ','Agua',null,'${fecha}','zOc2acKhQUxtROX6lv64','barra',false,'${idproductosimulado}',false,false,null,null,true) returning *`
            //console.log(detallesimulado);
            const detallesimuladoI=await pgdb.any(detallesimulado)
            insertar.push({ comanda: comandasimuladoI, detalles: detallesimuladoI })

        }
        for(let cancelada of canceladasFb){
            await canceladasCol.doc(cancelada.idcancelada).delete()
        }
        return insertar
     } catch (err) {
        console.log(err);
    } 

        

}
//funciones.simulado()
//module.exports = router
module.exports = funciones

//backupDetallesHist()
async function createTables(comanda) {
    const tabla = await pgdb.none('CREATE TABLE if not exists ' + comanda + ' (idcomhistpg serial NOT NULL PRIMARY KEY, activa boolean,  idcomanda character varying(30) NOT NULL, idmesa character varying(30) NOT NULL,        idcamarero character varying(30) NOT NULL,        nombrecamarero character varying(15) ,        cuenta boolean,        barra boolean,        status character varying(10) ,        cobrado boolean,        fechahora timestamp,        uidcamarero character varying(40),        mesa character varying(10),        total double precision,        servida boolean,        idcomandahist character varying(30) NOT NULL)')
    //console.log(tabla);
}
//createTables('comandashist')
