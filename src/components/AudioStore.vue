<template>
    <v-navigation-drawer
            v-model="drawState"
            :bottom="true"
            :mini-variant.sync="mini"
            expand-on-hover
            app
            width="300px"
            permanent>
        <v-list-item class="px-2">
            <v-list-item-avatar>
                <v-img :src="saveIcon"></v-img>
            </v-list-item-avatar>
            <v-list-item-title class="title">Audio Store</v-list-item-title>

            <v-btn
                    icon
                    @click.stop="mini = !mini">
                <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
        </v-list-item>

        <v-divider></v-divider>

        <v-list dense>
            <v-list-item
                    v-for="category in categories"
                    :key="category.title"
                    link>
                <v-list-item-icon>
                    <img :src="category.icon"/>
                </v-list-item-icon>
                <v-list-item-content>
                    <v-expansion-panels>
                        <v-expansion-panel>
                        <v-expansion-panel-header>{{ category.title }}</v-expansion-panel-header>
                        <v-expansion-panel-content>
                            <v-list>
                                <v-list-item-group color="primary">
                                    <v-list-item
                                            v-for="(audioFile, i) in category.audioList"
                                            :key="i">
                                        <v-list-item-content>
                                            <div @click="setCurrentAudio(audioFile)" v-text="audioFile.name"></div>
                                        </v-list-item-content>
                                    </v-list-item>
                                </v-list-item-group>
                            </v-list>
                        </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </v-list-item-content>
            </v-list-item>
        </v-list>
        <div class="player-wrapper" v-if="currentAudio" :style="{visibility: mini ? 'hidden': 'visible'}">
            <v-list-item-title>{{ currentAudio.name }}</v-list-item-title>
            <audio-player :auto-play="true" :file="currentAudio.filePath"></audio-player>
        </div>
    </v-navigation-drawer>
</template>

<script>
    import { storeGetData } from '../utilities/audio-store'
    import AudioPlayer from '../components/AudioPlayer'
    export default {
        name: 'AudioStore',
        components: { AudioPlayer },
        data () {
            return {
                saveIcon: require('../assets/audio store/logo.svg'),
                drawState: true,
                categories: storeGetData(),
                mini: true,
                currentAudio: null
            }
        },
        methods: {
            setCurrentAudio (audio) {
                this.currentAudio = audio
            }
        }
    }
</script>

<style lang="scss" scoped>
    .player-wrapper {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        text-align: center;
    }
</style>
