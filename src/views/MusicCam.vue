<template>
  <v-container class="text-center">
    <v-row>
      <v-col :cols="12">
        <v-switch v-model="mode" label="Play"/>
      </v-col>
      <v-col :cols="12"
             v-if="mode">
        <play/>
      </v-col>
      <v-col :cols="12"
             v-else>
        <train/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'MusicCam',

    components: {
      Play: () => import('sections/music-cam/Play'),
      Train: () => import('sections/music-cam/Train'),
    },

    data: () => {
      return {
        mode: false,
      }
    },
  }
</script>

<style scoped>

</style>
