<template>
  <div>
    <div v-for="(player, index) in players" :key="index" class="row">
      <v-btn inline style="display:inline;width:15%">
        <router-link :to="`../player/${player.lastSeenName}`"
         style="margin-left:auto;margin-right:auto">
          {{player.lastSeenName}}
        </router-link>
      </v-btn>
        <p style="margin-left:10%">
          Last Online At : {{formatDate(player.lastLogin*1)}}</p>
        <p style="margin-left:auto;margin-right:auto">
          First Logged In On : {{formatDate(player.firstLogin*1)}}</p>
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
      playerHistoryHeader: [
        {
          text: 'Name',
          sortable: false,
          value: 'type',
        },
        {
          text: 'First Login',
          sortable: false,
          value: 'firstLogin',
        },
        {
          text: 'Last Login',
          sortable: false,
          value: 'lastLogin',
        },
      ],
    };
  },
  computed: {
    playerHistoryData() {
      if (this.players === undefined) {
        return [];
      }
      return this.players.map((player) => ({
        name: player.lastSeenName,
        firstLogin: this.formatDate(player.firstLogin * 1),
        lastLogin: this.formatDate(player.lastLogin * 1),
      })).sort((a, b) => a.name.localeCompare(b.name));
    },
    length() {
      if (this.players === undefined) {
        return 0;
      }
      return this.players.length;
    },
    getName(name) {
      return `players/${name}`;
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
      const players = await this.$apollo.query({
        query: gql`query {
        players(searchPlayerName:"%${this.name}%", limit:100){
          lastSeenName
          firstLogin
          lastLogin
          }
          }`,
      });
      this.players = players.data.players;
      return this.players;
    },
    checkOneResult() {
      console.debug(this.players, this.apollo, this);
      if (this.players.length === 1 && this.players !== undefined) {
        this.$router.replace(`../player/${this.players[0].lastSeenName}`);
        return true;
      }
      return false;
    },
  },
};
</script>
