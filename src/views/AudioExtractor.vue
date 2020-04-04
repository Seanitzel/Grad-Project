<template>
    <v-container class="text-center">
        <v-row justify="center" align-content="center">
            <v-col cols="12">
                <v-stepper v-model="currentStep" vertical>
                    <v-stepper-step :complete="currentStep > 1" step="1">
                        Choose the audio file to extract from
                    </v-stepper-step>
                    <v-stepper-content step="1">
                        <v-file-input :rules="fileRules" accept="audio/*" show-size label="Audio file"
                                      @change="selectAudio"></v-file-input>
                        <v-btn :disabled="!selectedAudio" color="primary" @click="currentStep = 2">Continue</v-btn>
                    </v-stepper-content>
                    <v-stepper-step :complete="currentStep > 2" step="2">Choose stems count</v-stepper-step>
                    <v-stepper-content step="2">
                        <v-row justify="center" align-content="center">
                            <v-col cols="4" v-for="stemCard of stemCards" :key="stemCard.title">
                                <v-hover>
                                    <template v-slot="{ hover }">
                                        <v-card class="v-card--hover ma-2" :elevation="hover ? 12 : 6"
                                                :class="hover || selectedStems === stemCard.stemsNum ? 'active-card' : ''"
                                                @click="setStemsCount( stemCard.stemsNum )">
                                            <v-img
                                                    class="white--text align-end text-center"
                                                    :src="stemCard.img">
                                            </v-img>
                                            <v-card-title class="justify-center">{{stemCard.title}}</v-card-title>
                                            <v-card-text class="font-weight-bold">
                                                <div>Separate your audio composition to:</div>
                                                <div>{{stemCard.stems}}</div>
                                            </v-card-text>
                                        </v-card>
                                    </template>
                                </v-hover>
                            </v-col>
                        </v-row>
                        <v-row justify="center" align-content="center">
                            <v-btn class="mx-2" :disabled="!selectedStems" color="primary" @click="currentStep = 3">Continue</v-btn>
                            <v-btn class="mx-2" color="error" @click="backStep">Back</v-btn>
                        </v-row>
                    </v-stepper-content>
                    <v-stepper-step :complete="currentStep > 3" step="3">
                    <v-stepper-content step="3">
                        <v-card outlined class="mb-5" v-if="currentStep === 3">
                            <v-list-item two-line>
                                <v-list-item-content>
                                    <v-list-item-title>Audio name:</v-list-item-title>
                                    <v-list-item-subtitle>{{ selectedAudio.name }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item two-line>
                                <v-list-item-content>
                                    <v-list-item-title>Audio size:</v-list-item-title>
                                    <v-list-item-subtitle>{{ (selectedAudio.size / 1023683).toFixed(2) + ' mb'}}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>

                            <v-list-item two-line>
                                <v-list-item-content>
                                    <v-list-item-title>Stems count:</v-list-item-title>
                                    <v-list-item-subtitle>{{ selectedStems }}</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-card>
                        <v-row justify="center" align-content="center">
                            <v-btn :disabled="loader" class="mx-2" color="primary" @click="separate">Separate</v-btn>
                            <v-btn class="mx-2" color="error" @click="backStep">Back</v-btn>
                        </v-row>
                        <v-row justify="center" align-content="center" v-if="loader">
                            <v-progress-circular
                                    class="my-3"
                                    indeterminate
                                    color="primary">
                            </v-progress-circular>
                        </v-row>
                    </v-stepper-content>
                    </v-stepper-step>
                </v-stepper>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import separtor from '../utilities/separator-client'
    export default {
        name: 'AudioExtractor',
        data () {
            return {
                selectedAudio: undefined,
                currentStep: 1,
                selectedStems: undefined,
                loader: false,
                stemCards: [
                    {
                        title: '2 Stems',
                        stemsNum: 2,
                        stems: 'Vocal and Accompaniment',
                        img: require('../assets/stem cards/2stems.png')
                    },
                    {
                        title: '4 Stems',
                        stemsNum: 4,
                        stems: 'Vocals, Drums, Bass and other',
                        img: require('../assets/stem cards/4stems.png')
                    },
                    {
                        title: '5 Stems',
                        stemsNum: 5,
                        stems: 'Vocals, Drums, Bass, Piano and other',
                        img: require('../assets/stem cards/5stems.png')
                    }
                ]
            }
        },
        computed: {
            fileRules () {
                return [
                    file => !file || (file.type.split('/'))[0] === 'audio' || 'Wrong file format'
                ]
            },
        },
        methods: {
            selectAudio (file) {
                if ((file.type.split('/'))[0] === 'audio') {
                    this.selectedAudio = file
                }
            },
            separate () {
                this.loader = true
                separtor.upload(this.selectedAudio, this.selectedStems).then(response => {
                    // TODO: refactor the response saving method
                    this.loader = false
                    const url = window.URL.createObjectURL(new Blob([response.data]))
                    const link = document.createElement('a')
                    link.href = url
                    link.setAttribute('download', 'file.zip') // or any other extension
                    document.body.appendChild(link)
                    link.click()
                }).catch(err => console.log(err.response))
            },
            backStep () {
                this.currentStep--
            },
            setStemsCount (stems) {
                this.selectedStems = this.selectedStems === stems ? undefined : stems
            }
        }
    }
</script>

<style scoped>
    .v-card--hover {
        transition-property: transform;
        transition-duration: 0.3s;
    }
    .active-card {
        transform: scale(1.03);
        background: rgba(176,190,197, 0.3);
        border: 2px solid rgb(176,190,197);
    }
</style>
