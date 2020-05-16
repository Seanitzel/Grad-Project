<template>
    <v-col cols="12" class="ma-0 pa-0">
        <vuetify-audio class="md-mx-5" :autoPlay="autoPlay" :file="file" color="blue-grey darken-1"></vuetify-audio>
    </v-col>
</template>

<script>
    export default {
        name: 'AudioPlayer',
        components: {
            VuetifyAudio: () => import('vuetify-audio'),
        },
        props: {
            file: String,
            autoPlay: Boolean
        }
    }
</script>

<style lang="scss" scoped>
    .v-card {
        box-shadow: none;
    }
</style>
