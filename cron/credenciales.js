const fetch = require('node-fetch')
let n=1
setInterval(async function() {
    
    try {
        const ff= await fetch('https://5a0e-31-221-141-118.ngrok.io/testingconexion')
    const rr=await ff.json()
    
    n=n+1
    console.log(rr,n);
        
    } catch (error) {
        console.log(error);
    }
    

}, 100); // every 5 minutes (300000)
