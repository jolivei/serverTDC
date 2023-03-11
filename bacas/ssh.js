const { execute } = require('@getvim/execute');
const path = require('path');
async function getRe(){
    try {
        let key=path.join(__dirname,'id_rsa')
        //const res=await execute(`ssh -i ${key} pi@tabernasaid.duckdns.org 'touch  hola'`)
        const res=await execute(`ssh -i ${key} pi@tabernasaid.duckdns.org 'touch hola;'`);
        //const res=await execute(`cat id_rsa `)
    console.log(res);
    } catch (error) {
        console.log(error);
    }
    
}
getRe()