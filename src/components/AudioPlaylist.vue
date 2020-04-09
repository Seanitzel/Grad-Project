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
                                <v-list-item-content>
                                    <v-btn depressed :color=" currentAudio === i ? 'blue lighten-3': 'blue lighten-5'">
                                        <v-list-item-title
                                                @click="currentAudio = currentAudio === i ? undefined: i"
                                                class="text-left ml-5 title font-weight-light">
                                            {{ stem.name.split('.')[0].toUpperCase() }}
                                        </v-list-item-title>
                                    </v-btn>
                                    <v-divider></v-divider>
                                    <v-scroll-y-reverse-transition>
                                        <v-row justify="center" align-content="center" v-if="currentAudio === i"  v-show="currentAudio === i">
                                            <v-col cols="12">
                                                <audio-player :file="stem.filePath"></audio-player>
                                            </v-col>
                                        </v-row>
                                    </v-scroll-y-reverse-transition>
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
    export default {
        name: 'AudioPlaylist',
        components: { AudioPlayer },
        data () {
            return {
                currentAudio: undefined
            }
        },
        props: {
            playlist: Array,
            header: String
        },
    }
</script>

<style scoped>

</style>
