<template>
  <v-container class="text-center">
    <v-row justify="center" align-content="center">
      <v-col cols="6">
        <v-btn color="warning" @click="mode=false">
          Train
        </v-btn>
      </v-col>
      <v-col cols="6">
        <v-btn color="success" @click="mode=true">
          Play
        </v-btn>
      </v-col>
      <v-col cols="12">
        <play v-if="mode"/>
        <train v-else/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'MusicCam',
    components: {
      Play:  () => import('sections/music-cam/Play'),
      Train: () => import('sections/music-cam/Train'),
    },

    data: () => {
      return {
        mode: true,
      }
    },
  }
</script>

<style scoped>

</style>
