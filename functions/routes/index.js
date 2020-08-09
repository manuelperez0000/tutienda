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
    var datos = { estado:true, email:auth.currentUser.email,uid:auth.currentUser.uid }
    console.log(datos)
    res.json(datos)
  }else{ console.log(datos); res.json({ estado:false,email:null,uid:null })} 
});



router.get('/api/logout', (req, res)=>{
  auth.signOut().then(()=>{
    res.json({estado:true});
  }).catch(err => res.json({estado:false}))
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
    res.json({
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
    res.json({mensaje:"Se a enviado un link de recuperacion a su orreo"});
  }).catch(function(error) {
    res.json({mensaje:"Disculpe: "+error})
  });
});

//------------------------------registro de usuario -------------------------
router.post('/api/register', (req, res)=>{
  var e = req.body.email;
  var p = req.body.password;
  console.log(e+" - "+p);

  auth.createUserWithEmailAndPassword(e, p).then(()=>{
    var id = auth.currentUser.uid; 
    registro_db(id);
  })
  .catch( error => {
    console.log("Error al crear usuario: "+error.message);
    res.json({estado:false,mensaje:"Ocurrio un problema al registrar en auth"})
  });

  function registro_db(id){
    console.log("Inicio de guardado en la base de datos: "+req.body.email);
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
      res.json({estado:true, mensaje:"Guardado con exito"});
    }).catch(e => {
      console.log(e)
      res.json({estado:false,mensaje:"Ocurrio un error al guardar en la base de datos"});
    })
  } 
})

router.get('/api/mitienda',(req,res)=>{
  db.collection('tiendas').doc("123456").get()
  .then((doc)=>{
    res.json({nombre:doc.data().nombre})
  })
})

router.post('/api/guardartienda',(req,res)=>{
 /*  db.collection('tiendas').doc(auth.currentUser.id).set({
    nombre:req.body.nombre
  }).then(() =>{
    res.json({mensaje:"Guardado con exito"})
  })
  .catch(err => res.json({mensaje:err.message})) */
  res.json({mensaje:"guardando bien"})
})

router.get('/api/urlunico', (req,res)=>{
db.collection('tiendas').where("urlunico","==",req.body.url)
.then(()=> res.json({estado:true,mensaje:"disponible"}))
.catch(err => res.json({estado:false,mensaje:err}))
})

router.get('/:id', function (req, res) {
      
  res.sendFile(path.join(__dirname+"/./../../public/index.html"))
}) 

module.exports = router;