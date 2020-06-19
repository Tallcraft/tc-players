<template>
    <v-layout row>
        <v-flex xs12 sm6 offset-sm3>
            <v-progress-linear indeterminate
                               v-show="$apollo.queries.players.loading"></v-progress-linear>

            <v-card v-if="name == null || name === ''">
                <v-card-title>Please provide a player name to search for</v-card-title>
            </v-card>
            <v-card v-else-if="playerNotFound">
                <v-card-title>Could not find player '{{name}}'</v-card-title>
            </v-card>
            <v-card v-else-if="players != null">
                <v-img
                        :src="playerAvatarUrl"
                        height="300px"
                >
                </v-img>

                <v-card-title primary-title>
                    <div class="headline">{{players.name}}</div>
                </v-card-title>


                <v-list two-line>
                    <v-list-tile>
                        <v-list-tile-action>
                            <v-icon color="accent">perm_identity</v-icon>
                        </v-list-tile-action>

                        <v-list-tile-content>
                            <v-list-tile-title>{{players[0].uuid}}</v-list-tile-title>
                            <v-list-tile-sub-title>UUID</v-list-tile-sub-title>
                        </v-list-tile-content>

                    </v-list-tile>

                    <v-divider inset></v-divider>

                    <v-list-tile>
                        <v-list-tile-action>
                            <v-icon color="accent">date_range</v-icon>
                        </v-list-tile-action>

                        <v-list-tile-content>
                            <v-list-tile-title>{{playerLastLogin}}</v-list-tile-title>
                            <v-list-tile-sub-title>Last Login</v-list-tile-sub-title>
                        </v-list-tile-content>

                    </v-list-tile>


                    <v-list-tile>
                        <v-list-tile-action>
                            <v-icon color="accent">date_range</v-icon>
                        </v-list-tile-action>

                        <v-list-tile-content>
                            <v-list-tile-title>{{playerFirstLogin}}</v-list-tile-title>
                            <v-list-tile-sub-title>First Login</v-list-tile-sub-title>
                        </v-list-tile-content>

                    </v-list-tile>

                </v-list>

                <v-card-text>
                    <h3>Bans</h3>
                    <v-data-table
                            :headers="playerHistoryHeader"
                            :items="playerHistoryData"
                            hide-actions
                            class="elevation-1"
                    >
                        <template slot="items" slot-scope="props">
                            <td v-for="(item, i) in props.item" :key="i">
                                {{ item }}
                            </td>
                        </template>
                    </v-data-table>

                </v-card-text>
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
          value: 'date',
        },
        {
          text: 'End',
          sortable: false,
          value: 'date',
        },
      ],
    };
  },
  computed: {
    playerNotFound() {
      if (this.players === undefined) {
        return false;
      }
      return (!this.$apollo.queries.players.loading && this.players == null)
      || this.players[0].lastSeenName !== this.name;
    },
    playerAvatarUrl() {
      if (this.players == null) {
        return '';
      }
      return `https://crafatar.com/avatars/${this.players[0].uuid}?size=300&overlay`;
    },
    playerFirstLogin() {
      return this.formatDate(this.players[0].firstLogin * 1);
    },
    playerLastLogin() {
      return this.formatDate(this.players[0].lastLogin * 1);
    },
    playerHistoryData() {
      if (this.players == null || this.players[0].lastSeenName !== this.name) return null;
      return this.players[0].infractions.bans.map(ban => ({
        active: ban.isActive,
        server: ban.server.name,
        reason: ban.reason,
        staff: ban.staffName,
        start: this.formatDate(ban.createdAt * 1),
        end: this.formatDate(ban.expiresAt * 1),
      }));
    },
  },
  methods: {
    formatDate(date) {
      if (date == null) {
        return '-';
      }
      const d = new Date(date);
      return (d.getFullYear() === 1969) ? 'Never' : d.toLocaleString();
    },
  },
  apollo: {
    // Query with parameters
    players: {
      // gql query
      query: gql`
      query players($name:String!) {
        players(searchPlayerName:$name,limit:1){
          lastSeenName
          firstLogin
          uuid
          lastLogin
          infractions{
            bans{
              isActive
              reason
              staffName
              server{
                name
              }
              createdAt
              expiresAt
            }
          }
        }
      }
      `,
      // Static parameters
      variables() {
        return {
          name: this.name,
        };
      },
    },
  },
};
</script>
