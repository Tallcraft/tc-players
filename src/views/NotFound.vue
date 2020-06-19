<template>
    <div>
        <v-layout row wrap align-center>
            <v-flex class="text-xs-center">
                <h1> {{ errCode }} <br> {{ err }} </h1>
                <h4 class="soothing-msg">Have a squid for your woes</h4>
                <img style = "margin:20px" :src="squidSrc">
            </v-flex>
        </v-layout>
    </div>
</template>

<script>
import Squid from '@/assets/squid.png';

export default {
  name: 'NotFound',
  computed: {
    squidSrc() {
      return Squid;
    },
    err() {
      return `Sorry! We coulnd't find the page : "${document.URL}"`;
    },
    errCode() {
      return '404 err';
    },
  },
};
</script>
