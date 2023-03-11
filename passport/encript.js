
const bcrypt=require('bcrypt')
funciones={
    }
funciones.encriptar= async (pass)=>{
    const saltRounds=10
    let hashedPass= await bcrypt.hash(pass, saltRounds)
    console.log(hashedPass);
    return hashedPass
    

}
funciones.compararPass=async (pass, passencripted)=>{
    
    const match = await bcrypt.compare(pass, passencripted);
         if(match)        return true
         else{
             return false
         } 
    //return bcrypt.compareSync(pass,passencripted)
}
module.exports=funciones