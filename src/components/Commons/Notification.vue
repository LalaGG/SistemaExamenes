<template>
    <div>
        <v-snackbar
            :color="notification.color"
            :bottom="false"
            :top="true"
            :left="false"
            :right="true"
            v-model="notification.snackbar"
            dark
            :timeout="notification.time"
        >
            <v-icon color="white" class="mr-3">{{ notification.icon }}</v-icon>
            {{ notification.message }}
            <template v-slot:action="{ attrs }">
                <v-btn
                color="white"
                text
                v-bind="attrs"
                @click="notification.snackbar = false"
                >
                <v-icon>mdi-close-circle</v-icon>
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'Notification',
    computed: {
        ...mapState(['notification'])
    },
}
</script>