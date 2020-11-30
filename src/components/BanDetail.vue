<template>
  <div>
    <v-list>
        <v-list-item>
          <v-list-item-icon>
            <v-icon color="#8492e8">help</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <b>Active</b>
            {{ban.active}}
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon color="grey">dns</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <b>Server</b>
            {{ban.server}}
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon color="#6e9160">schedule</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <b>Created</b>
            {{ban.start}}
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon color="#a8636b">schedule</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <b>Expires</b>
            {{ban.end}}
          </v-list-item-content>
        </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'BanDetail',
  props: {
    ban: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style scoped>
</style>
