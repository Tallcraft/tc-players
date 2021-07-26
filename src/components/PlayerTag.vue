<template>
  <div>
    <v-card min-width="40px" max-width="7vw">
      <img :src="`https://crafatar.com/avatars/${UUID}?size=300&overlay`"
      style="width:75%;
      margin-left:12.5%;
      padding-top:12.5%;">
        <p
        style="
        font-size: max(0.8vw,7pt);
        text-align:center;">
          {{title}}
        </p>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'PlayerTag',
  props: {
    title: {
      type: String,
      required: true,
    },
    UUID: {
      type: String,
      required: true,
    },
  },
};
</script>
