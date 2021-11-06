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
  <v-dialog v-model="opcionesDialog" max-width="800">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>
          Opciones del Sistema
        </v-toolbar-title>
      </v-toolbar>
      <v-card class="py-5">
        <v-card-text>
          <v-row style="text-align:center;">
            <v-col sm="6">
              <v-btn color="success" @click="exportData">
                <span>Exportación de Resultados</span>
              </v-btn>
            </v-col>
            <v-col sm="6">
              <v-btn color="success" @click="limpiarBase">
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
import axios from "axios";
import { mapMutations } from "vuex";
export default {
  name: "BarraNavegacion",
  data: () => ({
    opcionesDialog: false
  }),
  methods: {
    ...mapMutations(["showLoading", "hideLoading", "showNotification"]),
    cerrarSesion() {
      sessionStorage.clear();
      this.$session.destroy();
      this.$router.push("/Login");
    },
    AbrirOpciones() {
      this.opcionesDialog = true;
    },
    async limpiarBase() {
      this.showLoading({
        title: "Accediendo a la información",
        color: "secondary"
      });
      try {
        let response = await axios.post(`${this.$urlApi}Test/RestartDb`, {}, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("jwt")
          }
        });
        if (response.data > 0) {
          this.$swal(
            "Eliminado!",
            "Base de datos Eliminada con éxito",
            "success"
          );
        } else {
          this.$swal(
            "¡Error!",
            "La base de datos no ha sido borrada correctamente, comuniquese con soporte",
            "error"
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },
    async exportData() {
      this.showLoading({
        title: "Accediendo a la información",
        color: "secondary"
      });
      try {
        await axios({
          url: `${this.$urlApi}Test/ExportToExcel`,
          method: "GET",
          responseType: "blob",
          headers: {
            "Content-Type": "application/vnd.ms-excel",
            "Content-Disposition": "attachment;filename=report.xls",
            Authorization: "Bearer " + sessionStorage.getItem("jwt")
          }
        }).then(response => {
          console.log(response);
          var fileURL = window.URL.createObjectURL(new Blob([response.data]));
          var fileLink = document.createElement("a");

          fileLink.href = fileURL;
          fileLink.setAttribute("download", "file.xlsx");
          document.body.appendChild(fileLink);

          fileLink.click();
        });
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    }
  }
};
</script>