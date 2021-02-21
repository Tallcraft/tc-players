<template>
    <div>
        <v-app :dark="darkTheme">
            <v-main style="margin-top:80px">
                <v-container fluid>
                    <router-view></router-view>
                </v-container>
            </v-main>
            <v-toolbar color="primary" dark
             style="
              height:77;
              width:100%;
              position:fixed">
                <router-link to="/">
                    <v-toolbar-title id="title"  class="mr-3" >
                        <v-icon>home</v-icon>
                    </v-toolbar-title>
                </router-link>
                <!-- <v-spacer style="height:0"></v-spacer> -->
                <v-text-field
                        autofocus
                        solo-inverted
                        hide-details
                        prepend-inner-icon="search"
                        label="Player search"
                        v-model="playerInput"
                        @change="playerLookup"
                ></v-text-field>
            </v-toolbar>
            <div style="margin:20px"></div>
        </v-app>
    </div>
</template>

<style scoped>
  a {
    color: white;
    text-decoration: none;
  }
</style>

<script>

export default {
  name: 'App',
  data() {
    return {
      playerInput: '',
      darkTheme: false,
    };
  },
  watch: {
    $route() {
      this.input = '';
    },
    // Save darkTheme state in localStorage
    darkTheme() {
      if (localStorage) localStorage.setItem('darkTheme', this.darkTheme);
    },
  },
  beforeMount() {
    this.darkTheme = this.getThemeState();
  },
  methods: {
    playerLookup() {
      if (!this.$router.history.current.path.endsWith(`/search/${this.playerInput}`)) {
        this.$router.push(`/search/${this.playerInput}`);
      }
    },
    getThemeState() {
      if (!localStorage) {
        return false;
      }
      try {
        return JSON.parse(localStorage.getItem('darkTheme') || false);
      } catch (error) {
        return false;
      }
    },
  },
};
</script>

<style scoped>
    #title {
        color: white !important;
    }
    body {
      overflow:hidden
    }
</style>
