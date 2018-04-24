import Vue from 'vue'
import App from './App.vue'
import Twinkle from './components/twinkle.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

Vue.config.productionTip = false

Vue.component('twinkle', Twinkle);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
