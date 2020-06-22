<template>
  <div>
    <v-flex xs10 sm8 offset-sm2>
      <h1 style="text-align:center" v-if="servers!=undefined"> Server Status </h1>
      <h4 style="text-align:center;margin-top:20px" v-if="servers!=undefined">
        Last Updated at {{serverQueryTime}}</h4>
      <v-progress-linear indeterminate
        v-show="servers==undefined"></v-progress-linear>
      <div block v-for="(server, index) in servers" :key="index" class="row">
        <v-btn block
          left
          style="display:inline;
          width:100%;
          height:20;"
          class="btn-text"
          @click.native="$router.push(`/status/${server.id}`)">
          <p v-if="!server.status.isOnline && server.status.isOnline!=null
           && server.status.isOnline!=undefined"
           style="margin-top:auto;margin-bottom:auto">❌</p>
          <p v-if="server.status.isOnline" style="margin-top:auto;margin-bottom:auto">✅</p>
          <p v-if="server.status==null || server.status.isOnline==undefined"
           style="margin-top:auto;margin-bottom:auto;">❗</p>
          <p style="margin-left:auto;margin-top:auto;margin-bottom:auto">{{server.name}}</p>
          <p style="margin-left:auto;margin-top:auto;margin-bottom:auto">{{server.version}}</p>
        </v-btn>
      </div>
         <template v-if="servers==undefined">
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
      servers: this.executeQuery(),
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
      return this.servers === undefined;
    },
    serverStatusItems() {
      if (this.servers === undefined) {
        return [];
      }
      return this.servers.map((server) => ({
        name: server.name,
        version: server.version,
        online: server.status.isOnline,
        playerCount: `${server.status.onlinePlayerCount} / ${server.status.maxPlayerCount}`,
      }));
    },
    serverQueryTime() {
      if (this.servers === undefined) {
        return null;
      }
      return this.formatDate(this.servers[0].status.queryTime * 1);
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
      return this.servers.find((item) => item.name === name).id;
    },
    async executeQuery() {
      this.servers = null;
      const servers = await this.$apollo.query({
        query: gql`
        query {
          mcServers {
            name
            version
            id
            status {
              isOnline
              queryTime
            }
          }
        }`,
      });
      this.servers = servers.data.mcServers;
      return this.servers;
    },
  },
  watch: {
    $route() {
      this.executeQuery();
    },
  },
};
</script>
