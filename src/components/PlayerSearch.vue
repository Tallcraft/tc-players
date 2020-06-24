<template>
  <div>
    <v-progress-linear indeterminate v-show="!Array.isArray(players)"></v-progress-linear>
    <div v-if="players.length == 0 && name!='isuredolovemypotatoes'">
      <h3 style="text-align:center">No Results.</h3>
    </div>
    <div v-if="players.length == 0 && name=='isuredolovemypotatoes'">
      <h3 style="text-align:center">
        Well, there were no results, but there are some potatoes lying around in here.
      </h3>
      <v-img src="../assets/potato.png"
       style="width:25%;margin-left:auto;margin-right:auto"></v-img>
    </div>
    <div v-if="players.length > 0">
      <h1 v-show="Array.isArray(players)">Search results for '{{name}}' :</h1>
      <div style="display:inline-block;margin-bottom:50px">
        <v-btn
          style="display:inline-block;
          width:40%;
          position:absolute;
          left:0"
          class="btn-text"
          @click.native="changePage(-1)"
          :disabled="page<=1 || wait">
          <p block style="margin:auto">Previous</p>
        </v-btn>
        <v-btn inline-block
          style="display:inline-block;
          width:40%;
          right:0;
          height:20;
          position:absolute;"
          class="btn-text"
          @click.native="changePage(1)"
          :disabled="nextDisabled">
          <p block style="margin:auto">Next</p>
        </v-btn>
      </div>
      <div block v-for="(player, index) in players" :key="index" class="row">
        <v-btn block
          left
          style="display:inline;
          width:100%;
          height:20;"
          class="btn-text"
          @click.native="$router.push(`/player/${player.uuid}`)">
          <p block style="margin:auto">{{getRanks(player.uuid)}} {{player.lastSeenName}}</p>
        </v-btn>
      </div>
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
      default: '',
      type: String,
    },
    page: {
      default: 0,
    },
  },
  data() {
    return {
      players: this.executeQuery(),
      wait: false,
    };
  },
  watch: {
    $route: 'executeQuery',
  },
  computed: {
    nextDisabled() {
      if (this.players == null) return null;
      return this.players.length < 20 || this.wait;
    },
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
    getRanks(uuid) {
      const result = this.players.filter((player) => player.uuid === uuid)[0];
      if (result == null || result.groups.length === 0) {
        return null;
      }
      return `[${result.groups.map((group) => group.id).join().replaceAll(',', '] [')}]`;
    },
    async executeQuery() {
      this.preTests();
      this.players = null;
      const players = await this.$apollo.query({
        query: gql`
        query {
          players(searchPlayerName:"%${this.name.replace('_', '\\\\_')}%", limit:20, offset:${(this.page - 1) * 20}){
            lastSeenName
            firstLogin
            lastLogin
            uuid
            groups{
              id
            }
          }
        }`,
      });
      this.players = players.data.players;
      this.checkOneResult();
      this.wait = false;
      return this.players;
    },
    preTests() {
      if ((this.page * 1) < 1) {
        this.$router.replace(`/search/${this.name}/page/1`);
        this.page = 1;
      }
      if (this.name.includes(':')) {
        const nme = this.name.split(':');
        if (!Number.isNaN((nme[1] * 1))) {
          [this.name, this.page] = nme;
          this.$router.replace(`/search/${this.name}/page/${this.page}`);
        }
      }
      if (this.name === '') {
        this.$router.replace('/main');
      }
    },
    changePage(amount) {
      this.wait = true;
      if ((this.page * 1) + amount < 1) {
        this.$router.push(`/search/${this.name}/page/1`);
      }
      this.$router.push(`/search/${this.name}/page/${(this.page * 1) + amount}`);
    },
    checkOneResult() {
      if (this.players.length === 1 && this.players !== undefined && this.page === 0) {
        this.$router.replace(`/player/${this.players[0].uuid}`);
        return true;
      }
      return false;
    },
  },
};
</script>
