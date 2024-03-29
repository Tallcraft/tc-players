<template>
  <div v-if="players!=null">
    <v-progress-linear
      indeterminate
      v-show="!Array.isArray(players.result)">
    </v-progress-linear>
    <div
     v-if="players.result == undefined || players.result.length==0"
     v-show="Array.isArray(players.result)">
      <h3 style="text-align:center">There were no results for the query : {{name}}</h3>
    </div>
    <div v-else>
      <h1 v-show="Array.isArray(players.result)">
        Search results for '{{name}}' (Page {{page}}/{{Math.ceil(players.totalCount/20)}}) :
      </h1>
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
      <div block v-for="(player, index) in players.result" :key="index" class="row">
        <v-btn block
          left
          style="display:inline;
          width:100%;
          height:20;"
          class="btn-text"
          @click.native="$router.push(`/player/${player.uuid}`)">
          <v-icon>perm_identity</v-icon>
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
      default: 1,
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
      if (this.players.result == null) return null;
      return this.players.result.length < 20 || this.wait;
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
      return this.players.result.length;
    },
  },
  methods: {
    cleanUpSearchString(string) {
      let outputString = string.replace(/\s*$/, ''); // Trim whitespaces off the end
      outputString = outputString.replace('_', '\\\\_'); // Escape underscores so the query is not misinterpreted
      return outputString;
    },
    formatDate(date) {
      if (date == null) {
        return '-';
      }
      const d = new Date(date);
      return d.toLocaleString();
    },
    getRanks(uuid) {
      const result = this.players.result.filter((player) => player.uuid === uuid)[0];
      if (result == null || result.groups?.length === 0) {
        return null;
      }
      return `[${result.groups.map((group) => group.id)
        .join()
        .split(',')
        .join('] [')
        .toUpperCase()}]`;
    },
    async executeQuery() {
      this.preTests();
      this.players = null;
      const page = (this.page <= 0) ? 1 : this.page;
      const searchName = this.cleanUpSearchString(this.name);
      const players = await this.$apollo.query({
        query: (!this.serverQuery) ? gql`
        query {
          players(searchPlayerName:"%${searchName}%", limit:20, offset:${(page - 1) * 20}){
            totalCount
            result{
              lastSeenName
              firstLogin
              lastLogin
              uuid
              groups{
                id
              }
            }
          }
        }
        ` : gql`
        query{
          mcServer(serverId:"${this.serverName}"){
            name
            status{
              onlinePlayers{
                lastSeenName
                firstLogin
                lastLogin
                uuid
                groups{
                  id
                }
              }
            }
          }
        }`,
      });
      if (this.serverQuery) {
        this.players = {};
        if (players.data.mcServer.status.onlinePlayers === null) {
          this.players.result = [];
        } else {
          this.players.result = players.data.mcServer.status.onlinePlayers;
          this.players.totalCount = players.data.mcServer.status.onlinePlayers.length;
        }
      } else {
        this.players = players.data.players;
      }
      this.players = (this.players === null) ? [] : this.players;
      this.checkOneResult();
      this.wait = false;
      return this.players;
    },
    preTests() {
      // Name is fixed beforehand so it's more clear to the user what the page is actually querying.
      let nameWithoutWhitespace = this.cleanUpSearchString(this.name);
      if ((this.page * 1) < 1) {
        this.$router.replace(`/search/${nameWithoutWhitespace}/page/1`);
      }
      this.serverQuery = false;
      this.serverName = '';
      if (this.name.length === 36 && this.name.split('-').length === 5) {
        this.$router.replace(`/player/${this.name}`);
        return;
      }
      if (this.name.includes(':')) {
        const nme = this.name.split(':');
        if (!Number.isNaN((nme[1] * 1))) {
          [this.name, this.page] = nme;
          this.$router.replace(`/search/${nameWithoutWhitespace}/page/${(this.page > Math.ceil(this.players.totalCount / 20))
            ? Math.ceil(this.players.totalCount / 20) : this.page}`);
          return;
        }
        if (nme[0] === ('on')) {
          this.serverQuery = true;
          [nameWithoutWhitespace, this.serverName] = nme;
          this.name = nme.join(':');
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
      if (this.players.result.length === 1 && this.page === 1 && !this.serverQuery) {
        this.$router.replace(`/player/${this.players.result[0].uuid}`);
        return true;
      }
      return false;
    },
  },
};
</script>
