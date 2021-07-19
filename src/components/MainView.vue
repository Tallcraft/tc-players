<template>
<div>
    <img alt="Tallcraft Logo" :src="logoSrc" style="display:block;
              margin-left:auto;
              margin-right:auto;
              margin-top:3%;
              margin-bottom:3%;
              width:15%">
        <h1>Players</h1>
        <v-text-field
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="search"
            label="Player search"
            v-model="playerInput"
            @change="playerLookup"
    ></v-text-field>
  </div>
</template>

<style scoped>
  a {
    text-decoration: none;
  }
  h1{
      text-align:center;
      font-size: 4vw;
      margin-bottom: .5em;
      margin-top: -1em;
    }
</style>

<script>

import gql from 'graphql-tag';
import logo from '../assets/logo.svg';

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
      playerInput: '',
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
      }));
    },
    getName(name) {
      return `players/${name}`;
    },
    logoSrc() {
      return logo;
    },
  },
  methods: {
    playerLookup() {
      this.$router.push(`/search/${this.playerInput}`);
    },
    formatDate(date) {
      if (date == null) {
        return '-';
      }
      const d = new Date(date);
      return d.toLocaleString();
    },
  },
  apollo: {
    // Query with parameters
    players: {
      // gql query
      query: gql`
      query {
        players(limit:10){
            lastSeenName
            firstLogin
          }
        }
      `,
    },
  },
};
</script>
