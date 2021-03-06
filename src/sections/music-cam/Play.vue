<template>
  <v-row class="text-center">
    <v-col :cols="6">
      <v-btn dark :color="toggle ? 'error' : 'success'" @click="toggleGame">
        {{toggle ? 'STOP' : 'PLAY'}}
      </v-btn>
    </v-col>
    <v-col cols="6">
      <v-btn dark color="warning" @click="reset">
        Reset Note
      </v-btn>
    </v-col>
    <v-col cols="4">
      <v-menu v-model="instrumentMenu"
              offset-y bottom dark>
        <template #activator="{ on }">
          <span class="white--text title font-weight-bold">
            Instrument:
          </span>
          <v-btn dark v-on="on" class="text-capitalize font-weight-black">
            {{ selectedInstrument }}
            <v-icon small>arrow_drop_{{ instrumentMenu ? 'up' : 'down' }}</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="instrument in instruments" :key="instrument"
                       @click="setInstrument(instrument)">
            {{instrument}}
          </v-list-item>
        </v-list>
      </v-menu>
    </v-col>
    <v-col cols="4">
      <v-menu v-model="presetMenu"
              offset-y bottom dark>
        <template #activator="{ on }">
          <span class="white--text title font-weight-bold">
            Preset:
          </span>
          <v-btn dark v-on="on" class="text-capitalize font-weight-black">
            {{ selectedPreset.split('.')[0] }}
            <v-icon small>arrow_drop_{{ presetMenu ? 'up' : 'down' }}</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item v-for="preset in PresetList[selectedInstrument]" :key="preset"
                       @click="setPreset(preset)">
            {{preset.split('.')[0]}}
          </v-list-item>
        </v-list>
      </v-menu>
    </v-col>
    <v-col cols="4">
      <v-menu v-model="pitchClassMenu"
              :close-on-content-click="false"
              offset-y bottom dark>
        <template #activator="{ on }">
          <span class="white--text title font-weight-bold">
            Root Pitch Class:
          </span>
          <v-btn dark v-on="on" class="text-capitalize font-weight-black">
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
    <v-col :cols="12" v-show="allModelsReady">
      <div id="p5Canvas" ref="canvas"/>
    </v-col>
    <v-col cols="12" class="pt-12">
      <v-progress-circular v-if="!allModelsReady" size="200" width="35" indeterminate color="white"/>
    </v-col>
  </v-row>
</template>

<script>
  import * as p5                                                                                    from 'p5'
  import setup, { changePitchClasses, remove, resetNote, setState, updateInstrument, updatePreset } from
                                                                                                      './PlaySetup'
  import {
    Constants, PitchClass, Scale,
  }                                                                                                 from 'note-art'
  import { PresetList }                                                                             from '../../assets/PresetList'

  const majPenta = [2, 4, 7, 9]

  export default {
    name: 'Play',
    data() {
      return {
        toggle:             false,
        canvas:             null,
        pitchClass:         'C',
        pitchClassMenu:     false,
        instrumentMenu:     false,
        presetMenu:         false,
        instruments:        Object.keys(PresetList),
        PresetList,
        selectedInstrument: 'Synth',
        selectedPreset:     'Harmonics.json',
        allModelsReady:     false,
        pitchClasses:       Constants.pitchClasses,
      }
    },

    mounted() {
      setTimeout(() => {
        this.allModelsReady = true
      }, 10000)
      new p5(setup, this.$refs.canvas)
    },

    beforeDestroy() {
      remove()
    },

    methods: {
      toggleGame() {
        this.toggle = !this.toggle
        setState(this.toggle)
      },

      changeRoot(newPitchClass) {
        this.pitchClass = newPitchClass
        const pc        = new PitchClass(newPitchClass)
        const scale     = new Scale(pc, majPenta)
        const notes     = scale.raw
        changePitchClasses(notes)
      },

      setInstrument(instrument) {
        if (this.selectedInstrument !== instrument) {
          this.selectedInstrument = instrument
          updateInstrument(instrument, this.selectedPreset)
          this.setPreset(PresetList[instrument][0])
        }
      },

      setPreset(preset) {
        this.selectedPreset = preset
        updatePreset(preset)
      },

      reset() {
        resetNote()
      },
    },
  }
</script>

<style scoped>
</style>
