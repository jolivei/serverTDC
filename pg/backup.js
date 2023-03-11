const { execute } = require('@getvim/execute');
const dotenv = require('dotenv');
dotenv.config();
const username = 'pi'// process.env.DB_USER
const database ='tabernadacalzada' //process.env.DB_NAME
const pghost =  'epimast.duckdns.org'// process.env.pghost
//const compress = require('gzipme');
const fs = require('fs');
const cron = require('node-cron');
const pgdb = require('./conpgtaberna')

console.log(username);



async function backuppsql() {
    const date = new Date();
    const currentDate = `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`;
    const currentDateNoti = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}.${date.getHours()}.${date.getMinutes()}`;
    //const fileName = `tabernadacalzada-backup-${currentDate}.tar`;
    const fileName = `tabernadacalzada-backup-${currentDate}.sql`;
    const fileNameGzip = `${fileName}.gz`;
   // `psql -U pi  -h localhost basetaberna < tabernadacalzada100222.sql`
    //`pg_dump -U pi  -h localhost tabernadacalzada > tabernadacalzada100222.sql  `

    try { 
        //await execute(`pg_dump -U ${username} -d ${database} -f ${fileName} -F t`);
        //await compress(fileName);
        console.log('jjjjjjj');
        await execute(`pg_dump -U ${username} -h ${pghost} tabernadacalzada  | gzip >${fileName}.gz`);
        
        //fs.unlinkSync(fileName);
        //await enviarSubs(`Backup Realizado en Local Server el: ${currentDateNoti}`)
        //await execute(`scp ${fileNameGzip}  aisha:/home/pi/backupPost`)
        //await execute(`rsync --rsh=ssh ${fileNameGzip}  aisha:/home/pi/backupPost`)
        //await execute(`rsync --rsh=ssh ${fileName}.gz  aisha:/home/pi/backupPost`)
        //await execute(`mv ${fileNameGzip}  bacas/`)
        await execute(`mv ${fileName}.gz  bacas/`)
        //await enviarSubs(`Backup Guardado en Remote  Server el ${currentDateNoti}`)
        //await execute(`ssh aisha pg_restore -d ${database} /home/pi/backupPost/${fileName}`)

    }
    catch (e) {
        console.log(e);
    }
}
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
                //await pgdb.any('delete    from usuariosnotificaciones where credenciales=$1', [el.credenciales])
            } catch (e) {
                console.log(e);
            }

        }

    }

    )
}

let bac = () => {
    
    cron.schedule('* * * * *', async () => {
        ///await backuppsql()
        console.log(username,database,pghost);
       
        

    })

}
bac()
//module.exports = bac