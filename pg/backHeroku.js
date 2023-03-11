const pgdb = require('./conpgtaberna')
const pgdbHeroku = require('./conpgtabernaHeroku')
console.log('jjjj');
async function usuarios(){
    const usu=await pgdbHeroku.any('select * from usuarios')
    console.log(usu);
    /* for (let el of usu){
        await pgdbHeroku.any('insert into usuarios (idusuariopg,uid,rol,usuario,email,baja,idusuariofs,pass,credenciales,actualizado) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)',[el.idusuariopg,el.uid,el.rol,el.usuario,el.email,el.baja,el.idusuariofs,el.pass,el.credenciales,el.actualizado])
    } */
}
usuarios()
async function usuariosnotificaciones(){
    const usu=await pgdb.any('select * from usuariosnotificaciones')
    console.log(usu);
    for (let el of usu){
        await pgdbHeroku.any('insert into usuariosnotificaciones (idusuarionotificaciones,idusuariopg,credenciales,created_at,actualizado,idusuariofb) values($1,$2,$3,$4,$5,$6)',[el.idusuarionotificaciones,el.idusuariopg,el.credenciales,el.created_at,el.actualizado,el.idusuariofb])
    }
}
//usuariosnotificaciones()