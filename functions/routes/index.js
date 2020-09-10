const express = require('express');
const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');
const multer = require('multer')
var router = express.Router();

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
        urlUnico:id,
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

router.get('/api/mitienda/',(req,res)=>{
   var uid = auth.currentUser.uid
    db.collection('tiendas').doc(uid).get()
  .then((doc)=>{
    res.json({
      nombre:doc.data().nombre,
      urlunico:doc.data().urlUnico,
      banner:doc.data().banner
    })
  }) 
})

router.post('/api/guardartienda/nombre',(req,res)=>{
  console.log(req.body)
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
    urlUnico:urlunico
  }).then(() =>{
    res.json({mensaje:"Guardado con exito",estado:true})
  })
  .catch(err => res.json({mensaje:err.message,estado:false}))
})

router.get('/api/obtenerBanner/',(req,res)=>{
  var id = auth.currentUser.uid
  db.collection('tiendas').doc(id).get().then((doc)=>{
    var banner = doc.data().bannerUrl
    res.json({banner:banner})
  })
})

router.post('/api/guardartienda/banner',(req,res)=>{
  var id = auth.currentUser.uid
  var bannerUrl = req.body.bannerUrl
  var bannerName = req.body.bannerName
  //res.json({id:id,urlunico:urlunico})
   db.collection('tiendas').doc(id).update({
    bannerUrl:bannerUrl,
    bannerName,bannerName
  }).then(() =>{
    res.json({mensaje:"Guardado con exito",estado:true})
  })
  .catch(err => res.json({mensaje:err.message,estado:false}))
})

router.post('/api/categorias/agregar',(req,res)=>{
  var id = auth.currentUser.uid
  //var id = "wHz8PB9S1SaORaNRz6annP6IJgQ2"
  var categoria = req.body.categoria
  db.collection('categorias').add({
    categoria:categoria,
    usuario:id
  }).then(() =>{
    res.json({mensaje:"Guardado con exito",estado:true})
  })
  .catch(err => res.json({mensaje:err.message,estado:false}))
})

router.post('/api/agregar/producto',(req,res)=>{
  var id = auth.currentUser.uid
  var producto = {
      nombre:req.body.nombre,
      usuario:id,
      precio:req.body.precio,
      categoria:req.body.categoria,
      img0:req.body.img0,
      img1:req.body.img1,
      img2:req.body.img2,
      img3:req.body.img3,
      descripcion:req.body.descripcion
  }
  db.collection('productos').add(producto).then(()=>{
    res.json({mensaje:"Producto agregado con exito"})
  }).catch(error => res.json({mensaje:error}))
})

router.post('/api/delete/categorias/',(req,res)=>{
  //console.log(req.body.data)
  var id = req.body.id
  db.collection("categorias").doc(id).delete().then(()=>{ 
    res.json({mensaje:"eliminado"})
  }).catch(error => res.json({mensaje:error}))
})

router.get('/api/get/categorias',(req,res)=>{
  var id = auth.currentUser.uid
  db.collection("categorias").where("usuario", "==", id).get()
    .then((querySnapshot)=> {
      var categorias = []
      querySnapshot.forEach((doc)=> {
        categorias.push( {id:doc.id,cat:doc.data().categoria} )    
        })
        res.json(categorias)
    })
    .catch(error =>
        console.log("Error en la lectura de las categorias: ", error)
    )
})


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
})

/* router.post('/api/cargarbanner',upload.single('file'),(req,res)=>{
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
}) */

router.post('/api/get/tienda',(req,res)=>{
  console.log("url pedido:"+req.body.id)
  db.collection("tiendas").get()
  .then(querySnapshot =>{
    querySnapshot.forEach(doc =>{
      if(doc.data().urlUnico == req.body.id){
        res.json({
          nombre:doc.data().nombre,
          banner:doc.data().bannerUrl,
          idcategorias:doc.id,
          mensaje:true
        })
      }else{
        res.json({mensaje:false})
      }
    })
  }).catch(error => res.json({mensaje:error.code}))
})

router.post('/api/get/catlist',(req,res)=>{
  var id = req.body.id
  db.collection("categorias").get().then(snapshot=>{
    var categorias=[]
    snapshot.forEach(doc =>{
      if(doc.data().usuario == id){
        categorias.push({
          id:doc.id,
          nombre:doc.data().categoria
        })
      }
    })
    res.json(categorias)
  }) 
})

router.post('/api/get/prodlist',(req,res)=>{
  var id = req.body.id
  db.collection("productos").get().then(snapshot=>{
    var productos=[]
    snapshot.forEach(doc =>{
      if(doc.data().usuario == id){
        productos.push({
          id:doc.id,
          nombre:doc.data().nombre,
          catprod:doc.data().categoria,
          precio:doc.data().precio,
          foto:doc.data().img0,
          descripcion:doc.data().descripcion
        })
      }
    })
    res.json(productos)
  }) 
})

router.get('/:id', function (req, res) {
      
  res.sendFile(path.join(__dirname+"/./../../public/index.html"))
}) 

module.exports = router;