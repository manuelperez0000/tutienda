
<template>
<div>
   <div style="backgroun:red" class="cover-back">
        <div class="container mt-5 fixed-bottom pb-5">
            <div class="text-center row">
            <div class="col-sm-10 offset-sm-1 text-white">
                <h1 class="cover-heading">Vende tus productos en linea</h1>
                <p class="lead">Te ofrecemos una herramienta increiblemente simple y facil de utilizar  desde cualquier dispositivo para generar ventas a traves de internet</p>
                <p class="lead">
                <a href="/register" class="btn btn-lg btn-primary">{{titulo}}Registrate</a>
                <a href="/login" class="btn btn-lg btn-secondary">Ingresa</a>
                </p>
            </div> 
        </div>
    </div>
</div>
</div>
</template>
<script>
export default {
   
    created(){
        getUser()
    },
    methods:{
        getUser(){
            if(auth.currentUser){
                console.log(auth.currentUser.email)
            }else{
                console.log("No autenticado")
            }
        }
    }
}
</script>
