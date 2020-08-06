const express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
//const admin = require('firebase-admin');

/* admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://usuarios-b6168.firebaseio.com"
}); */

const firebase = require("firebase/app");
require("firebase/firestore");
require("firebase/auth");
require("firebase/storage");

const firebaseConfig = {
  apiKey: "AIzaSyDRSDPUDAaQZqLAtsJtRnex5uhKBqWb5vw",
  authDomain: "usuarios-b6168.firebaseapp.com",
  databaseURL: "https://usuarios-b6168.firebaseio.com",
  projectId: "usuarios-b6168",
  storageBucket: "usuarios-b6168.appspot.com",
  messagingSenderId: "1077345151387",
  appId: "1:1077345151387:web:5c9c23d441d8924ba8993e"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var db = firebase.firestore();
var stor = firebase.storage(); 






router.get('/api/auth', (req, res)=>{ 
  if(auth.currentUser){
    var datos = { estado:true, email:auth.currentUser.email }
    console.log(datos)
    res.json(datos)
  }else{ console.log(datos); res.json({ estado:false,email:null })} 
});

router.get('/api/logout', (req, res)=>{
  auth.signOut().then(()=>{
    res.send('index');
  });
});


router.post('/api/login', (req, res)=>{
  var e = req.body.email;
  var p = req.body.password;
  auth.signInWithEmailAndPassword(e, p).then(()=>{
    console.log("Autenticado con exito");
    res.json({ mensaje:"autenticado con exito",estado:"true", email:auth.currentUser.email })
    
  }).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage);
    res.json(
      {
        estado:"false",
        mensaje:"No autenticado",
        errorMessage:errorMessage,
        errorCode:errorCode
      });
    }); 
  });
  
  router.post('/api/forgot', (req, res)=>{
    
    var emailAddress = req.body.email;
    
    auth.sendPasswordResetEmail(emailAddress).then(function() {
      res.send("Correo enviado");
    }).catch(function(error) {
      res.send("Ocurrio un error al enviar el correo"+error)
    });
  });
  
  //------------------------------registro de usuario -------------------------
  router.post('/api/register', (req, res)=>{
    var e = req.body.email;
    var p = req.body.password;
    console.log(e+" - "+p);
    //fetch +++++++++++++++++++++++++++++++++++++++++++
    auth.createUserWithEmailAndPassword(e, p).then(()=>{
      var id = auth.currentUser.uid; 
      registro_db(id);
    })
    .catch( error => {
      console.log("Error al crear usuario: "+error.message);
    });
    //++++++++++++++++++++++++++++++++++++++++++++++++
    function registro_db(id){
      console.log("Inicio de guardado en la base de datos"+req.body.email);
      var nombre = req.body.nombre;
      var telefono = req.body.telefono;
      var email = req.body.email;
      
      db.collection("usuarios").doc(id).set({
        nombre:nombre,
        telefono:telefono,
        correo:email
      }).then(()=>{
        console.log("guardado con exito")
        //guardar_tienda(id)
        res.send("giardado");
      }).catch(e => {
        console.log(e)
        res.send(e);
      })
    } 
  })
  
/*   router.get('/api/:id', (req, res)=>{
    var id = req.params.id
    let tiendas = db.collection('tiendas');
    let query = tiendas.where('urlunico', '==', id).get()
    .then(snapshot => {
      if (snapshot.empty) {
        res.send('404');
      }
      
      snapshot.forEach(doc => {
        res.send('mitienda',{
          resultado:true,
          id:doc.id,
          nombre:doc.data().nombre,
          banner:doc.data().url
        });
      });
    })
    .catch(err => {
      res.send('Error obteniendo los datos:', err.message)
    })
    
  })*/
/* 
  router.get('/',(req,res) => {
    res.sendFile(__dirname,"index.html")
  })
   */
  router.get('/:id', function (req, res) {
       
    res.sendFile(path.join(__dirname+"/./../../public/index.html"))
  }) 
  
  module.exports = router;