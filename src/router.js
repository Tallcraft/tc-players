import Vue from 'vue';
import Router from 'vue-router';

import NotFound from '@/views/NotFound.vue';

import ServerView from '@/components/ServerView.vue';
import StatusView from '@/components/StatusView.vue';
import MainView from '@/components/MainView.vue';
import PlayerProfile from '@/components/PlayerProfile.vue';
import PlayerSearch from '@/components/PlayerSearch.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: 'main',
    },
    {
      path: '/main',
      name: 'main',
      component: MainView,
    },
    {
      path: '/status',
      name: 'status',
      component: StatusView,
    },
    {
      path: '/status/:name',
      name: 'serverstatus',
      component: ServerView,
      props: true,
    },
    {
      path: '/player',
      component: PlayerProfile,
    },
    {
      path: '/player/:name',
      name: 'player',
      component: PlayerProfile,
      props: true,
    },
    {
      path: '/search',
      component: PlayerSearch,
    },
    {
      path: '/search/:name',
      component: PlayerSearch,
      props: true,
    },
    {
      path: '/search/:name/page/:page',
      name: 'search',
      component: PlayerSearch,
      props: true,
    },
    {
      path: '*',
      component: NotFound,
    },
  ],
});
