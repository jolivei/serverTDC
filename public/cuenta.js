

const PUBLIC_VAPID_KEY =
  "BDyQInGvlceg7IEYRq-vmqNR-ftNoUZTXp3ivbZx-nMwaY_ILZCjSdmr0LBdxu6lLlBdT0cbp6MJc8Iio41jl8I";

//macaddressuire('../node_modules/macaddress/index')

const subscription = async () => {
  // Service Worker
  console.log("Registering a Service worker");
  const register = await navigator.serviceWorker.register("/worker.js", {
    scope: "/usuario"
  });
  console.log("New Service Worker");

  // Listen Push Notifications
  console.log("Listening Push Notifications");
  const subscription =
    await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY),


    });
  //  console.log(subscription); 
  const iduser = document.getElementById('iduser')
  // Send Notification
  let subscripcion1 = subscription
  let iduservalue = iduser.value
  console.log(iduser.value);
  let aaa = JSON.stringify(subscripcion1)//+','+JSON.stringify({iduser:iduser.value})
  let bbb = JSON.parse(aaa)
  //console.log(aaa);
  //console.log(bbb,32);
  const bb=await fetch(`/usuario/subscription/${iduservalue}`, {
    method: "POST",
    body: JSON.stringify(subscription),
    headers: {
      "Content-Type": "application/json"
    }
  });
  const ccc=await bb.json();
  console.log(ccc);
  console.log("Subscribed!");
};

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const message = document.querySelector('#message');
message.addEventListener('click', (e) => {
  e.preventDefault();
  fetch('/new-message', {
    method: 'POST',
    body: JSON.stringify({ message: message.value }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
})

// Service Worker Support
if ("serviceWorker" in navigator) {
  subscription().catch(err => console.log(err));
}
/* enviar.addEventListener('click', (e)=>{
 e.preventDefault()
 let datos={usuario:usuario.value,contrasena:contrasena.value}
   fetch(`/usuario`, {
   method: "POST", 
   body: JSON.stringify(datos),
    headers: {
     "Content-Type": "application/json"
   }


 }).then(res=>{
   console.log(res.json());
 }).catch(e=>{
   console.log(e);
 })
 //formulario.reset()
 //await fetch('/usuario')
 //formEntrada.remove()
// console.log(datos);
 

},false) */
