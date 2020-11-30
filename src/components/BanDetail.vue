<template>
  <div>
    <v-list>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>help</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <b>Active</b>
            {{ban.active}}
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>dns</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <b>Server</b>
            {{ban.server}}
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>schedule</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <b>Created</b>
            {{ban.start}}
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>schedule</v-icon>
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
