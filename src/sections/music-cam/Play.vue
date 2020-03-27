<template>
  <v-row class="text-center">
    <v-col cols="6">
      <v-menu v-model="pitchClassMenu"
              :close-on-content-click="false"
              offset-y bottom dark>
        <template #activator="{ on }">
          <v-btn v-on="on" class="text-capitalize font-weight-black">
            {{ pitchClass }}
            <v-icon small>arrow_drop_{{ pitchClassMenu ? 'up' : 'down' }}</v-icon>
          </v-btn>
        </template>
        <v-row dense justify="center"
               align="center"
               class="text-center px-4 white">
          <v-col :cols="12">
            Pitch class
          </v-col>
          <v-col :cols="12">
            <v-row dense>
              <v-col v-for="pc in pitchClasses" :key="pc">
                <v-btn x-small
                       class="text-capitalize"
                       :color="pitchClass === pc ? 'success' : ''"
                       @click="changeRoot(pc)">
                  {{ pc }}
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-menu>
    </v-col>
    <v-col :cols="6">
      <v-btn @click="toggleGame">Toggle Sound {{toggle ? 'Off' : 'On'}}</v-btn>
    </v-col>
    <v-col :cols="12">
      <div id="p5Canvas" ref="canvas"/>
    </v-col>
  </v-row>
</template>

<script>
  import * as p5                                         from 'p5'
  import setup, { changePitchClasses, remove, setState } from './PlaySetup'
  import { Constants, PitchClass, Scale }                from 'note-art'

  const majPenta = [2, 4, 7, 9]

  export default {
    name: 'Play',
    data () {
      return {
        toggle:         false,
        canvas:         null,
        pitchClass:     'C',
        pitchClassMenu: false,
        pitchClasses:   Constants.pitchClasses,
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
        setState(this.toggle)
      },

      changeRoot (newPitchClass) {
        this.pitchClass = newPitchClass
        const pc        = new PitchClass(newPitchClass)
        const scale     = new Scale(pc, majPenta)
        const notes     = scale.raw
        changePitchClasses(notes)
      },
    },
  }
</script>

<style scoped>
</style>
