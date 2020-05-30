<template>
    <v-snackbar
            v-if="snackbar"
            v-model="snackbar"
            :timeout="4000"
            top>
        {{ snackbar }}
    </v-snackbar>
</template>

<script>
    import { addSnackObserver } from '../utilities/snackbar'
    export default {
        name: 'SnackBar',
        created: function () {
            addSnackObserver(snack => {
                this.snackbar = snack
            })
        },
        data () {
            return {
                snackbar: undefined
            }
        },
    }
</script>

<style scoped>

</style>
