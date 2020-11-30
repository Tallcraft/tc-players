<template>
    <v-layout row>
        <v-flex xs12 sm8 offset-sm2>
           <v-progress-linear indeterminate v-if="player == null"></v-progress-linear>
            <v-card v-if="name == ''">
              <h3 class="justify-center"
              style="text-align:center;">Please provide a UUID.</h3>
            </v-card>
            <v-card v-else-if="player == null">
              <h3 class="justify-center"
              style="text-align:center;">Player not found.</h3>
            </v-card>
            <v-list v-else>
              <v-img
                :src="playerAvatarUrl"
                class="justify-center"
                style="width:50%;
                left:25%"
                loading="Loading Avatar..."
              >
              </v-img>
               <v-list-item v-if="player.connectedTo" flat>
                <v-list-item-icon class="justify-center">
                  <v-icon>done_outline</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <b>Online On</b>
                  {{player.connectedTo.name}}
                </v-list-item-content>
               </v-list-item>
              <v-list-item v-else flat>
                <v-list-item-icon class="justify-center">
                  <v-icon>clear</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <b>Offline</b>
                </v-list-item-content>
               </v-list-item>
              <v-list-item flat>
                <v-list-item-icon class="justify-center">
                  <v-icon>perm_identity</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <b>Name</b>
                  {{player.lastSeenName}}
                </v-list-item-content>
               </v-list-item>
              <v-list-item flat>
                <v-list-item-icon>
                  <v-icon>perm_identity</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <b>UUID</b>
                  {{player.uuid}}
                </v-list-item-content>
              </v-list-item>
              <v-list-item flat v-if="player.groups.length">
                <v-list-item-icon>
                  <v-icon>star_border</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <b>Ranks</b>
                  <div>
                  <v-chip
                    v-for="(rank) in playerRanks"
                    :key="rank">
                      {{rank}}
                    </v-chip>
                  </div>
                </v-list-item-content>
              </v-list-item>
              <v-list-item flat v-else>
                <v-list-item-icon>
                  <v-icon>star_border</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <b>No Ranks</b>
                </v-list-item-content>
              </v-list-item>
              <v-list-item flat>
                <v-list-item-icon>
                  <v-icon>schedule</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <b>First Login</b>
                  {{playerFirstLogin}}
                <br>{{fromNow(player.firstLogin)}}
                </v-list-item-content>
              </v-list-item>
              <v-list-item flat>
                <v-list-item-icon>
                  <v-icon>schedule</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <b>Last Login</b>
                  {{playerLastLogin}}
                <br>{{fromNow(player.lastLogin)}}
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="player.infractions.bans.length" flat>
                <v-list-item-icon>
                  <v-icon>account_balance</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <b>Bans</b>
                   <v-expansion-panels multiple>
                  <BanListItem
                    v-for="ban in playerBans"
                    :key="ban"
                    :ban="ban">
                  </BanListItem>
                   </v-expansion-panels>
                  <!--
                  <v-data-table
                    :headers="playerHistoryHeader"
                    :items="playerHistoryData"
                    v-if="playerHistoryData"
                    hide-default-footer
                    class="elevation-1"
                  >
                  </v-data-table> -->
                </v-list-item-content>
              </v-list-item>
            </v-list>
        </v-flex>
    </v-layout>
</template>

<script>
import gql from 'graphql-tag';
import countdown from 'countdown';
import BanListItem from './BanListItem.vue';

// TODO: allow providing either name or uuid as prop
export default {
  name: 'PlayerProfile',
  components: { BanListItem },
  props: {
    name: {
      default: '',
      type: String,
    },
  },
  data() {
    return {
      player: this.executeQuery(),
    };
  },
  computed: {
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
    playerRanks() {
      return this.player.groups.map((group) => group.id.toUpperCase());
    },
    playerBans() {
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
    fromNow(date) {
      return `${countdown(new Date(), date, countdown.ALL, 1)} ago`;
    },
    formatDate(date) {
      if (!date) {
        return '-';
      }
      const d = new Date(date);
      return d.toLocaleString();
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
