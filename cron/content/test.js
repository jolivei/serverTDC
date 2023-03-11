const adfb = require('../../firebase/firestore');
const dbfb = adfb.firestore()

/* const doc = dbfb.collection("ajustes").doc('64loWobvunc6kuzm2tK2')//.get()
//onst ver=document.getElementById('vernu')
const clock11$ = new Observable((subject) => {
    console.log('In Observable');
    //const interval = setInterval(() => {
       const obs= doc.onSnapshot(docSnapshot => {
            //console.log(`Received doc snapshot: ${docSnapshot}`);
        //    console.log(docSnapshot.data());
            subject.next(docSnapshot.data().nu)
            // ...
           
        }, err => {
            console.log(`Encountered error: ${err}`);
        })
        
    //}, 1000);
    //setTimeout(() => clearInterval(interval), 7 * 1000);
 }).pipe(tap(items => {return items} ));
 
 //const subscription = clock11$.subscribe(console.log);
 clock11$.subscribe(re=>{

 });
 module.exports = clock11$
 setTimeout(() => subscription.unsubscribe(), 100 * 1000);
const observer = new Observable(S=> {
    
})
    .pipe(map(items => items));
 */
//console.log(observer );
/* getPassSubs().subscribe(snap=>{
  snap.forEach((el)=>{
      let datos=el.payload.doc.data()
      console.log(datos);
      
    })
}) */
 /* const clock1$ = new Observable((subject) => {
    console.log('In Observable');
    //const interval = setInterval(() => {
    let tt = []
    const doc=dbfb.collection("ajustes")//. get().then((querySnapshot) => {
        .querySnapshot.forEach((doc) => {
            console.log(`${doc.id} => ${doc.data().horabc.toDate()}`);
            tt.push(doc.data().local)
            subject.next(doc.id);
        });

    }) 
    */ //}, 1000);
    //setTimeout(() => clearInterval(interval), 7 * 1000);
    /* const observer = doc.onSnapshot(docSnapshot => {
        //console.log(`Received doc snapshot: ${docSnapshot}`);
        docSnapshot.forEach(snapshot =>{
            console.log(new Date(snapshot.data().horabc.toDate()).getMinutes())
         
            let ninutos=new Date(snapshot.data().horabc.toDate()).getMinutes()
            cron.schedule(`${ninutos} * * * *`, async () => {
                console.log(ninutos,'ver');
            })

            subject.next(new Date(snapshot.data().horabc.toDate()).getMinutes())
        })
        // ...
    }, err => {
        console.log(`Encountered error: ${err}`);
    }); *//*
}); */
/* let a=40
const subscription = clock$.subscribe(r => {
    console.log(r,'subs');
    this.a=r
    cron.schedule(`${this.a} * * * *`, async () => {
        console.log(this.a);
    })
     /* cron.schedule(`* * * * *`, async () => {
        console.log(new Date().getMinutes());
    })  *//*

});
console.log(a)



setTimeout(() => subscription.unsubscribe(), 1000); 
 */
const pgp = require('pg-promise')(/*options*/)
const { Observable,combineLatest,timer,pipe,map,tap,take,interval} = require('rxjs');

 function getValueFromObservable() {
        const clock$ = new Observable((subject) => {
            console.log('In Observable');
            const interval = setInterval(() => {
                subject.next(new Date().getSeconds());
            }, 4000);
            setTimeout(() => clearInterval(interval), 10 * 1000);
         })
         let bbb
         const cc=clock$.subscribe(r=>{
             bbb=r
             console.log(bbb);
             
         })
         console.log(bbb);
         cc.unsubscribe()
     return bbb
 }
 let a =getValueFromObservable()
 console.log(a);
 const source$ = new Observable.interval(1000).take(3); // 0, 1, 2
 // waits 3 seconds, then logs "2".
 // because the observable takes 3 seconds to complete, and 
 // the interval emits incremented numbers starting at 0
 async function test() {
   console.log(await source$.toPromise());
 }
/* const subscription = clock$.subscribe(async e=>{
    
    
     const cn = {
        host: 'localhost',//postgreshost,//'localhost',//'192.168.1.95', 'epimast.duckdns.org', //'horton.elephantsql.com',//'casaraspi.ddns.net', // 'localhost' is the default;
        port: 5432, // 5432 is the default;
        database: 'tabernadacalzada',//process.env.DB_NAME,//'tabernadacalzada',// 'mvtjhnoj',//'ld',
        user: 'postgres',//process.env.DB_USER,//'pi', //'mvtjhnoj',//'postgres',
        password: '200271',//process.env.PGPASS//'200271'//'7tslWmrmIvpMfw4nXnzk55eT7a_ol1tt'//'200271'
    }; 
     
    
    const db = pgp(cn); // database instance;
    try {
       const res= await db.any(`select * from usuarios limit(${e})`)
       console.log(res,new Date().getSeconds());
    } catch(error){
        console.log(error);
    } finally {
        pgp.end()
    }
    

 }); */
 /*  
 setTimeout(()=>{
    console.log('DESscrito',new Date().getSeconds()); 
    subscription.unsubscribe()} , 10 * 1000); */
     