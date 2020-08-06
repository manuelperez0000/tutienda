<template>
    <div>
      <navegador></navegador>
      <div class="cover-back">
        <div class="container mt-5 pt-5">
          <div class="row">
            <div class="col-sm-5 p-3 rounded bg-semitransparent mx-3 m-4">
              <form @submit.prevent="hacerLogin" class=" text-white">
                <h1 class="h3 mb-3 font-weight-normal">Ingresa</h1>
                <input v-model="datos.email" type="email" id="email" name="email" class="form-control mb-3" placeholder="Correo" required autofocus>
                <input v-model="datos.password" type="password" id="password" name="password" class="form-control mb-3" placeholder="Contraseña" required>
                <button class="btn btn-lg btn-primary btn-block mb-4" type="submit">Ingresar</button>
                <a  href="/forgot" class="text-white">Olvide mi contraseña</a>
              </form> 
            </div>
          </div>
        </div>
      </div>

    </div>
</template>

<script>
import navegador from '../components/Navegador.vue'

export default {
  data(){
    return {
      datos:{
        email:'',
        password:''
      }
    }
  },
  components:{
    navegador
  },
  methods:{
    hacerLogin(){
      fetch('/login',{
        method: "POST",
        body: JSON.stringify(this.datos),
        headers: {
          "Accept": "application/json",
          "Content-type": "application/json"
        }
      }).then( res => res.json() )
      .then((datos) => {
        var estado = datos.estado
        var email = datos.email
        console.log(datos.estado)
        if(estado == "true"){
          window.location.href = '/'
          console.log(estado)
        }
      })
      
  }
}
}
</script>