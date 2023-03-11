const { execute } = require('@getvim/execute');
const { spawn } = require('child_process');
const dotenv = require('dotenv');
const { createWriteStream } = require('fs');
const { promisify } = require('util');
dotenv.config();
const username = process.env.DB_USER
const database = process.env.DB_NAME
const pgpass = process.env.PGPASS
const host = process.env.host
const port = '5432';




const fs = require('fs');
const cron = require('node-cron');
const pgdb = require('../pg/conpgtaberna')
const { Router } = require('express')
const router = Router()

const adfb = require('../firebase/firestore');
const dbfb = adfb.firestore()

const horabcCollection = dbfb.collection("horabc")
const command = 'pg_dump "host=192.168.1.200 port=5432 dbname=tabernadacalzada user=pi password=200271"  | gzip  > tabernadacalzada-backup';
const shell = '/bin/sh';

async function executeShellCommand(pgdumpcomand) {
  const childProcess = spawn(shell, ['-c', pgdumpcomand], { stdio: 'inherit' });
  return new Promise((resolve, reject) => {
    childProcess.on('error', (err) => reject(err));
    childProcess.on('exit', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`El comando "${command}" terminó con un código de salida ${code}`));
      }
    });
  });
}
async function main(pgdumpcomand) {
    try {
      await executeShellCommand(pgdumpcomand);
      console.log('Comando ejecutado exitosamente');
      return true
    } catch (error) {
      console.error(`Error al ejecutar el comando: ${error}`);
      return false
    }
  }

const backuppostgres = async () => { //async function backuppsql() {
    const date = new Date();
    console.log(date, 20);
    const currentDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`;
    const currentDateNoti = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}.${date.getHours()}.${date.getMinutes()}`;
    //const fileName = `tabernadacalzada-backup-${currentDate}.tar`;
    Math.random()
    const fileName = `tabernadacalzada-backup-${currentDate}.sql`;
    const fileNameGzip = `${fileName}.gz`;
    // `psql -U pi  -h localhost basetaberna < tabernadacalzada100222.sql`
    //`pg_dump -U pi  -h localhost tabernadacalzada > tabernadacalzada100222.sql  `

    try {
        //await execute(`pg_dump -U ${username} -d ${database} -f ${fileName} -F t`);
        //await compress(fileName);
        //await execute(`pg_dump -U pi -h localhost tabernadacalzada  | gzip >${fileName}.gz`);
        //await execute(`docker exec postgres_docker pg_dump -U pi tabernadacalzada | gzip  > ${fileName}.gz`);
        //await execute(`gzip ${fileName}.gz`);
        //await execute(`pg_dump "host=192.168.1.200 port=5432 dbname=${database} user=pi password=${pgpass}"  | gzip  > ${fileName}.gz`);
        const pgDumpCommand = `pg_dump "host=${host} port=${port} dbname=${database} user=${username} password=${pgpass}" | gzip >  ${fileName}.gz`
        console.log(pgDumpCommand);
        await main(pgDumpCommand)

        //const gzip = createGzip();
        //const writeStream = createWriteStream(backupFile);

      /*   const pipeline = promisify(require('stream').pipeline);
        async function backup() {
            try {
              await pipeline(pgDump.stdout);
              console.log('Backup creado con éxito');
            } catch (error) {
              console.error(`Error al crear el backup: ${error}`);
            }
          }
          await backup() */
        //fs.unlinkSync(fileName);
        //await enviarSubs(`Backup Realizado en Local Server el: ${currentDateNoti}`)
        //await execute(`scp ${fileNameGzip}  aisha:/home/pi/backupPost`)
        //await execute(`rsync --rsh=ssh ${fileNameGzip}  aisha:/home/pi/backupPost`)

        //await execute(`scp  ${fileName}.gz  aisha:/home/pi/backupPost`)
        //await execute(`mv ${fileNameGzip}  bacas/`)
        console.log(new Date().getSeconds(), 42);

        await new Promise(r => setTimeout(r, 200 * 10));
        await main(`mv ${fileName}.gz  docker/backupPost`)
        await new Promise(r => setTimeout(r, 200 * 10));
        console.log(new Date().getSeconds(), 44);
        //await execute(`rsync --rsh=ssh backupPost/${fileName}.gz  aisha:/home/pi/backupPost`)    
        console.log(new Date().getSeconds(), 46);
        //restore docker exec -i <postgres_container_name> psql -U postgres -d <database_name> < backup.sql

        //await enviarSubs(`Backup Guardado en Remote  Server el ${currentDateNoti}`)
        //await execute(`ssh aisha pg_restore -d ${database} /home/pi/backupPost/${fileName}`)
        return true
    }
    catch (e) {
        console.log(e, 57);
        return false
        res.send(false)
    }
}
async function getIDhoraBc() {
    let idArray = []
    const idhorabcCollecction = await horabcCollection.get()
    idhorabcCollecction.forEach(el => {
        const id = el.id
        idArray.push(id)
    })
    return idArray[0]
}

const observer = horabcCollection.onSnapshot(async docSnapshot => {

    // const idhorabc = await  getIDhoraBc()
    //const idresultadobc =await  getIDresultadoBc() 

    docSnapshot.forEach(async snapshot => {
        console.log(new Date(snapshot.data().bccomandas.toDate()).getMinutes(), 34)
        let minuto = new Date(snapshot.data().bccomandas.toDate()).getMinutes() + 1
        let hora = new Date(snapshot.data().bccomandas.toDate()).getHours()
        console.log(hora, minuto, 78);
        cron.schedule(`${minuto} ${hora} * * *`, async () => {
            console.log('hora', 83)
            await main(command)
            const bac = await backuppostgres()


             if (bac == true) {

                try {
                    console.log(bac, 40);
                    const horabc1 = await pgdb.any(`update horabackup set horabackup=$1 returning*`, [new Date()])
                    console.log(horabc1);
                } catch (error) {
                    console.log(error);
                }

            } 
        })
    })
})



//backuppostgres()

const webpush = require('web-push')
async function enviarSubs(mensaje) {
    //const data=//await pgdb.one('select actualidado from usuarios where idusuariopg=5')//
    //fs.readFileSync('subs.txt',{encoding:'utf8', flag:'r'})
    /* let token =//data//
    JSON.parse(data)
    console.log(token); */
    const datapg = await pgdb.any('select credenciales from usuariosnotificaciones where idusuariopg=5')
    console.log(datapg);
    datapg.forEach(async (el) => {
        const payload = JSON.stringify({
            title: "BACKUPS POSTGRES",
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

let bac = () => {

    /* cron.schedule('1 * * * *', async () => {
        await backuppsql()
       
        

    }) */

}
module.exports = bac
