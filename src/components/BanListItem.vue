<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="justify-space-between flex-wrap" expand-icon="expand_less">
      <v-icon color="red" class="flex-grow-0 pr-4">report</v-icon>
      <b>{{ban.reason}}</b>
       <v-chip class="flex-grow-0 playerCounter mr-4">
        {{ban.staff}}
      </v-chip>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-lazy>
        <BanDetail :ban="ban"></BanDetail>
      </v-lazy>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import BanDetail from './BanDetail.vue';

export default {
  name: 'BanListItem',
  components: { BanDetail },
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
