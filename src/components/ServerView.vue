<template>
  <div>
    <v-flex xs10 sm8 offset-sm2>
      <h1 style="text-align:center" v-if="mcServer!=undefined"> {{mcServer.name}} Status </h1>
      <h4 style="text-align:center;margin-top:20px" v-if="mcServer!=undefined">
        Last Updated at {{serverQueryTime}}</h4>
      <v-progress-linear indeterminate
        v-show="$apollo.queries.mcServer.loading"></v-progress-linear>
      <v-data-table
              :headers="serverStatusHeader"
              :items="serverStatusItems"
              hide-actions
              style="margin-top:20px"
              class="elevation-12"
              v-if="!$apollo.queries.mcServer.loading && mcServer!=undefined"
      >
          <template slot="items" slot-scope="props">
              <td v-for="(item, i) in props.item" :key="i">
                  <router-link
                          v-if="i === 'name'"
                          :to="`/status/${serverIdByName}`">
                      {{ item }}
                  </router-link>
                  <template v-else>{{item}}</template>
              </td>
          </template>
      </v-data-table>
      <div v-if="name!='(global)'">
      <v-spacer></v-spacer>
      <h1 style="text-align:center;margin-top:20px" v-if="mcServer!=undefined
        && mcServer.status.onlinePlayers != null">Players</h1>
      <v-data-table
              :headers="serverPlayersHeader"
              :items="serverPlayersItems"
              hide-actions
              style="margin-top:20px"
              class="elevation-12"
              v-if="!$apollo.queries.mcServer.loading && mcServer!=undefined
               && mcServer.status.onlinePlayers != null"
      >
          <template slot="items" slot-scope="props">
              <td v-for="(item, i) in props.item" :key="i">
                  <router-link
                      v-if="i === 'name'"
                      :to="`/player/${item}`">
                      {{ item }}
                  </router-link>
                  <template v-else>{{item}}</template>
              </td>
          </template>
      </v-data-table>
      </div>
         <template v-if="mcServer==undefined && !$apollo.queries.mcServer.loading">
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
          value: 'version',
        },
        {
          text: 'Last Login',
          sortable: false,
          value: 'online',
        },
      ],
    };
  },
  computed: {
    squidSrc() {
      return Squid;
    },
    serversOffline() {
      return this.mcServer === undefined;
    },
    serverStatusItems() {
      if (this.mcServer === undefined) {
        return [];
      }
      return [this.mcServer].map((server) => ({
        name: server.name,
        version: server.version,
        online: server.status.isOnline,
        playerCount: `${server.status.onlinePlayerCount} / ${server.status.maxPlayerCount}`,
      }));
    },
    serverPlayersItems() {
      if (this.mcServer === undefined || this.mcServer.status.onlinePlayers === null) {
        return [];
      }
      return this.mcServer.status.onlinePlayers.map((player) => ({
        name: player.name,
        firstLogin: this.formatDate(player.firstLogin * 1),
        lastLogin: this.formatDate(player.lastLogin * 1),
      })).sort((a, b) => a.name.localeCompare(b.name));
    },
    serverIdByName() {
      return this.mcServer.id;
    },
    serverQueryTime() {
      if (this.mcServer === undefined) {
        return null;
      }
      return this.formatDate(this.mcServer.status.queryTime * 1);
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
  },
  apollo: {
    // Query with parameters
    mcServer: {
      // gql query
      query: gql`
      query ($id:String!) {
        mcServer (serverId:$id) {
          name
          version
          id
          status {
            isOnline
            onlinePlayerCount
            maxPlayerCount
            queryTime
            onlinePlayers {
              name
              lastSeenName
              lastLogin
              firstLogin
            }
          }
        }
      }
      `,
      variables() {
        return {
          id: this.name,
        };
      },
    },
  },
};
</script>
