import 'babel-polyfill';
import Vue from 'vue';
import './plugins/vuetify';
import App from './App.vue';
import router from './router';
import { createProvider } from './vue-apollo';

import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';


Vue.config.productionTip = false;

Vue.prototype.$appName = 'Tallcraft Players';
Vue.prototype.$clone = obj => JSON.parse(JSON.stringify(obj));

new Vue({
  router,
  apolloProvider: createProvider(),
  render: h => h(App),
}).$mount('#app');
