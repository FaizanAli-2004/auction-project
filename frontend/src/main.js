// main.js (Vue app entry point)
// Creates the Vue app, loads global styles (Bootstrap + custom style theme), and enables routing.

import { createApp } from 'vue'
import App from './views/App.vue'
import router from './router'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js' 
import './assets/style.css' 

createApp(App)
  .use(router)
  .mount('#app')
