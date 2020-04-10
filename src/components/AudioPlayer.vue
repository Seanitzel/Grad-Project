<template>
    <v-container>
        <v-col cols="12">
            <vuetify-audio class="md-mx-5" :file="file" color="blue-grey darken-1"></vuetify-audio>
        </v-col>
    </v-container>
</template>

<script>
    export default {
        name: 'AudioPlayer',
        components: {
            VuetifyAudio: () => import('vuetify-audio'),
        },
        props: {
            file: String,
        }
    }
</script>

<style scoped>

</style>
