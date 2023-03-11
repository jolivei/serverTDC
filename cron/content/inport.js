/* const a =require('./test')
a.subscribe(r=>console.log(r))
//console.log(a,'recibir'); */
const moment=require('moment')

console.log("Current year is:", moment().year())
let newdate=moment("01/03/2024", "DD/MM/YYYY")
console.log("Current year is:", newdate.dayOfYear())