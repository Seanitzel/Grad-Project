<template>
  <div class="home">
    <v-row class="text-center white--text">
      <v-col cols="12" class="pt-8">
    <span class="display-3 font-weight-black">
      Welcome to the Music Playground!
    </span>
      </v-col>
      <v-col cols="12" class="pb-8">
        <v-img contain max-height="250" :src="require('assets/bg2.png')"/>
      </v-col>
      <v-col v-for="feature in features" :key="feature.name" cols="4" class="v-card v-card--hover"
             @click="goToPath(feature)">
        <h2>
          {{feature.name}}
        </h2>
        <p>
          {{feature.info}}
        </p>
      </v-col>
      <v-col cols="12" class="pt-8">
    <span class="display-1 font-weight-bold">
      By Sean Dvir & Michael Levitin
    </span>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    name:    'Home',
    data () {
      return {
        features: [
          {
            name: 'Audio Extractor',
            info: 'Extract audio stems from any song!',
            path: '/audio-extractor',
          },
          {
            name: 'Music Cam',
            info: 'Make music with your body!',
            path: '/music-cam',
          },
          {
            name: 'Music Buddy',
            info: 'Generate full scores using AI and jam along with them!',
            path: 'https://music-buddy-project.web.app/',
          },
        ],
      }
    },
    methods: {
      goToPath (feature) {
        if (feature.name !== 'Music Buddy') {
          this.$router.push(feature.path)
        } else {
          window.open(feature.path, '_blank')
        }
      },
    },
  }
</script>
