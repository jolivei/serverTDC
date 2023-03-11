const formulario=document.getElementById('formulario')
const usuario=document.getElementById('usuario')
const contrasena=document.getElementById('contrasena')
const repcontrasena=document.getElementById('repcontrasena')
const enviar=document.getElementById('enviar')
const formEntrada=document.getElementById('formulariodata')
const col=document.getElementById('col')
const botoninicio=document.getElementById('inicio')
console.log(usuario);
enviar.addEventListener('click',  async (e)=>{
    //e.preventDefault()
    
    
    let datos={usuario:usuario.value,contrasena:contrasena.value, repcontrasena:repcontrasena.value}
    if(datos.usuario=='' || datos.contrasena=='') {
        alert('Debes copletar los capos')
        e.preventDefault()
        return
    }
    if(datos.repcontrasena!= datos.contrasena) {
        alert('Las contraseñas deben ser iguales')
        e.preventDefault()
        return
    }
     /* const res=await  fetch(`/usuario`, {
      method: "POST", 
      body: JSON.stringify(dat-os),
       headers: {
        "Content-Type": "application/json"
      }
    })
  */
    
  
  },false)
botoninicio.addEventListener('click', e=>{
    location.href='/'
}) 
