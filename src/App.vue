<template>
  <v-app>
    <v-main>
      <!-- NOTIFICACION -->
      <Notification />

      <!-- LOADING -->
      <Loading />

      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

import Loading from '@/components/Commons/Loading'
import Notification from '@/components/Commons/Notification'
import {mapMutations} from 'vuex'

export default {
  name: 'App',

  data: () => ({
    //
  }),
   components: {
    Loading,
    Notification
  },
  beforeCreate() {
    if (!sessionStorage.getItem('jwt')) {
      this.$router.push('/Login')
    }
  },
  methods:{
    ...mapMutations(['showNotification']),
  },
};
</script>
