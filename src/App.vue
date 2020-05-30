<template>
  <v-app>
    <snack-bar></snack-bar>
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
      <v-btn text to="#">AI Music Buddy</v-btn>
      <v-btn text to="/music-cam">Music Cam</v-btn>
    </v-app-bar>
    <audio-store></audio-store>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { initAudioStore } from './utilities/audio-store'
  import AudioStore from './components/AudioStore'
  import SnackBar from './components/SnackBar'
  export default Vue.extend({
    name: 'App',
    created: function () {
      initAudioStore()
    },
    components: { AudioStore, SnackBar },
  })
</script>
