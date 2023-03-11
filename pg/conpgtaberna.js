
const dotenv = require('dotenv');
dotenv.config();
let postgreshost = process.env.pghost
console.log(postgreshost);
//const firead = require('../firebase/firestore')
//const bdfb = firead.firestore()

 const cn = {
    host: '192.168.1.200',//postgreshost,//'localhost',//'192.168.1.95', 'epimast.duckdns.org', //'horton.elephantsql.com',//'casaraspi.ddns.net', // 'localhost' is the default;
    port: 5432, // 5432 is the default;
    database: 'tabernadacalzada',//process.env.DB_NAME,//'tabernadacalzada',// 'mvtjhnoj',//'ld',
    user: 'pi',//process.env.DB_USER,//'pi', //'mvtjhnoj',//'postgres',
    password: '200271',//, process.env.PGPASS//'200271'//'7tslWmrmIvpMfw4nXnzk55eT7a_ol1tt'//'200271'
    ssl: false
}; 
 
const pgp = require('pg-promise')(/*options*/)
const db = pgp(cn); // database instance; 
module.exports = db; 
