const formulario=document.getElementById('formulario')
const usuario=document.getElementById('usuario')
const contrasena=document.getElementById('contrasena')
const enviar=document.getElementById('enviar')
const formEntrada=document.getElementById('formulariodata')
const col=document.getElementById('col')
//const botonalta=document.getElementById('botonalta')
console.log(usuario);
 enviar.addEventListener('click',  async (e)=>{
  //e.preventDefault()
  /* let datos={usuario:usuario.value,contrasena:contrasena.value}
   const res=await  fetch(`/usuario`, {
    method: "POST", 
    body: JSON.stringify(datos),
     headers: {
      "Content-Type": "application/json"
    }
  })
  
  console.log(res);  */
  /* .then(res=>{
    console.log(res.json(),'oooooo');
  }).catch(e=>{
    console.log(e);
  }) */
  //formulario.reset()
  //await fetch('/usuario')
  //formEntrada.remove()
 // console.log(datos);
  

},false) 

