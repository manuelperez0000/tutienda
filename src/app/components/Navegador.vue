<template>
    <div>
        <nav class="navbar fixed-top navbar-expand-lg navbar-dark mb-5">
            <div class="container">
                <a class="navbar-brand" href="/"><h3 class="text-white">TuTiendaEnLinea </h3></a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav ml-auto">
                        <li v-if="estado == true">
                            <p class="text-white my-1 mx-1">{{email}}</p> 
                        </li>
                        <li v-if="estado == true"> 
                            <a class="text-white my-1 btn mx-1 btn-primary" href="/tienda">
                                <i class="fa fas-envelope"></i> Mi Tienda 
                            </a> 
                        </li>
                        <li v-if="estado == true"> 
                            <a class="text-white my-1 btn mx-1 btn-primary" href="/logout">Salir</a> 
                        </li>
                        <li  v-if="estado == false" class="nav-item">
                            <a class="nav-link text-white" href="/login">Ingresa</a>
                        </li>
                        <li  v-if="estado == false" class="nav-item">
                            <a class="nav-link text-white" href="/register">Registrate</a>
                        </li>     
                    </ul>
                </div>
            </div>
        </nav>
    </div>
</template>
<script>
 export default {
    data(){
        return{
            estado:"",
            email:""
        }
    },
    methods:{
        inicio(){
            fetch('/api')
            .then(res => res.json())
            .then(data => {
              console.log(data)
              this.estado = data.estado
              this.email = data.email          
            })

        }
    },
    created(){
        this.inicio()
        }
} 
</script>