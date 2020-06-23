<template>
  <v-container class="text-center">
    <v-row justify="center" align-content="center">
      <v-col cols="12">
        <play/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'MusicCam',
    components: {
      Play:  () => import('sections/music-cam/Play'),
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
