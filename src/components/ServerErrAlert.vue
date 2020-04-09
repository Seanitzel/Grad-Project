<template>
    <v-row justify="center">
        <v-dialog
                v-model="showAlert"
                max-width="290">
            <v-card>
                <v-card-title class="headline red lighten-2">
                    <span class="white--text">Server Error</span>
                </v-card-title>
                <v-card-text class="pa-2">
                    Some internal server error accrued
                </v-card-text>
                <v-card-text class="pa-2">
                    Please try again in a moment
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                            color="green darken-1"
                            text
                            @click="emitCloseAlert()">
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-row>
</template>

<script>
    export default {
        name: 'ServerErrAlert',
        props: {
            showAlert: Boolean,
            errorDescription: String // For later use
        },
        methods: {
            emitCloseAlert () {
                this.$emit('alertclose')
            }
        }
    }
</script>

<style scoped>

</style>
