
 const admin = require('firebase-admin');
 const path = require('path');
require('dotenv').config()

console.log(process.env.FIREBASE_PROJECT_ID,'ooooo');
admin.initializeApp({
    //credential: admin.credential.cert(ruta)
   credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    })
});
const db = admin
module.exports= db;
