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
    <v-container>
      <v-row v-for="i in Math.floor(players.result.length/10)" :key="i">
        <v-col
          v-for="(player, index) in getArray(i)"
          :key="index"
          class="pa-2"
          tile
        >
          <PlayerTag :UUID="player.uuid"
          :title="`${getRanks(player.uuid)}\n${player.lastSeenName}`"
          class="playerTag"
          @click.native="goTo(`/player/${player.uuid}`)">
          </PlayerTag>
        </v-col>
      </v-row>
    </v-container>
    <v-footer class="footer" v-show="Array.isArray(players.result)">
      <v-btn @click="changePage(-1)" :disabled="page<=1">Back</v-btn>
      <v-divider/>
      <h3>Search results for '{{name}}' (Page {{page}}/{{Math.ceil(players.totalCount/50)}})</h3>
      <v-divider/>
      <v-btn @click="changePage(1)" :disabled="page>=Math.ceil(players.totalCount/50)">Next</v-btn>
    </v-footer>
  </div>
  </div>
</template>

<style scoped>
  a {
    text-decoration: none;
  }
  .playerTag:hover{
    cursor: pointer;
  }
  .footer{
    position:fixed;
    bottom:0;
    width:100%;
    left:0;
}
</style>

<script>

import gql from 'graphql-tag';
import PlayerTag from './PlayerTag.vue';

export default {
  name: 'MainView',
  components: { PlayerTag },
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
    getArray(num) {
      return this.players.result.slice((num - 1) * 10,
        Math.min((num - 1) * 10 + 10, this.players.result.length));
    },
    goTo(uri) {
      this.$router.push(uri);
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
      if (result == null) {
        return null;
      }
      if (result.groups?.length === 0) {
        return '';
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
      const players = await this.$apollo.query({
        query: (!this.serverQuery) ? gql`
        query {
          players(searchPlayerName:"%${this.name.replace('_', '\\\\_')}%", limit:50, offset:${(page - 1) * 50}){
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
      if ((this.page * 1) < 1) {
        this.$router.replace(`/search/${this.name}/page/1`);
      }
      this.serverQuery = false;
      this.serverName = '';
      if (this.name.length === 36 && this.name.split('-').length === 5) {
        this.$router.replace(`/player/${this.name}`);
      }
      if (this.name.includes(':')) {
        const nme = this.name.split(':');
        if (!Number.isNaN((nme[1] * 1))) {
          [this.name, this.page] = nme;
          this.$router.replace(`/search/${this.name}/page/${(this.page > Math.ceil(this.players.totalCount / 50))
            ? Math.ceil(this.players.totalCount / 50) : this.page}`);
        }
        if (nme[0] === ('on')) {
          this.serverQuery = true;
          [this.name, this.serverName] = nme;
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
      if (this.players.result.length === 1 && this.page === '1' && !this.serverQuery) {
        this.$router.replace(`/player/${this.players.result[0].uuid}`);
        return true;
      }
      return false;
    },
  },
};
</script>
