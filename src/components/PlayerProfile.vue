<template>
        <v-flex>
           <v-progress-linear indeterminate v-if="player == null"></v-progress-linear>
            <v-card v-if="name == ''">
              <h3 class="justify-center"
              style="text-align:center;">Please provide a UUID.</h3>
            </v-card>
            <v-card v-else-if="player == null">
              <h3 class="justify-center"
              style="text-align:center;">Player not found.</h3>
            </v-card>
              <v-img
                :src="playerAvatarUrl"
                style="width:20%;
                left:40%"
                loading="Loading Avatar..."
              >
              </v-img>
              <h1 class="text-center">
                <v-icon :color="`${(player.connectedTo!=null)?'green':'red'}`">
                  fiber_manual_record
                </v-icon>
                {{player.lastSeenName}}
              </h1>
              <h2 class="text-center">
                <v-icon>perm_identity</v-icon>
                {{player.uuid}}
              </h2>
              <v-divider style="margin-top:10px;margin-bottom:10px"></v-divider>
              <h2 class="text-center"  v-if="player.groups.length!=0">
                <v-icon>star_border</v-icon>
                <b style="margin-right:20px"> Ranks</b>
                <v-chip
                  v-for="(rank) in playerRanks"
                  :key="rank"
                  class="mr-4">
                    {{rank}}
                  </v-chip>
              </h2>
              <h2 v-else class="text-center">
                <v-icon>star_border</v-icon>
                <b style="margin-right:20px"> User Has No Ranks</b>
              </h2>
              <v-divider style="margin-top:10px;margin-bottom:10px"></v-divider>
              <h2 class="text-center">
                <v-icon>schedule</v-icon>
                <b> First Login</b>
                {{playerFirstLogin}} | {{fromNow(player.firstLogin)}}
              </h2>
              <h2 class="text-center">
                <v-icon>schedule</v-icon>
                <b> Lest Login</b>
                {{playerLastLogin}} | {{fromNow(player.lastLogin)}}
              </h2>
              <v-divider style="margin-top:10px;margin-bottom:10px"
               v-if="player.infractions.bans.length!=0"></v-divider>
              <h2 class="text-center" v-if="player.infractions.bans.length!=0">
                <v-icon>account_balance</v-icon>
                <b> Bans</b>
              </h2>
              <v-expansion-panels multiple>
                <BanListItem
                  v-for="(ban, i) in playerBans"
                  :key="i"
                  :banStaff="ban.staff"
                  :banReason="ban.reason"
                  :isBanActive="ban.active"
                  :banServer="ban.server"
                  :banStart="ban.start"
                  :banEnd="ban.end">
                </BanListItem>
              </v-expansion-panels>
        </v-flex>
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
