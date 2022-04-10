<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      floating>
      <v-list-item class="px-2 logo">
        <v-list-item-avatar>
          <v-img :src="saveIcon"></v-img>
        </v-list-item-avatar>
        <v-list-item-title class="title">Audio Store</v-list-item-title>
      </v-list-item>

      <v-divider></v-divider>
      <v-list>
        <v-list-item-group color="primary">
          <v-list-item
            v-for="([name, audio], i) in Object.entries($store.getters['getAudioList'])"
            :key="i">
            <v-list-item-content>
              <div @click="setCurrentAudio(audio)"
                   v-text="`${name} ${audio.name}`"></div>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <div class="player-wrapper" v-if="currentAudio">
        <v-list-item-title>{{ currentAudio.name }}</v-list-item-title>
        <audio-player :auto-play="true" :file="currentAudio.filePath"></audio-player>
      </div>
    </v-navigation-drawer>
    <v-app-bar
      app
      color="primary" dark>
      <v-app-bar-nav-icon @click="drawer=!drawer"/>
      <span class="title">
        Music Playground
      </span>
      <v-spacer/>
      <v-btn text to="/">home</v-btn>
      <v-btn text to="/audio-extractor">Audio Extractor</v-btn>
      <v-btn text to="/music-cam">Music Cam</v-btn>
      <a href="https://music-buddy-project.web.app/" target="_blank">
        <v-btn text>
          Music Buddy
          <v-icon>launch</v-icon>
        </v-btn>
      </a>
    </v-app-bar>
    <v-content class="primary">
      <router-view/>
      <snack-bar/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
    import Vue      from 'vue'
    import SnackBar from './components/SnackBar.vue'

    import AudioPlayer from './components/AudioPlayer.vue'

    export default Vue.extend({
        name:       'App',
        components: { AudioPlayer, SnackBar },
        data() {
            return {
                drawer:       false,
                saveIcon:     require('./assets/audio store/logo.svg'),
                currentAudio: null,
            }
        },
        methods:    {
            setCurrentAudio(audio) {
                this.currentAudio = audio
            },
        },
    })
</script>
