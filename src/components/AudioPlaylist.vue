<template>
    <v-container>
        <v-row justify="center" align-content="center">
            <v-col cols="12">
                <v-card
                        class="mx-auto"
                        tile>
                    <v-list rounded flat>
                        <v-subheader class="text-center title font-weight-bold">{{ header }}</v-subheader>
                        <v-list-item-group color="primary">
                            <v-list-item :ripple="false"
                                    v-for="(stem, i) in playlist"
                                    :key="i">
                                <v-list-item-content class="ma-0 pa-0">
                                    <v-row justify="center" align-content="center">
                                        <v-col cols="md-4 sm-12" class="align-self-center text-left">
                                            <v-list-item-title
                                                    @click="currentAudio = currentAudio === i ? undefined: i"
                                                    class="text-left ml-5 title font-weight-light">
                                                {{ stem.name.split('.')[0].toUpperCase() }}
                                            </v-list-item-title>
                                            <v-btn v-if="category !== undefined"
                                                   @click="saveAudio(stem)"
                                                   min-height="50"
                                                   class="ml-4 mt-2 pa-2">
                                                <v-tooltip bottom>
                                                    <template v-slot:activator="{ on }">
                                                        <img v-on="on" :src="saveIcon"/>
                                                    </template>
                                                    <span>Save To Store</span>
                                                </v-tooltip>
                                            </v-btn>
                                        </v-col>
                                        <v-col cols="md-8 sm-12" class="ma-0 pa-0">
                                            <audio-player :file="stem.filePath"></audio-player>
                                        </v-col>
                                    </v-row>
                                    <v-divider></v-divider>
                                </v-list-item-content>
                            </v-list-item>
                        </v-list-item-group>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import AudioPlayer from '../components/AudioPlayer'
    import { storeSaveAudio } from '../utilities/audio-store'
    import { setSnack } from '../utilities/snackbar'
    export default {
        name: 'AudioPlaylist',
        components: { AudioPlayer },
        data () {
            return {
                currentAudio: undefined,
                saveIcon: require('../assets/audio store/save.svg')
            }
        },
        props: {
            playlist: Array,
            header: String,
            category: String,
            originalName: String
        },
        methods: {
            saveAudio: function (audio) {
                storeSaveAudio(audio, this.category, this.originalName)
                setSnack('Saved to ' + this.category)
            }
        }
    }
</script>

<style scoped>

</style>
