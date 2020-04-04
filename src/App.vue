<template>
  <v-app>
    <v-app-bar
        app
        color="primary" dark>
      <span class="title">
        Music Playground
      </span>
      <v-spacer/>
      <v-btn text to="/">home</v-btn>
      <v-btn text to="/about">about</v-btn>
      <v-btn text to="/audio-extractor">Audio Extractor</v-btn>
      <v-btn text to="music-buddy">AI Music Buddy</v-btn>
      <v-btn text to="/music-cam">Music Cam</v-btn>
    </v-app-bar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
  import Vue from 'vue'

  export default Vue.extend({
    name: 'App',

    data: () => ({
      //
    }),
  })
</script>
