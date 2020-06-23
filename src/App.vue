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

      <v-list dense>
        <v-list-item
          v-for="category in categories"
          :key="category.title"
          link>
          <v-list-item-icon>
            <img :src="category.icon"/>
          </v-list-item-icon>
          <v-list-item-content>
            <v-expansion-panels>
              <v-expansion-panel>
                <v-expansion-panel-header>{{ category.title }}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-list>
                    <v-list-item-group color="primary">
                      <v-list-item
                        v-for="(audioFile, i) in category.audioList"
                        :key="i">
                        <v-list-item-content>
                          <div @click="setCurrentAudio(audioFile.file)"
                               v-text="`${audioFile.name} ${audioFile.file.name}`"></div>
                        </v-list-item-content>
                      </v-list-item>
                    </v-list-item-group>
                  </v-list>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-list-item-content>
        </v-list-item>
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
    import Vue              from 'vue'
    import { initAudioStore, storeGetData } from './utilities/audio-store'
    import SnackBar         from './components/SnackBar'

    import AudioPlayer      from './components/AudioPlayer'

    export default Vue.extend({
        name:       'App',
        created:    function () {
            initAudioStore()
        },
        components: { AudioPlayer, SnackBar },
        data () {
            return {
                drawer:       false,
                saveIcon:     require('./assets/audio store/logo.svg'),
                categories:   storeGetData(),
                currentAudio: null,
            }
        },
        methods:    {
            setCurrentAudio (audio) {
                this.currentAudio = audio
            },
        },
    })
</script>
