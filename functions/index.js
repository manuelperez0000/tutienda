const functions = require('firebase-functions');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
var cors = require('cors')

//setings
app.set("port",process.env.PORT || 4000);


//midlewars
app.use(cors())
app.use(morgan('dev'));
app.use(express.json());


//routes----------------------
app.use(require('./routes/index.js'));
// end routes---------------


//static files
app.use(express.static(path.join(__dirname, '../public')));
 
 
//descomenta para trabajar en local
var port = app.get("port");

app.listen(port,(req, res)=>{
    console.log("Server on port",port)
})

//descomenta para trabajar con firebase
//exports.app = functions.https.onRequest(app);
