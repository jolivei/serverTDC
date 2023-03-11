

const formEntrada = document.getElementById('formulario')



//ADFor
const formAD = document.getElementById('datosadminform')
const establecimiento = document.getElementById('establecimiento')
const titular = document.getElementById('titular')
const localidad = document.getElementById('localidad')
const direccion = document.getElementById('direccion')
const nif = document.getElementById('nif')
const newpass = document.getElementById('newpass')
const reppass = document.getElementById('reppass')
const editad = document.getElementById('editad')
const idajustes = document.getElementById('idajustes')

const savead = document.getElementById('savead')
let editing = false
function editarad() {
    establecimiento.disabled = true
    titular.disabled = true
    localidad.disabled = true
    direccion.disabled = true
    nif.disabled = true
    newpass.disabled = true
    reppass.disabled = true
    savead.disabled = true
}
establecimiento.disabled = true
titular.disabled = true
localidad.disabled = true
direccion.disabled = true
nif.disabled = true
newpass.disabled = true
reppass.disabled = true
savead.disabled = true
editad.addEventListener('click', e => {
    e.preventDefault()
    editing = !editing
    if (editing) {
        establecimiento.disabled = false
        titular.disabled = false
        localidad.disabled = false
        direccion.disabled = false
        nif.disabled = false
        newpass.disabled = false
        reppass.disabled = false
        savead.disabled = false
        editad.value = 'Cancelar'

    }
    else {
        establecimiento.disabled = true
        titular.disabled = true
        localidad.disabled = true
        direccion.disabled = true
        nif.disabled = true
        newpass.disabled = true
        reppass.disabled = true
        savead.disabled = true
        editad.value = 'Editar'
        newpass.value = ''
        reppass.value = ''
    }

})
async function changeDataPasswordAd(event) {
    event.preventDefault();
    //establecimiento.disabled = false
    //let establecimiento=establecimiento.value
    let addata = { estableciniento: establecimiento.value, direccion: direccion.value, ciudad: localidad.value, local: titular.value, niflocal: nif.value, id: idajustes.value, pass: newpass.value }

    if (establecimiento.value == '' || direccion.value == '' || localidad.value == '' || titular.value == '' || nif.value == '' || idajustes.value == '') {
        alert('Debes copletar todo')
        return
    }
    else if (establecimiento.value.length < 6) {
        alert('El nombre del establecimiento debe contener > 5 caracteres')
        return
    }
    else if (titular.value.length < 6) {
        alert('El nombre del titular debe contener > 5 caracteres')
        return
    }
    else if (direccion.value.length < 6) {
        alert('La direccion debe contener > 5 caracteres')
        return
    }
    else if (direccion.value.length < 6) {
        alert('La direccion debe contener > 5 caracteres')
        return
    }
    else if (localidad.value.length < 3) {
        alert('La direccion debe contener > 2 caracteres')
        return
    }
    else if (nif.value.length != 9) {
        alert('El NIF debe contener 9 caracteres y ser adecuado. Ej CIF:B11111111')
        return
    }
    else if (newpass.value.length < 5) {
        alert('El pass debe contener > 4 caracteres')
        return
    }
    else if (newpass.value != reppass.value) {
        alert('Los 2 pass deben coincidir')
        return
    }
    else {
        if (!confirm('Vas a cabiar pass del adin')) return
        const changedataajustes = await fetch(`/ajustesupdatetodo`, {
            method: "POST",
            body: JSON.stringify(addata),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const res = await changedataajustes.json()
        if (res) {
            alert('Se ha cabiado datos y la contraseña')
            editarad()
            newpass.value = ''
            reppass.value = ''
            this.editing = false
            this.editad.value = 'Editar'
            window.location.reload()
        }
        else {
            alert('Algo ha ido Mal')
        }
    }


}

formAD.addEventListener('submit', changeDataPasswordAd)

//severs y backup
const server1 = document.getElementById('web1')
const server2 = document.getElementById('web2')
const server3 = document.getElementById('web3')
const editS1 = document.getElementById('editS1')
const editS2 = document.getElementById('editS2')
const editS3 = document.getElementById('editS3')
const testS1 = document.getElementById('testS1')
const testS2 = document.getElementById('testS2')
const testS3 = document.getElementById('testS3')
const saveS1 = document.getElementById('saveS1')
const saveS2 = document.getElementById('saveS2')
const saveS3 = document.getElementById('saveS3')
const spinner1 = document.getElementById('spinner1')
const spinner2 = document.getElementById('spinner2')
const spinner3 = document.getElementById('spinner3')

spinner1.style.display = "none"
spinner2.style.display = "none"
spinner3.style.display = "none"

server1.disabled = true
server2.disabled = true
server3.disabled = true

testS1.disabled = true
testS2.disabled = true
testS3.disabled = true

saveS1.disabled = true
saveS2.disabled = true
saveS3.disabled = true
let veditingS1 = false
let veditingS2 = false
let veditingS3 = false
console.log();
async function editingS1(eve) {
    eve.preventDefault()

    veditingS1 = !veditingS1
    if (veditingS1) {
        server1.disabled = false
        testS1.disabled = false

        editS1.value = 'Cancelar'
    } else {
        server1.disabled = true
        testS1.disabled = true
        saveS1.disabled = true
        editS1.value = 'Editar'
    }

}
editS1.addEventListener('click', editingS1)
async function testingS1(eve) {
    eve.preventDefault()
    try {
        spinner1.style.display = "block"
        const resS1 = await fetch(`${server1.value}/getajustes`)
        const dataS1 = await resS1.json()
        console.log(dataS1);
        if (dataS1) {
            spinner1.style.display = "none"
            alert('Conexion exitosa')
            web1.disabled = true
            saveS1.disabled = false

        }
    }
    catch (e) {
        alert('NO HAY Conexion con servidor' + server1.value)
        spinner1.style.display = "none"
    }

}
testS1.addEventListener('click', testingS1)

saveS1.addEventListener('click', async (e) => {
    e.preventDefault()
    console.log(web1.value);
    let dataS1 = { server1: web1.value, id: idajustes.value }
    try {
        const resS1 = await fetch('/updates1', {
            method: "POST",
            body: JSON.stringify(dataS1),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const resserver = await resS1.json()
        console.log(resserver)

        editS1.value = 'Editar'
        veditingS1 = false
        testS1.disabled = true
        saveS1.disabled = true;
        alert('Se ha alterado SERVER 1 a' + dataS1.server1)
    }
    catch (e) {
        console.log(e);
        saveS1.disabled = true;
        alert('Error')

    }

})

async function editingS2(eve) {
    eve.preventDefault()

    veditingS2 = !veditingS2
    if (veditingS2) {
        server2.disabled = false
        testS2.disabled = false
        editS2.value = 'Cancelar'
    } else {
        server2.disabled = true
        testS2.disabled = true
        saveS2.disabled = true
        editS2.value = 'Editar'
    }

}
editS2.addEventListener('click', editingS2)

async function testingS2(eve) {
    eve.preventDefault()
    try {
        spinner2.style.display = "block"
        const resS = await fetch(`${server2.value}/getajustes`)
        const dataS = await resS.json()
        console.log(dataS);
        if (dataS) {
            alert('Conexion exitosa')
            saveS2.disabled = false
            spinner2.style.display = "none"
            web2.disabled = true
        }
    }
    catch (e) {
        alert('NO HAY Conexion con servidor' + server2.value)
        spinner2.style.display = "none"
    }

}
testS2.addEventListener('click', testingS2)

saveS2.addEventListener('click', async (e) => {
    e.preventDefault()
    console.log(web2.value);
    let dataS2 = { server2: web2.value, id: idajustes.value }
    try {
        const resS2 = await fetch('/updates2', {
            method: "POST",
            body: JSON.stringify(dataS2),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const resserver = await resS2.json()
        console.log(resserver)

        editS2.value = 'Editar'
        veditingS2 = false
        testS2.disabled = true
        saveS2.disabled = true;
        alert('Se ha alterado SERVER 2 a' + dataS2.server2)
    }
    catch (e) {
        console.log(e);
        saveS2.disabled = true;
        alert('Error')

    }

})

saveS3.addEventListener('click', async (e) => {
    e.preventDefault()
    console.log(web3.value);
    let dataS3 = { server3: web3.value, id: idajustes.value }
    try {
        const resS3 = await fetch('/updates3', {
            method: "POST",
            body: JSON.stringify(dataS3),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const resserver = await resS3.json()
        console.log(resserver)

        editS3.value = 'Editar'
        veditingS3 = false
        testS3.disabled = true
        saveS3.disabled = true;
        alert('Se ha alterado SERVER 3 a' + dataS3.server3)
    }
    catch (e) {
        console.log(e);
        saveS3.disabled = true;
        alert('Error')

    }

})

async function editingS3(eve) {
    eve.preventDefault()

    veditingS3 = !veditingS3
    if (veditingS3) {
        server3.disabled = false
        testS3.disabled = false
        editS3.value = 'Cancelar'
    } else {
        server3.disabled = true
        testS3.disabled = true
        saveS3.disabled = true
        editS3.value = 'Editar'
    }

}
editS3.addEventListener('click', editingS3)


async function testingS3(eve) {
    eve.preventDefault()
    try {
        spinner3.style.display = 'flex'
        const resS = await fetch(`${server2.value}/getajustes`)
        const dataS = await resS.json()
        console.log(dataS);
        if (dataS) {
            alert('Conexion exitosa')
            saveS3.disabled = false
            spinner3.style.display = 'none'
            web3.disabled = true
        }
    }
    catch (e) {
        alert('NO HAY Conexion con servidor' + server3.value)
        spinner3.style.display = 'none'
    }

}
testS3.addEventListener('click', testingS3)

const cierre = document.getElementById('cierre')
const bc = document.getElementById('bc')
const horacierre = document.getElementById('horacierre')
const horabc = document.getElementById('horabc')
const botonedithoracierre = document.getElementById('botonhoracierre')
const botonedithorabc = document.getElementById('botonhorabc')
const botonsavehoracierre = document.getElementById('botonsavehoracierre')
const botonsavehorabc = document.getElementById('botonsavehorabc')

horacierre.value = moment(new Date(cierre.value)).format('HH:mm')
horabc.value = moment(new Date(bc.value)).format('HH:mm')
horacierre.disabled = true
horabc.disabled = true
botonsavehoracierre.disabled = true
botonsavehorabc.disabled = true
let vareditarcierre = false
let vareditarbc = false
let originalhoracierre = horacierre.value
let originalhorabc = horabc.value

botonedithoracierre.addEventListener('click', e => {
    e.preventDefault();
    vareditarcierre = !vareditarcierre
    if (vareditarcierre) {
        horacierre.disabled = false
        botonedithoracierre.value = 'Cancelar'
        horacierre.focus()
        botonsavehoracierre.disabled = false


    } else {
        horacierre.disabled = true
        botonedithoracierre.value = 'Editar'
        botonsavehoracierre.disabled = true

    }

    /* let current = moment(horacierre.value, 'HH:mm')
    const stime = moment('00:30', "HH:mm")
    const ftime = moment('06:30', "HH:mm")
    let valid = current.isBetween(stime, ftime)
    console.log(valid);
    if (!valid) {
        if (!confirm('Please enter a valid time')) return
    }
    console.log(moment(horacierre.value, 'HH:mm'));
    botonsavehoracierre.disabled = false
 */
})
botonedithorabc.addEventListener('click', e => {
    e.preventDefault();
    vareditarbc = !vareditarbc
    if (vareditarbc) {
        horabc.disabled = false
        botonedithorabc.value = 'Cancelar'
        horabc.focus()
        botonsavehorabc.disabled = false


    } else {
        horabc.disabled = true
        botonedithorabc.value = 'Editar'
        botonsavehorabc.disabled = true

    }

    /*  */
})
botonsavehoracierre.addEventListener('click', async (e) => {
    e.preventDefault()
    let current = moment(horacierre.value, 'HH:mm')
    const stime = moment('00:00', "HH:mm")
    const ftime = moment('24:00', "HH:mm")
    let valid = current.isBetween(stime, ftime)
    let ahora = moment(new Date(), 'HH:mm')
    let ahora5 = moment(new Date()).add(5, 'minutes')
    console.log(ahora5.format('HH:mm'), current.format('HH:mm'), ahora.format('HH:mm'));
    let validoawake = current.isBetween(ahora, ahora5)
    let horacierreorigen = moment(originalhoracierre, 'HH:mm')
    let antes = JSON.parse(JSON.stringify(originalhoracierre))
    let horacierreorigenlimit = moment(antes, 'HH:mm').add(10, 'minutes')
    let horacierreorigenllow = moment(originalhoracierre, 'HH:mm').subtract(10, 'minutes')
    let validoanterior = current.isBetween(horacierreorigen, horacierreorigenlimit)
    console.log(ahora, current, ahora5)
    console.log(horacierreorigen, current, antes, horacierreorigenlimit, validoanterior)
    if (!valid) {
        alert('Introduce una hora valida')
        horacierre.focus()
        
        return
    }
    else if (validoawake) {
        alert('Introduce una hora valida superior a ' + ahora5.format('HH:mm'))
        horabc.focus()
        horacierre.value = horacierreorigen.format('HH:mm')
        return
    } else if (validoanterior) {
        alert('Introduce una hora valida superior en 10 min a ' + horacierreorigenlimit.format('HH:mm'))
        horabc.focus()
        horacierre.value = horacierreorigen.format('HH:mm')
        return

    }
    console.log(new Date(moment(horacierre.value, 'HH:mm')));
    let horacierrdata = new Date(moment(horacierre.value, 'HH:mm'))
    let datahoracierre = { horacierre: horacierrdata, id: idajustes.value }
    try {
        const resservercierre = await fetch('/actualizarhoracierre', {
            method: "POST",
            body: JSON.stringify(datahoracierre),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const resserver = await resservercierre.json()
        console.log(resserver)
        vareditarcierre = false;
        botonedithoracierre.value = 'Editar'
        horacierre.disabled = true
        botonsavehoracierre.disabled = true
        alert('Se alterado la hora de cierre con exito')
        window.location.reload()

    }
    catch (e) {
        alert('Error')
    }


})
botonsavehorabc.addEventListener('click', async (e) => {
    e.preventDefault()
    let current = moment(horabc.value, 'HH:mm')
    const stime = moment('00:00', "HH:mm")
    const ftime = moment('24:00', "HH:mm")
    let valid = current.isBetween(stime, ftime)
    let ahora = moment(new Date(), 'HH:mm')
    let ahora5 = moment(new Date()).add(5, 'minutes')


    let horabcorigen = moment(originalhorabc, 'HH:mm')
    let antes = JSON.parse(JSON.stringify(originalhorabc))
    let horabcorigenlimit = moment(antes, 'HH:mm').add(5, 'minutes')
    let horabcorigenllow = moment(originalhorabc, 'HH:mm').subtract(10, 'minutes')
    let validoanterior = current.isBetween(horabcorigen, horabcorigenlimit)


    console.log(ahora5.format('HH:mm'), current.format('HH:mm'), ahora.format('HH:mm'));
    let validoawake = current.isBetween(ahora, ahora5)
    console.log(validoawake);
    if (!valid) {
        alert('Introduce una hora valida entre')
        horabc.focus()
        return
    } else if (validoawake) {
        alert('Introduce una hora valida superior  a ' + ahora5.format('HH:mm'))

        horabc.focus()
        horabc.value=horabcorigen.format('HH:mm')
        return
    }
    else if(validoanterior){
        alert('Introduce una hora valida superior a ' +horabcorigenlimit.format('HH:mm'))
        horabc.focus()
        horabc.value=horabcorigen.format('HH:mm')
        return
        
    }
    console.log(new Date(moment(horabc.value, 'HH:mm')));
    let nuevahora = new Date(moment(horabc.value, 'HH:mm'))
    let datahorabc = { horabc: nuevahora, id: idajustes.value }
    try {
        const resnuevahora = await fetch(`/actualizarhorabc`, {
            method: "POST",
            body: JSON.stringify(datahorabc),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const resserver = await resnuevahora.json()
        console.log(resserver);

        vareditarbc = false;
        botonedithorabc.value = 'Editar'
        horabc.disabled = true

        botonsavehorabc.disabled = true
        alert('Se alterado la hora de backups con exito')
        window.location.reload()

    } catch (e) {
        alert('Error')
    }


})
const solad = document.getElementById('soladvalue')
const soladClick = document.getElementById('soladClick')
const elegirvalue = document.getElementById('elegirvalue')
const verTodoClick = document.getElementById('verTodoClick')
async function cabiarTodas(event) {
    event.preventDefault()
    console.log(elegirvalue.value);

    let dd = 0
    if (elegirvalue.value == 1 || elegirvalue.value == '1') {

        dd = 3
    } else {
        console.log(false);
        dd = 1
    }
    console.log(dd);


    let datadata = { elegir: dd, id: idajustes.value }
    console.log(datadata);

    try {
        const res = await fetch(`/actualizarelegir`, {
            method: "POST",
            body: JSON.stringify(datadata),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        if (data) {
            alert('se ha ca')
            window.location.reload()
        }
    } catch (e) {
        console.log(e);
        alert('NO')
    }
}
verTodoClick.addEventListener('click', cabiarTodas)

async function cabiarSoload(event) {
    event.preventDefault()

    let dd = false
    if (soladvalue.value == true || soladvalue.value == 'true') {
        console.log(true);
        dd = false
    } else {
        console.log(false);
        dd = true
    }
    console.log(dd);


    let datadata = { solad: dd, id: idajustes.value }
    console.log(datadata);

    try {
        const res = await fetch(`/actualizarsolad`, {
            method: "POST",
            body: JSON.stringify(datadata),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        if (data) {
            alert('se ha ca')
            window.location.reload()
        }
    } catch (e) {
        console.log(e);
        alert('NO')
    }
}
soladClick.addEventListener('click', cabiarSoload)

const todoValue = document.getElementById('todoValue')
const todoClick = document.getElementById('todoClick')
async function clickTodo(event) {
    //event.preventDefault()

    let dd = false
    if (todoValue.value == true || todoValue.value == 'true') {
        console.log(true);
        dd = false
    } else {
        console.log(false);
        dd = true
    }
    console.log(dd);


    let datadata = { todo: dd, id: idajustes.value }
    console.log(datadata);

    try {
        const res = await fetch(`/actualizartodo`, {
            method: "POST",
            body: JSON.stringify(datadata),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        if (data) {
            alert('se ha ca')
            window.location.reload()
        }
    } catch (e) {
        console.log(e);
        alert('NO')
    }

}
todoClick.addEventListener('click', clickTodo)



const home = document.getElementById('home')

const elegirOrigenvalue = document.getElementById('elegirOrigenvalue')
const verOrigenClick = document.getElementById('verOrigenClick')
async function clickOrigen(event) {
    event.preventDefault()

    let dd = ''
    if (elegirOrigenvalue.value == 'remoto') {
        console.log(true);
        dd = 'local'
    } else {
        console.log(false);
        dd = 'remoto'
    }
    console.log(dd);


    let datadata = { todo: dd, id: idajustes.value }
    console.log(datadata);

    try {
        const res = await fetch(`/actualizarorigen`, {
            method: "POST",
            body: JSON.stringify(datadata),
            headers: {
                "Content-Type": "application/json"
            }
        })
        const data = await res.json()
        if (data) {
            alert('se ha ca')
            window.location.reload()
        }
    } catch (e) {
        console.log(e);
        alert('NO')
    }

}
verOrigenClick.addEventListener('click', clickOrigen)

