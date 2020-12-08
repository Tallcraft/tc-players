<template>
  <div>
    <v-list>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>help</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <b>Active</b>
            {{isBanActive}}
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>dns</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <b>Server</b>
            {{banServer}}
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>schedule</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <b>Created</b>
            {{banStart}}
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>schedule</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <b>Expires</b>
            {{banEnd}}
          </v-list-item-content>
        </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'BanDetail',
  props: {
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
