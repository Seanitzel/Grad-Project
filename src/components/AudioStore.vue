<template>

</template>

<script>


  export default {
    name:       'AudioStore',
    components: { AudioPlayer },
    data () {
      return {
        saveIcon:     require('../assets/audio store/logo.svg'),
        categories:   storeGetData(),
        currentAudio: null,
      }
    },
    methods:    {
      setCurrentAudio (audio) {
        this.currentAudio = audio
      },
    },
  }
</script>

<style lang="scss" scoped>
  .player-wrapper {
    /*position: absolute;*/
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    text-align: center;
    width: fit-content;
  }

  .logo {
    background: rgba(255, 255, 255, 0.6);
    border-radius: 5px;
  }
</style>
