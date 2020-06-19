<template>
  <div>
    <v-flex xs10 sm8 offset-sm2>
      <h1 style="text-align:center" v-if="mcServers!=undefined"> Server Status </h1>
      <h4 style="text-align:center;margin-top:20px" v-if="mcServers!=undefined">
        Last Updated at {{serverQueryTime}}</h4>
      <v-progress-linear indeterminate
        v-show="$apollo.queries.mcServers.loading"></v-progress-linear>
      <v-data-table
              :headers="serverStatusHeader"
              :items="serverStatusItems"
              hide-actions
              style="margin-top:20px"
              class="elevation-12"
              v-if="!$apollo.queries.mcServers.loading && mcServers!=undefined"
      >
          <template slot="items" slot-scope="props">
              <td v-for="(item, i) in props.item" :key="i" :dark="darkTheme">
                  <router-link
                          v-if="i === 'name'"
                          :to="`/status/${serverIdByName(item)}`">
                      {{ item }}
                  </router-link>
                  <template v-else>{{item}}</template>
              </td>
          </template>
      </v-data-table>
         <template v-if="mcServers==undefined && !$apollo.queries.mcServers.loading">
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
import Squid from '@/assets/squid.png';

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
    };
  },
  computed: {
    squidSrc() {
      return Squid;
    },
    serversOffline() {
      return this.mcServers === undefined;
    },
    serverStatusItems() {
      if (this.mcServers === undefined) {
        return [];
      }
      return this.mcServers.map(server => ({
        name: server.name,
        version: server.version,
        online: server.status.isOnline,
        playerCount: `${server.status.onlinePlayerCount} / ${server.status.maxPlayerCount}`,
      }));
    },
    serverQueryTime() {
      if (this.mcServers === undefined) {
        return null;
      }
      return this.formatDate(this.mcServers[0].status.queryTime * 1);
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
    serverIdByName(name) {
      return this.mcServers.find(item => item.name === name).id;
    },
  },
  apollo: {
    // Query with parameters
    mcServers: {
      // gql query
      query: gql`
      query {
        mcServers {
          name
          version
          id
          status {
            isOnline
            onlinePlayerCount
            maxPlayerCount
            queryTime
          }
        }
      }
      `,
    },
  },
};
</script>
