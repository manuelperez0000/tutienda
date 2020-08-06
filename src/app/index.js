import Vue from 'vue'
import VueRouter from 'vue-router'

const Foo = { template: '<div>foo</div>' }
const Bar = { template: '<div>bar</div>' }

const micomponente = Vue.component('micomponente',
{
  template:'<h1>micomponente</h1>'
})

const routes = [
  { path: '/',name:"micomponente", component: micomponente },
  { path: '/bar', component: Bar }
]

const router = new VueRouter({
  mode:"history",
  routes 
})

const app = new Vue({
  el:"#app",
  router
}) /**/