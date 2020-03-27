<template>
  <v-row class="text-center" style="position: sticky; bottom: 0;">
    <v-col :cols="12">
      <v-btn @click="toggleGame">Toggle {{toggle ? 'Off' : 'On'}}</v-btn>
    </v-col>
    <v-col :cols="12">
      <div id="p5Canvas" ref="canvas"/>
    </v-col>
  </v-row>
</template>

<script>
  import * as p5           from 'p5'
  import setup, { remove } from './TrainSetup'

  export default {
    name: 'Train',
    data () {
      return {
        toggle: false,
        canvas: null,
      }
    },

    mounted () {
      new p5(setup, this.$refs.canvas)
    },

    beforeDestroy () {
      remove()
    },

    methods: {
      toggleGame () {
        this.toggle = !this.toggle
      },
    },
  }
</script>

<style scoped>
</style>
