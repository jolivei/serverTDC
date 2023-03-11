const passport = require('passport');
const localStrategy = require('passport-local').Strategy
const pgdblocal = require('../pg/conpgtaberna') //pglocal
const pgdb = require('../pg/conpgtabernaHeroku') // pgHeroku
const encriptar = require('./encript')
const firebaseadmin = require('../firebase/firestore')
const dbfb = firebaseadmin.firestore()
passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser(async (user, done) => {
  console.log(user.id, '12 des');
  try {
    const userCol = dbfb.collection('usuarios')
    const isonline = require('internet-available')
    console.log(new Date().getSeconds(), 'inic');
    await isonline()

    const usuario = await userCol.doc(user.id).get()


    done(null, usuario)

  } catch (error) {
    try {
      const usuario = await pgdb.one('select * from usuarios where idusuariofs=$1', [user.id])
      console.log('pgHeroku');


      done(null, usuario)

    } catch (error) {
      try {
        const usuario = await pgdblocal.one('select * from usuarios where idusuariofs=$1', [user.id])
        console.log('pgLocal');
        done(null, usuario)
      } catch (error) {

      }
    }

  }




})
passport.use('local-subscripcion', new localStrategy({
  usernameField: 'usuario',
  passwordField: 'contrasena',
  passReqToCallback: true
}, async (req, user, password, done) => {
  let usuario = {}
  usuario.email = user;
  usuario.password = password
  //
  //const user = await pgdb.one() usuario.email})
  console.log(usuario);
  passwordencriptado = await encriptar.encriptar(usuario.password)
  console.log(usuario, passwordencriptado);

  try {
    //const nuevousuario=await pgdb.one('insert into  usuarios (email,pass) values ($1,$2) returning *',[usuario.email,passwordencriptado])
    const userCol = dbfb.collection('usuarios')

    const userDoc = await userCol.where('email', "==", email).get()
    let userArray = []
    userDoc.forEach(el => {
      const id = el.id
      const email = el.data().email
      const pass = el.data().pass
      const uid = el.data().uid
      userArray.push({ id, email, pass, uid })
    })

    //console.log(userArray,43);
    const newUser = await userCol.doc(userArray[0].id).update({ pass: passwordencriptado })

    const nuevousuario = await pgdb.one('update  usuarios set pass=$1 where email=$2 returning *', [passwordencriptado, usuario.email])
    const nuevousuariolocal = await pgdblocal.one('update  usuarios set pass=$1 where email=$2 returning *', [passwordencriptado, usuario.email])

    //console.log(nuevousuario, newUser); 
    done(null, nuevousuario)

  } catch (e) {
    console.log(e);
    done(null, null)
  }

}))

passport.use('local-login', new localStrategy({
  usernameField: 'usuario',
  passwordField: 'contrasena',
  passReqToCallback: true
}, async (req, email, password, done) => {
  //console.log(`select * from usuarios where email=${email}`);
  //Is online
  /* try {
    console.log(70);
    const userCol = dbfb.collection('usuarios')
    const isonline = require('internet-available')
    console.log(new Date().getSeconds(), 'inic');
    await isonline({ retries: 2 })
    const userDoc = await userCol.where('email', "==", email).get()
    console.log(73);
    let userArray = []
    userDoc.forEach(el => {
      const id = el.id
      const email = el.data().email
      const pass = el.data().pass

      const uid = el.data().uid
      userArray.push({ id, email, pass, uid })
    })

    let user = userArray[0]
    //console.log(userArray[0],79);

    let comparar = await encriptar.compararPass(password, user.pass)
    console.log(userArray.length, comparar);
    if (userArray.length == 0) return done(null, false);
    if (userArray.length > 0 && !comparar) return done(null, false);
    console.log(user.email, '0000000000000000000');
    console.log(new Date().getSeconds(), 'fin');
    if (userArray.length > 0 && comparar) return done(null, user);
  } catch (e) {
   */  console.log(new Date().getSeconds(), 'ccatc');
  console.log('ppppp');
  //console.log(`select * from usuarios where email=${email}`);
  let user1 = null
  const userCol = dbfb.collection('usuarios')
  let userArray = []

  const userDoc = await userCol.where('email', "==", email).get()

  userDoc.forEach(el => {
    const id = el.id
    const email = el.data().email
    const pass = el.data().pass
    const uid = el.data().uid
    userArray.push({ id, email, pass, uid })
  })
  if (userArray.length == 1) user1 = userArray[0]
  else {
    try {
      user1 = await pgdb.one('select * from usuarios where email=$1', [email])

      user1.id = user1.idusuariofs

    } catch (error) {
      user1 = await pgdblocal.one('select * from usuarios where email=$1', [email])
      user1.id = user1.idusuariofs
    }



  }

  console.log(user1, 160);
  //const user1 = await pgdb.one('select * from usuarios where email=$1', [email])
  //user1.id = user1.idusuariofs
  ////console.log(await encriptar.encriptar(password))
  //console.log(user1, 94);
  if (!user1) {
    return done(null, false);
  }
  let compararpg = await encriptar.compararPass(password, user1.pass)
  console.log(compararpg, 166);
  if (user1 && !compararpg) {

    return done(null, false);
  }
  console.log(user1, compararpg, 107);
  return done(null, user1);
  //}

}));

