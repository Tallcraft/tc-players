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
                        solo-inverted
                        hide-details
                        prepend-inner-icon="search"
                        label="Player search"
                        v-model="playerInput"
                        @change="playerLookup"
                ></v-text-field>
                <!-- <v-spacer style="height:0"></v-spacer> -->
                <v-btn text icon @click="darkTheme = !darkTheme" style="height:0">
                    <v-icon style="height:0">invert_colors</v-icon>
                </v-btn>
                <v-btn dark style="width:10%;font-size:1">
                    <a href="https://status.tallcraft.com">
                      Server<br>Status
                    </a>
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
