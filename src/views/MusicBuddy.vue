<template>
  <v-container>
    <v-layout text-xs-center wrap>
      <v-flex xs12>“if this is how the music begins, where might it go from here?”</v-flex>
      <v-flex xs12>
        <v-btn @click="playMidi">play</v-btn>
      </v-flex>
      <v-flex xs12 style="overflow-x: auto">
        <canvas ref="canvas"></canvas>
      </v-flex>
      <v-flex xs12>
        <v-btn @click="playVAE">play VAE</v-btn>
        <v-btn @click="playRNN">play RNN</v-btn>
      </v-flex>
      <v-slider v-model="qpm" @change="player.setTempo(qpm)" :max="300" :min="60"></v-slider>
      <!-- <v-flex xs12 v-if="recReady">
        <v-btn @click="recorder.start()">record</v-btn>
        <v-btn @click="seq = recorder.stop()">stop</v-btn>
      </v-flex>-->
      <v-flex xs12>{{seq}}</v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import * as mm from '@magenta/music'

  export default {
    name: 'MusicBuddy',
    data () {
      const sequence = {
        notes:               [
          { pitch: 30, quantizedStartStep: 0, quantizedEndStep: 2, program: 0 },
          { pitch: 66, quantizedStartStep: 0, quantizedEndStep: 1, program: 0 },
          { pitch: 71, quantizedStartStep: 2, quantizedEndStep: 4, program: 0 },
          { pitch: 73, quantizedStartStep: 4, quantizedEndStep: 6, program: 0 },
          { pitch: 74, quantizedStartStep: 6, quantizedEndStep: 8, program: 0 },
          { pitch: 76, quantizedStartStep: 8, quantizedEndStep: 10, program: 0 },
          { pitch: 81, quantizedStartStep: 12, quantizedEndStep: 16, program: 0 },
          { pitch: 78, quantizedStartStep: 16, quantizedEndStep: 20, program: 0 },
          { pitch: 81, quantizedStartStep: 20, quantizedEndStep: 24, program: 0 },
          { pitch: 76, quantizedStartStep: 24, quantizedEndStep: 32, program: 0 },
        ],
        quantizationInfo:    { stepsPerQuarter: 4 },
        totalQuantizedSteps: 32,
      }

      const rnnSteps       = 50
      const rnnTemperature = 1
      const vaeTemperature = 1

      return {
        sample:      sequence,
        rnnSteps,
        rnnTemperature,
        vaeTemperature,
        qpm:         120,
        recorder:    new mm.Recorder(),
        seq:         null,
        recReady:    false,
        transcriber: null,
        visualizer:  null,
      }
    },

    mounted () {
      this.canvas = this.$refs.canvas
      this.init()
      this.recorder.initialize().then(() => (this.recReady = true))
    },

    methods: {
      async init () {
        const callbackObject  = {
          run:  note => {
            console.log(this.visualizer.config)
            // console.log(note)
            this.visualizer.redraw(note)
          },
          stop: () => {
            console.log('done')
          },
        }
        const soundfontSource =
                'https://storage.googleapis.com/magentadata/js/soundfonts/sgm_plus'
        // const soundfon
        this.player           = await new mm.SoundFontPlayer(
          soundfontSource,
          undefined,
          undefined,
          undefined,
          callbackObject,
        )
        // this.player = new mm.Player(false, callbackObject)
        await this.setupMusicRNN()
        await this.setupMusicVAE()
        // await this.setupTranscriber()
      },

      async initSeq (seq) {
        const config = {
          noteHeight:        5,
          pixelsPerTimeStep: 10, // like a note width
          noteSpacing:       1,
          noteRGB:           '8, 41, 64',
          activeNoteRGB:     '340, 84, 119',
        }

        this.visualizer = new mm.PianoRollCanvasVisualizer(
          seq,
          this.canvas,
          config,
        )

        // A plain NoteSequence player
        await this.player.loadSamples(seq)
      },

      async setupTranscriber () {
        this.transcriber = await new mm.OnsetsAndFrames(
          'https://storage.googleapis.com/magentadata/js/checkpoints/transcription/onsets_frames_uni',
        )

        this.transcriber.initialize().then(() => {
          console.log('transcriber ready')
        })
      },

      async setupMusicRNN () {
        try {
          // Initialize model
          this.musicRNN = await new mm.MusicRNN(
            'https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/basic_rnn',
          )
          this.musicRNN.initialize()
        } catch (e) {
          console.log(e)
        }
      },

      async setupMusicVAE () {
        // Initialize model.
        try {
          this.musicVAE = await new mm.MusicVAE(
            'https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_16bar_small_q2',
          )
          this.musicVAE.initialize()
        } catch (e) {
          console.log(e)
        }
      },

      playRNN () {
        if (this.player.isPlaying()) {
          return this.player.stop()
        }

        const qns = mm.sequences.quantizeNoteSequence(this.sample, 4)

        qns.notes = qns.notes.filter(note => note.pitch > 50 && note.pitch < 84)

        this.musicRNN
            .continueSequence(qns, this.rnnSteps, this.rnnTemperature)
            .then(async sample => {
              await this.initSeq(sample)
              this.player.start(sample)
            })
      },

      playVAE () {
        if (this.player.isPlaying()) {
          return this.player.stop()
        }
        this.musicVae.sample(1, this.vaeTemperature).then(async sample => {
          await this.initSeq(sample[0])
          console.log('omg')
          this.player.start(sample[0])
        })
      },

      async playMidi () {
        if (this.player.isPlaying()) {
          return this.player.stop()
        }
        this.sample = await mm.urlToNoteSequence('/demo.mid')
        await this.initSeq(this.sample)
        this.player.start(this.sample)
      },

      startOrStop (event, p) {
        if (this.player.isPlaying()) {
          this.player.stop()
          return
        }
        this.initSeq(this.sample)
        this.player.start(this.sample)
      },

      recordTranscribe () {
        this.transcriber.transcribeFromAudioFile(blob).then(ns => {
          PLAYERS.soundfont.loadSamples(ns).then(() => {
            visualizer = new mm.Visualizer(ns, canvas, {
              noteRGB:           '255, 255, 255',
              activeNoteRGB:     '232, 69, 164',
              pixelsPerTimeStep: window.innerWidth < 500 ? null : 80,
            })
            resetUIState()
            showVisualizer()
          })
        })
      },

      playInterpolation () {
        if (this.player.isPlaying()) {
          this.player.stop()
          return
        }
        // Music VAE requires quantized melodies, so quantize them first.
        const star = mm.sequences.quantizeNoteSequence(this.sample, 4)
        this.musicVae
            .interpolate(star, 2)
            .then(sample => this.player.start(sample))
      },
    },
  }
</script>

<style>
</style>
