<template>
  <div>
    <v-flex xs10 sm8 offset-sm2>
      <h1> Players matching '{{ name }}' ({{length}} Results):</h1>
      <v-progress-linear indeterminate v-show="$apollo.queries.players.loading"></v-progress-linear>
      <v-data-table
              :headers="playerHistoryHeader"
              :items="playerHistoryData"
              hide-actions
              class="elevation-12"
              @click:row="handleClick"
              v-if="!$apollo.queries.players.loading && playerHistoryData.length!=0"
      >
        <template slot="items" slot-scope="props" v-if="!checkOneResult()">
            <td v-for="(item, key) in props.item" :key="key">
                  <router-link
                          v-if="key === 'name'"
                          :to="`/player/${item}`"
                          :dark="darkTheme">
                      {{ item }}
                  </router-link>
                  <template :dark="darkTheme" v-else>{{item}}</template>
              </td>
        </template>
      </v-data-table>
      <h2 style="margin-top:20px;text-align:center" v-else-if="!$apollo.queries.players.loading">
        Sorry! There were no results.</h2>
    </v-flex>
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
      console.debug(this.players);
      if (this.players === undefined) {
        return [];
      }
      return this.players.map(player => ({
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
    checkOneResult() {
      if (this.players.length === 1 && this.players !== undefined) {
        this.$router.replace(`../player/${this.players[0].lastSeenName}`);
        return true;
      }
      return false;
    },
  },
  apollo: {
    // Query with parameters
    players: {
      // gql query
      query: gql`
      query players($name:String!) {
        players(searchPlayerName: $name, limit: 100){
            lastSeenName
            firstLogin
            lastLogin
          }
        }
      `,
      variables() {
        return {
          name: `${this.name.replace('_', '\\_')}%`,
        };
      },
    },
  },
};
</script>
