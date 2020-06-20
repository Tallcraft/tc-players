<template>
    <div>
        <v-app :dark="darkTheme">
            <v-toolbar color="primary" dark fixed clipped-left app>
                <router-link to="/">
                    <v-toolbar-title id="title"  class="mr-3" >
                        {{$appName}}
                    </v-toolbar-title>
                </router-link>
                <v-spacer></v-spacer>
                <v-text-field
                        flat
                        solo-inverted
                        hide-details
                        prepend-inner-icon="search"
                        label="Player Search"
                        v-model="playerInput"
                        @change="playerLookup"
                ></v-text-field>
                <v-spacer></v-spacer>
                <v-btn flat icon @click="darkTheme = !darkTheme">
                    <v-icon>invert_colors</v-icon>
                </v-btn>
                <v-btn>
                    <router-link to="/status">
                      Server Status
                    </router-link>
                </v-btn>
                <!-- <v-toolbar-items>
                    <v-btn href="https://forum.tallcraft.com/new-topic?category_id=5" flat>Ban Dispute</v-btn>
                </v-toolbar-items> -->
            </v-toolbar>
            <v-content>
                <v-container fluid>
                    <router-view></router-view>
                </v-container>
            </v-content>
            <v-footer  style="text-align:center">
              <v-spacer></v-spacer>
                <h2>Names might not be up to date</h2>
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
