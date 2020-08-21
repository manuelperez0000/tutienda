const express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const multer = require('multer')

let storage = multer.diskStorage({
  destination:(req, file, cb)=>{
    cb(null,'./public/img/banners')
  },
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+'-'+Date.now()+file.originalname)
  }
})
const upload = multer({storage})


var serviceAccount = require(__dirname+"/usuarios-b6168-firebase-adminsdk-npcxf-119c3afdd9.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://usuarios-b6168.firebaseio.com"
});

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
  }else{ 
    console.log(datos); 
    res.json({ estado:false,email:null,uid:null })
  } 
})



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
      console.log("usuario guardado con exito")
      guardar_tienda(id)
      res.json({estado:true, mensaje:"Guardado con exito"});
    }).catch(e => {
      console.log(e)
      res.json({estado:false,mensaje:"Ocurrio un error al guardar en la base de datos"});
    })

    function guardar_tienda(id){
      db.collection("tiendas").doc(id).set({
        nombre:"",
        urlUnico:"",
        banner:""

      }).then(()=>{
        console.log("tienda guardad")
        //guardar_tienda(id)
        res.json({estado:true, mensaje:"Guardado con exito"});
      }).catch(e => {
        console.log(e)
        res.json({estado:false,mensaje:"Ocurrio un error al guardar en la base de datos"});
      })
    }
  } 
})

/* router.get('/api/user/:id', function (req, res) {
  res.send('user ' + req.params)
}) */

router.get('/api/mitienda/',(req,res)=>{
   var uid = auth.currentUser.uid
  
  /*res.send(uid)*/
    db.collection('tiendas').doc(uid).get()
  .then((doc)=>{
    res.json({
      nombre:doc.data().nombre,
      urlunico:doc.data().urlunico,
      banner:doc.data().banner
    })
  }) 
})

router.post('/api/guardartienda/nombre',(req,res)=>{
  var id = req.body.id
  var nombre = req.body.nombre
   db.collection('tiendas').doc(id).update({
    nombre:nombre
  }).then(() =>{
    res.json({nombre:nombre,"mensaje":"Guardado con exito","estado":true})
  })
  .catch(err => res.json({nombre:null,"mensaje":err.message,"estado":false}))
})

router.post('/api/guardartienda/url',(req,res)=>{
  var id = req.body.id
  var urlunico = req.body.urlunico
  //res.json({id:id,urlunico:urlunico})
   db.collection('tiendas').doc(id).update({
    urlunico:urlunico
  }).then(() =>{
    res.json({mensaje:"Guardado con exito",estado:true})
  })
  .catch(err => res.json({mensaje:err.message,estado:false}))
})
/* 
router.post('/api/guardartienda/banner',(req,res)=>{
  var id = auth.currentUser.uid
  var banner = req.body.banner
  //res.json({id:id,urlunico:urlunico})
   db.collection('tiendas').doc(id).update({
    banner:banner
  }).then(() =>{
    res.json({mensaje:"Guardado con exito",estado:true})
  })
  .catch(err => res.json({mensaje:err.message,estado:false}))
}) */

router.post('/api/urlunico', (req,res)=>{
  var url = req.body.url
  db.collection("tiendas").get().then(function(querySnapshot) {
    var y=0
    querySnapshot.forEach(function(doc) {
      if(url == doc.data().urlunico){
       y++
      }
    })
    res.json({i:y})
  })
  .catch(function(error) {
      res.json({estado:false})
      console.log("Error getting documents: ", error);
  });

  /* db.collection('').where("","==",)
  .then(()=> res.json({estado:true,mensaje:"disponible"}))
  .catch(err => res.json({estado:false,mensaje:err})) */
})
/* 
router.post('/api/banner', upload.single('image'),(req,res)=>{
  console.log(req.file)

  var exten = "TuTiendaEnLinea"+Math.floor(Math.random()*10000);
  var url = req.file.originalname
  var banner = exten+url
  var ref = firebase.storage().ref('banners/'+banner)
  ref.put(req.file)
  .then(()=> {
    console.log('Uploaded a blob or file!')
    guardado(url,banner)
  }).catch(err => console.log(`error al subir imagen: ${err}`))

  function guardado(url,banner){
    db.collection("tiendas").doc(auth.currentUser.uid).update({
      url:url,
      banner:banner
    }).then(()=>{
      res.json({estado:true,msg:"guardado con exito"})
    })
    .catch(function(error){
      res.json({estado:false,msg:"No se a podido guardar por es siguiente error: "+error.message})
      console.log("error al cargar banner: "+error);
    })
  } 


}) */

router.post('/api/cargarbanner',upload.single('file'),(req,res)=>{
  
    let banner = req.file.path
    console.log(banner)
    db.collection("tiendas").doc(auth.currentUser.uid).update({
      banner:banner
    }).then(()=>{
      res.json({estado:true,msg:"guardado con exito"})
    })
    .catch(function(error){
      res.json({estado:false,msg:"No se a podido guardar por es siguiente error: "+error.message})
      console.log("error al cargar banner: "+error);
    })

    fs.readFile('./img/banners/123456.jpg',(err,file)=>{
      console.log(file)
    })

})

router.get('/:id', function (req, res) {
      
  res.sendFile(path.join(__dirname+"/./../../public/index.html"))
}) 

module.exports = router;

/* {
  "fieldname":"file",
  "originalname":"7b222f0f83c7a3fcc827a9029375e6e9.jpg",
  "encoding":"7bit",
  "mimetype":"image/jpeg",
  "destination":"./img",
  "filename":"file-15978656894867b222f0f83c7a3fcc827a9029375e6e9.jpg",
  "path":"img\\file-15978656894867b222f0f83c7a3fcc827a9029375e6e9.jpg",
  "size":90428
} */