<template >
<v-container>
  <nav>
    <v-toolbar v-bind:style="{ backgroundColor: '#1E88E5'}" flat>
      <v-toolbar-title class="text-uppercase white--text">
        <v-btn color="success" @click="AbrirOpciones" v-show="this.$session.get('user').userType == 'adm'">
        <span>Opciones</span>
      </v-btn>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="success" @click="cerrarSesion">
        <span>Cerrar Sesión</span>
        <v-icon right>exit_to_app</v-icon>
      </v-btn>
    </v-toolbar>
  </nav>
  <v-dialog v-model="opcionesDialog" persistent max-width="800">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>
          Opciones del Sistema
        </v-toolbar-title>
      </v-toolbar>
      <v-card class="py-5">
        <v-card-text>
          <v-row style="text-align:center;">
            <v-col sm="6">
              <v-btn color="success" @click="cerrarSesion">
                <span>Exportación de Resultados</span>
              </v-btn>
            </v-col>
            <v-col sm="6">
              <v-btn color="success" @click="cerrarSesion">
                <span>Limpiar Base de Datos</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
</v-container>
</template>

<script>
import axios from 'axios'
import { mapMutations } from 'vuex'
  export default {
    name: 'BarraNavegacion',
    data: () => ({
      opcionesDialog: false
    }),
    methods: {
      ...mapMutations(['ocultarMenu']),
      cerrarSesion(){
        sessionStorage.clear()
        this.$session.destroy()
        this.$router.push('/Login')
      },
      AbrirOpciones(){
        this.opcionesDialog = true
      }
    },
  }
</script>