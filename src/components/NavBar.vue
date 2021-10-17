<template >
  <nav>
    <v-toolbar v-bind:style="{ backgroundColor: '#1E88E5'}" flat>
      <v-toolbar-title class="text-uppercase white--text">
        <span class="font-weigth-light">GRADE</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="success" @click="cerrarSesion">
        <span>Cerrar Sesión</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>
  </nav>
</template>

<script>
import axios from 'axios'
import { mapMutations } from 'vuex'
  export default {
    name: 'BarraNavegacion',
    data: () => ({
    }),
    methods: {
      ...mapMutations(['ocultarMenu']),
      cerrarSesion(){
        sessionStorage.clear()
        this.$session.destroy()
        this.$router.push('/Login')
      }
    },
  }
</script>