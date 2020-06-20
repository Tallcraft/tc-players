<template>
  <div>
    <v-progress-linear indeterminate v-show="!Array.isArray(players)"></v-progress-linear>
    <h1 v-show="Array.isArray(players)">Search results for '{{name}}' : {{length}} Results</h1>
    <div v-for="(player, index) in players" :key="index" class="row">
      <v-btn inline style="display:inline;width:15%;height:20">
        <router-link :to="`../player/${player.lastSeenName}`"
         style="margin-left:auto;margin-right:auto">
          {{player.lastSeenName}}
        </router-link>
      </v-btn>
      <p style="margin-left:10%">
        Last Online At : {{formatDate(player.lastLogin*1)}}</p>
      <p style="margin-left:auto;margin-right:auto">
        First Logged In On : {{formatDate(player.firstLogin*1)}}</p>
      <div style="height:50px"></div>
    </div>
  </div>
</template>

<style scoped>
  a {
    text-decoration: none;
  }
</style>

<script>

import gql from 'graphql-tag';

export default {
  name: 'MainView',
  props: {
    name: {
      default: '',
      type: String,
    },
  },
  data() {
    return {
      players: this.executeQuery(),
    };
  },
  watch: {
    // call again the method if the route changes
    $route: 'executeQuery',
  },
  computed: {
    height() {
      const { body } = document;
      const html = document.documentElement;
      const height = Math.max(body.scrollHeight, body.offsetHeight,
        html.clientHeight, html.scrollHeight, html.offsetHeight);
      return height;
    },
    length() {
      if (this.players == null) {
        return 0;
      }
      return this.players.length;
    },
  },
  methods: {
    formatDate(date) {
      if (date == null) {
        return '-';
      }
      const d = new Date(date);
      return d.toLocaleString();
    },
    async executeQuery() {
      this.players = null;
      const players = await this.$apollo.query({
        query: gql`
        query {
          players(searchPlayerName:"%${this.name}%", limit:100){
            lastSeenName
            firstLogin
            lastLogin
          }
        }`,
      });
      this.players = players.data.players;
      this.checkOneResult();
      return this.players;
    },
    checkOneResult() {
      if (this.players.length === 1 && this.players !== undefined) {
        this.$router.replace(`../player/${this.players[0].lastSeenName}`);
        return true;
      }
      return false;
    },
  },
};
</script>
