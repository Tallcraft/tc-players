<template>
  <div>
    <v-progress-linear indeterminate v-show="!Array.isArray(players)"></v-progress-linear>
    <h1 v-show="Array.isArray(players)">Search results for '{{name}}' :</h1>
    <div style="display:inline-block;margin-bottom:4%">
      <v-btn
        style="display:inline-block;
        width:10%;
        position:absolute;
        left:0"
        class="btn-text"
        @click.native="changePage(-1)"
        :disabled="page<=1">
        <p block style="margin:auto">Previous</p>
      </v-btn>
      <v-btn inline-block
        style="display:inline-block;
        width:10%;
        right:0;
        position:absolute;"
        class="btn-text"
        @click.native="changePage(1)"
        :disabled="players.length<20">
        <p block style="margin:auto">Next</p>
      </v-btn>
    </div>
    <div block v-for="(player, index) in players" :key="index" class="row">
      <v-btn block
        left
        style="display:inline;
        width:100%;
        height:20;
        justify:left"
        class="btn-text"
        @click.native="$router.push(`/player/${player.uuid}`)">
        <p block style="margin:auto">[RANK] {{player.lastSeenName}}</p>
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
  a {
    text-decoration: none;
  }
  .btn-text {
    float: left;
  }
</style>

<script>

import gql from 'graphql-tag';

export default {
  name: 'MainView',
  props: {
    name: {
      default: 'hmm',
      type: String,
    },
    page: {
      default: 0,
    },
  },
  data() {
    return {
      players: this.executeQuery(),
    };
  },
  watch: {
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
          players(searchPlayerName:"%${this.name}%", limit:20, offset:${(this.page - 1) * 20}){
            lastSeenName
            firstLogin
            lastLogin
            uuid
          }
        }`,
      });
      this.players = players.data.players;
      this.checkOneResult();
      return this.players;
    },
    changePage(amount) {
      console.debug(this.name);
      this.$router.push(`/search/${this.name}/page/${(this.page * 1) + amount}`);
    },
    checkOneResult() {
      if (this.players.length === 1 && this.players !== undefined) {
        this.$router.replace(`../player/${this.players[0].uuid}`);
        return true;
      }
      return false;
    },
  },
};
</script>
