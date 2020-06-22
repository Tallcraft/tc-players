<template>
  <div>
    <v-flex xs10 sm8 offset-sm2>
      <h1 style="text-align:center" v-if="server!=undefined"> {{server.name}} Status </h1>
      <h4 style="text-align:center;margin-top:20px" v-if="server!=undefined">
        Last Updated at {{serverQueryTime}}</h4>
      <v-progress-linear indeterminate
        v-show="server==null || server==undefined"></v-progress-linear>
      <v-data-table
              :headers="serverStatusHeader"
              :items="serverStatusItems"
              hide-default-footer
              style="margin-top:20px"
              class="elevation-12"
              v-if="server!=undefined"
      >
      </v-data-table>
      <div v-if="name!='(global)'">
      <v-spacer></v-spacer>
      <h1 style="text-align:center;margin-top:20px" v-if="server!=undefined
        && server.status.onlinePlayers != null">Players</h1>
      <v-data-table
              :headers="serverPlayersHeader"
              :items="serverPlayersItems"
              hide-default-footer
              style="margin-top:20px"
              class="elevation-12"
              v-if="server!=undefined
               && server.status.onlinePlayers != null"
      >
      </v-data-table>
      </div>
         <template v-if="server==undefined">
            <div>
                <v-layout row wrap align-center>
                    <v-flex class="text-xs-center">
                        <h1 class = "error-msg"> Database err <br>
                          Sorry! The database seems to either currently be
                          down or your connection's not behaving. </h1>
                        <h4 class="soothing-msg">Have a squid for your woes</h4>
                        <img style = "margin:20px" :src="squidSrc">
                    </v-flex>
                </v-layout>
            </div>
          </template>
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
import Squid from '../assets/squid.png';

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
      server: this.executeQuery(),
      serverStatusHeader: [
        {
          text: 'Name',
          sortable: false,
          value: 'name',
        },
        {
          text: 'Version',
          sortable: false,
          value: 'version',
        },
        {
          text: 'Online',
          sortable: false,
          value: 'online',
        },
        {
          text: 'Player Count',
          sortable: false,
          value: 'playerCount',
        },
      ],
      serverPlayersHeader: [
        {
          text: 'Name',
          sortable: false,
          value: 'name',
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
    squidSrc() {
      return Squid;
    },
    serversOffline() {
      return this.server === undefined;
    },
    serverStatusItems() {
      if (this.server === undefined) {
        return [];
      }
      return [this.server].map((server) => ({
        name: server.name,
        version: server.version,
        online: server.status.isOnline,
        playerCount: `${server.status.onlinePlayerCount} / ${server.status.maxPlayerCount}`,
      }));
    },
    serverPlayersItems() {
      if (this.server === undefined || this.server.status.onlinePlayers === null) {
        return [];
      }
      return this.server.status.onlinePlayers.map((player) => ({
        name: player.lastSeenName,
        firstLogin: this.formatDate(player.firstLogin * 1),
        lastLogin: this.formatDate(player.lastLogin * 1),
      })).sort((a, b) => a.name.localeCompare(b.name));
    },
    serverIdByName() {
      return this.server.id;
    },
    serverQueryTime() {
      if (this.server === undefined) {
        return null;
      }
      return this.formatDate(this.server.status.queryTime * 1);
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
      this.server = null;
      const server = await this.$apollo.query({
        query: gql`
        query {
          mcServer(serverId:"survival") {
            name
            version
            id
            status {
              isOnline
              queryTime
              onlinePlayerCount
              maxPlayerCount
              onlinePlayers{
                lastSeenName
                uuid
                lastLogin
                firstLogin
              }
            }
          }
        }`,
      });
      this.server = server.data.mcServer;
      console.debug(this.server);
      return this.server;
    },
  },
};
</script>
