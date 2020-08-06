
import Vue from 'vue';
import Cuerpo from './components/Cuerpo.vue';
import Navegador from './components/Navegador.vue';

new Vue({
  el:'#app',
  components:{
    Cuerpo,
    Navegador
  },
  data:{
    email:"",
    estado:"",
  },
  methods:{
    inicio(es,em){
      this.estado = es
      this.email = em
    }
  },
  created(){
     fetch('/api/')
      .then(res => res.json())
      .then(data => {
        console.log(data.estado)
        var estado = data.estado
        this.inicio(data.estado,data.email)
      })
    }
})
