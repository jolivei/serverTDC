
const moment=require('moment');

let dia = moment(new Date())
startdate = dia.subtract(7, "days");
let ulti7dias=startdate.format("YYYY-MM-DD")+' 04:00'

var d = new Date();
let inicio= d.setDate(d.getDate()-5);
console.log(new Date(inicio));