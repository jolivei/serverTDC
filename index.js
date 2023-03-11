const PORT = process.env.PORT || 3000;
const express = require("express");
const cors = require("cors");
const ajustes = require('./routes/adpass');
const users = require('./routes/users');
const index = require('./routes/index');
const changesettings = require('./routes/changesettings');
const savepg = require('./routes/savepg');
const guardarhistoricas=require('./routes/guardarhistoricas');
const backuprouter=require('./routes/backuprouter')
const path = require('path');
const update = require('./cron/cron')
const passport = require('passport');

//const session=require('express-session')
require('./passport/passport');
const session = require('express-session');
const app = express();
//const webpush = require('./webpush')

app.use(cors());
app.use(express.json());
app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, "public"));
//middes

//app.use(express.json())

app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))
const courses = [
  { id: 1, name: "Algorithms" },
  { id: 2, name: "Software Engineering" },
  { id: 3, name: "Human Computer Interaction" }
];
//app.use(passport.initialize())
app.use(session({
  //key:'usuario_cuenta',
  secret: 'mysecreto',
  saveUninitialized: false,
  resave: true,
  rolling: true, 
  cookie: {
 
    // Session expires after 1 min of inactivity.
    expires: 60000*10
}
}))
app.use(passport.initialize())
app.use(passport.session())

app.get("/", function (req, res) {
  //when we get an http get request to the root/homepage
  //res.send("Hello World 1");
  res.render('index')
});

app.use('/', ajustes)
app.use('/', users)
app.use('/', index)
app.use('/', changesettings)
app.use('/', savepg)
app.use('/', guardarhistoricas)
app.use('/',backuprouter)

app.listen(PORT, function () {
  console.log(`Listening on Port ${PORT}`);
  update()
});