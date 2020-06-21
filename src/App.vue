<template>
    <div>
        <v-app :dark="darkTheme">
            <div style="margin-bottom:5%"></div>
            <v-main style="margin-top:80">
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
                        {{$appName}}
                    </v-toolbar-title>
                </router-link>
                <v-spacer style="height:0"></v-spacer>
                <v-text-field
                        solo-inverted
                        hide-details
                        prepend-inner-icon="search"
                        label="Search for a player"
                        v-model="playerInput"
                        @change="playerLookup"
                ></v-text-field>
                <v-spacer style="height:0"></v-spacer>
                <v-btn text icon @click="darkTheme = !darkTheme" style="height:0">
                    <v-icon style="height:0">invert_colors</v-icon>
                </v-btn>
                <v-btn dark>
                    <router-link to="/status">
                      Server Status
                    </router-link>
                </v-btn>
            </v-toolbar>
            <div style="margin:20px"></div>
            <v-footer dark
             style="text-align:center;
                position: fixed;
                left: 0;
                bottom: 0;
                width: 100%;
                height:35px;">
              <v-spacer></v-spacer>
                <h5>Names might not be up to date</h5>
              <v-spacer></v-spacer>
            </v-footer>
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
      this.playerInput = '';
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
      this.$router.push(`/search/${this.playerInput}`);
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
