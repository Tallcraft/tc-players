import 'babel-polyfill';
import Vue from 'vue';
import { ApolloClient } from 'apollo-boost';
import App from '@/App.vue';
import VueApollo from 'vue-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import vuetify from './plugins/vuetify';
import router from './router';

import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: 'https://api.tallcraft.com/',
});

const client = new ApolloClient({
  cache,
  link,
});

const apolloProvider = new VueApollo({
  defaultClient: ApolloClient,
});

Vue.config.productionTip = false;

Vue.prototype.$appName = 'Tallcraft Players';
Vue.$apollo = client;
Vue.prototype.$apollo = client;
Vue.prototype.$console = console;
Vue.prototype.darkTheme = true;
Vue.prototype.$clone = (obj) => JSON.parse(JSON.stringify(obj));

new Vue({
  router,
  apolloProvider,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
