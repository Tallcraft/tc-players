<template>
  <v-expansion-panel>
    <v-expansion-panel-header class="justify-space-between flex-wrap" expand-icon="expand_more">
      <v-icon class="flex-grow-0 pr-4">report</v-icon>
      <b>{{banReason}}</b>
       <v-chip class="flex-grow-0 playerCounter mr-4">
        {{banStaff}}
      </v-chip>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-lazy>
        <BanDetail
          :isBanActive="isBanActive"
          :banServer="banServer"
          :banStart="banStart"
          :banEnd="banEnd">
        </BanDetail>
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
    banReason: {
      type: String,
      required: true,
    },
    banStaff: {
      type: String,
      required: true,
    },
    isBanActive: {
      type: Boolean,
      required: true,
    },
    banServer: {
      type: String,
      required: true,
    },
    banStart: {
      type: String,
      required: true,
    },
    banEnd: {
      type: String,
      required: true,
    },
  },
};
</script>
