<template>
    <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
            <v-progress-linear indeterminate
              v-show="player.firstLogin == undefined || playerNotFound"></v-progress-linear>
            <v-card v-if="name == null || name === ''">
                <h3 class="justify-center"
               style="text-align:center;">Please provide a UUID.</h3>
            </v-card>
            <v-card v-else-if="playerNotFound">
              <h3 class="justify-center"
               style="text-align:center;">Could not find a player with the uuid <br>'{{name}}'</h3>
            </v-card>
            <v-card inline v-else-if="player != null">
              <v-img
                :src="playerAvatarUrl"
                class="justify-center"
                style="width:50%;
                left:25%"
                loading="Loading Avatar..."
              >
              </v-img>
              <h3 class="justify-center"
                style="
                text-align:center;
                margin-top:10px"
                v-if="player.connectedTo!=null"
                >
                This User Is Online On {{player.connectedTo.name}}.
                </h3>
                <v-divider block style="margin-top:2%;margin-bottom:2%"
                 v-if="player.connectedTo!=null"></v-divider>
              <div primary-title class="headline">{{player.name}}</div>
              <!-- <v-icon color="accent">perm_identity</v-icon> -->
              <h3 class="justify-center"
                style="text-align:center;">
                Name: {{player.lastSeenName}}
                <br>UUID: {{player.uuid}}
                <v-divider block style="margin-top:2%;margin-bottom:2%"></v-divider>
                Rank(s): {{getRanks()}}</h3>
              <v-divider block style="margin-top:2%;margin-bottom:2%"></v-divider>
              <!-- <v-icon class="justify-center" color="accent">date_range</v-icon> -->
              <h3 class="justify-center"
                style="text-align:center;">Last Login: {{playerLastLogin}}
                |  {{countdown(new Date(), player.lastLogin,countdown.ALL,3)}}
              <br>First Login: {{playerFirstLogin}}
                |  {{countdown(new Date(), player.firstLogin,countdown.ALL,3)}}</h3>
              <v-divider block style="margin-top:2%;margin-bottom:2%"></v-divider>
              <h3 class="justify-center"
                style="
                text-align:center;
                margin-top:10px"
                v-if="playerHistoryData"
                >
                Ban Information
                </h3>
                <h3 class="justify-center"
                style="
                text-align:center;
                margin-top:10px;
                margin-bottom:10px;"
                v-if="!playerHistoryData"
                >
                This User Has No Bans On Record.
                </h3>
              <v-data-table
                :headers="playerHistoryHeader"
                :items="playerHistoryData"
                v-if="playerHistoryData"
                hide-default-footer
                class="elevation-1"
              >
              </v-data-table>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
import gql from 'graphql-tag';

// TODO: allow providing either name or uuid as prop
export default {
  name: 'PlayerProfile',
  props: {
    name: {
      default: '',
      type: String,
    },
  },
  data() {
    return {
      player: this.executeQuery(),
      playerHistoryHeader: [
        {
          text: 'Active',
          sortable: false,
          value: 'active',
        },
        {
          text: 'Server',
          sortable: false,
          value: 'server',
        },
        {
          text: 'Reason',
          sortable: false,
          value: 'reason',
        },
        {
          text: 'Staff',
          sortable: false,
          value: 'staff',
        },
        {
          text: 'Begin',
          sortable: false,
          value: 'start',
        },
        {
          text: 'End',
          sortable: false,
          value: 'end',
        },
      ],
    };
  },
  computed: {
    playerNotFound() {
      if (this.player === undefined) {
        return false;
      }
      return this.player == null;
    },
    playerAvatarUrl() {
      if (this.player == null) {
        return '';
      }
      return `https://crafatar.com/avatars/${this.player.uuid}?size=300&overlay`;
    },
    playerFirstLogin() {
      return this.formatDate(this.player.firstLogin * 1);
    },
    playerLastLogin() {
      return this.formatDate(this.player.lastLogin * 1);
    },
    playerHistoryData() {
      if (this.player === null || this.player === undefined) return null;
      if (this.player.infractions === undefined) return null;
      if (this.player.infractions.bans.length === 0) return null;
      return this.player.infractions.bans.map((ban) => ({
        active: ban.isActive,
        server: (ban.server == null) ? 'Tallcraft Network' : ban.server.name,
        reason: ban.reason,
        staff: ban.staffName,
        start: `${this.formatDate(ban.createdAt * 1)}`,
        end: `${this.formatDate(ban.expiresAt * 1)}`,
      }));
    },
  },
  watch: {
    $route: 'executeQuery',
  },
  methods: {
    formatDate(date) {
      if (date == null) {
        return '-';
      }
      const d = new Date(date);
      return (d.getFullYear() < 2000) ? 'Never' : d.toLocaleString();
    },
    getRanks() {
      if (this.player === undefined || this.player.groups === undefined) {
        return 'None';
      }
      return `[${this.player.groups.map((group) => group.id).join().split(',').join('] [')
        .toUpperCase()}]`;
    },
    async executeQuery() {
      const player = await this.$apollo.query({
        query: gql`
        query {
          player(uuid: "${this.name}") {
            lastSeenName
            uuid
            lastLogin
            firstLogin
            groups {
              id
            }
            connectedTo{
              name
            }
            infractions {
              bans {
                reason
                isActive
                staffName
                server {
                  name
                }
                createdAt
                expiresAt
              }
            }
          }
        }`,
      });
      this.player = player.data.player;
      return this.player;
    },
  },
};
</script>
