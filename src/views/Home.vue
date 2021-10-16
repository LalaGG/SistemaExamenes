<template>
  <v-container fluid class="container-personalizado" v-if="true">
    <v-row>
      <v-col sm12>
        <v-stepper v-model="e1" non-linear>
          <v-stepper-header>
            <v-stepper-step editable step="1">
              Módulo de Exámen
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step editable step="2">
              Secciones por Módulo
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step editable step="3">
              Preguntas y Respuestas
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card class="mb-12">
                <v-toolbar flat color="white">
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Buscar"
                    single-line
                    hide-details
                  ></v-text-field>
                  <v-spacer></v-spacer>
                  <v-btn dark color="primary" @click="abrirDialogModulo"
                    >Nuevo Módulo</v-btn
                  >
                </v-toolbar>
                <v-data-table
                  :headers="headersModulos"
                  :items="listaDeModulos"
                  :search="search"
                  class="elevation-1"
                >
                  <template v-slot:items="props">
                    <tr>
                      <td>{{ props.item.name }}</td>
                    </tr>
                  </template>
                  <template v-slot:item.opciones="{ item }">
                    <v-icon medium class="mr-2" @click="editarModulo(item)">
                      mdi-pencil
                    </v-icon>
                    <v-icon medium @click="eliminarModulo(item)">
                      mdi-delete
                    </v-icon>
                  </template>
                </v-data-table>
              </v-card>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-card class="mb-12">
                <v-toolbar flat color="white">
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Buscar"
                    single-line
                    hide-details
                  ></v-text-field>
                  <v-spacer></v-spacer>
                  <v-btn dark color="primary" @click="abrirDialogSeccion"
                    >Nueva Sección</v-btn
                  >
                </v-toolbar>
                <v-data-table
                  :headers="headers"
                  :items="listaDePreguntas"
                  :search="search"
                  class="elevation-1"
                >
                  <!-- <template v-slot:items="props">
        <tr>
          <td></td>
          <td></td>
        </tr>
      </template> -->
                </v-data-table>
              </v-card>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card class="mb-12">
                <v-toolbar flat color="white">
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Buscar"
                    single-line
                    hide-details
                  ></v-text-field>
                  <v-spacer></v-spacer>
                  <v-btn dark color="primary" @click="abrirDialogPregunta"
                    >Nueva Pregunta</v-btn
                  >
                </v-toolbar>
                <v-data-table
                  :headers="headers"
                  :items="listaDePreguntas"
                  :search="search"
                  class="elevation-1"
                >
                  <!-- <template v-slot:items="props">
        <tr>
          <td></td>
          <td></td>
        </tr>
      </template> -->
                </v-data-table>
              </v-card>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogModulo" max-width="1200px">
      <v-card>
        <v-toolbar>
          <v-toolbar-title>Mantenimiento de Módulos</v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-row>
            <v-col class="pt-5" sm="6">
              <v-text-field
                v-model="itemModelModulo.name"
                type="text"
                label="Nombre del Módulo"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col sm="12">
              <v-switch
                v-model="itemModelModulo.active"
                label="Activo"
                color="primary"
              >
              </v-switch>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="primary" @click="CerrarModulo">Cancelar</v-btn>
          <v-btn dark color="primary" @click="GuardarModulo">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogSeccion" max-width="1200px">
      <v-card>
        <v-toolbar>
          <v-toolbar-title>Mantenimiento de Secciones</v-toolbar-title>
        </v-toolbar>
        <v-card-text> </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="primary" @click="CerrarSeccion">Cancelar</v-btn>
          <v-btn dark color="primary" @click="GuardarSeccion">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogPregunta" max-width="1200px">
      <v-card>
        <v-toolbar>
          <v-toolbar-title>Mantenimiento de Preguntas</v-toolbar-title>
        </v-toolbar>
        <v-card-text> </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn dark color="primary" @click="CerrarPregunta">Cancelar</v-btn>
          <v-btn dark color="primary" @click="GuardarPregunta">Guardar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>

  <v-container v-else> </v-container>
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex";

export default {
  name: "Home",
  data: () => ({
    usuario: "",
    e1: 1,
    dialogModulo: false,
    dialogSeccion: false,
    dialogPregunta: false,
    search: "",
    headersModulos: [
      {
        text: "Nombre",
        align: "left",
        sortable: false,
        value: "name"
      },
      { text: "Opciones", align: "right", sortable: false, value: "opciones" }
    ],
    headers: [
      {
        text: "Historia Clinica",
        align: "left",
        sortable: false,
        value: "NroHistoriaClinica"
      },
      { text: "Paciente", align: "left", value: "Paciente" }
    ],
    listaDePreguntas: [],
    listaDeModulos: [],
    itemModelModulo: {
      id: "",
      name: "",
      active: false
    },
    editModulo: false,
    itemModelSeccion: {
      id: "",
      name: "",
      active: false
    },
    editSeccion: false,
    itemModelPregunta: {
      id: "",
      name: "",
      active: false
    },
    editPregunta: false
  }),
  created() {
    if (this.$session.exists()) {
      this.usuario = this.$session.get("user");
      this.showNotification({
        message: this.usuario.message,
        color: "success",
        icon: "check-circle"
      });
    } else {
      this.dialog = false;
    }
    this.ListarModulo();
  },
  methods: {
    ...mapMutations(["showLoading", "hideLoading", "showNotification"]),
    abrirDialogModulo() {
      this.dialogModulo = true;
    },
    async ListarModulo() {
      this.showLoading({
        title: "Accediendo a la información",
        color: "secondary"
      });
      try {
        let response = await axios.get(`${this.$urlApi}TestModule`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("jwt")
          }
        });
        this.listaDeModulos = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },
    editarModulo(item) {
      this.editModulo = true;
      if (this.editModulo) {
        this.itemModelModulo.id = item.id;
        this.itemModelModulo.name = item.name;
        this.itemModelModulo.active = item.active;
        this.dialogModulo = true;
      }
    },
    async eliminarModulo(item) {
      this.showLoading({
        title: "Accediendo a la información",
        color: "secondary"
      });
      try {
        let response = await axios.delete(
          `${this.$urlApi}TestModule/${this.itemModelModulo.id}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("jwt")
            }
          }
        );
        if (response.data > 0) {
          this.$swal(
            "Eliminado!",
            "El módulo ha sido eliminado con éxito",
            "success"
          );
        } else {
          this.$swal(
            "¡Error!",
            "El módulo no ha sido eliminado correctamente, comuniquese con soporte",
            "error"
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },
    abrirDialogSeccion() {
      this.dialogSeccion = true;
    },
    editarSeccion() {
      this.editSeccion = true;
      if (this.editSeccion) {
        this.itemModelModulo.id = item.id;
        this.itemModelModulo.name = item.name;
        this.itemModelModulo.active = item.active;
        this.dialogSeccion = true;
      }
    },
    abrirDialogPregunta() {
      this.dialogPregunta = true;
    },
    editarPregunta() {
      this.editPregunta = true;
      if (this.editPregunta) {
        this.itemModelModulo.id = item.id;
        this.itemModelModulo.name = item.name;
        this.itemModelModulo.active = item.active;
        this.dialogPregunta = true;
      }
    },
    async GuardarModulo() {
      var response = ''
      this.showLoading({
        title: "Accediendo a la información",
        color: "secondary"
      });
      try {
        if( this.editModulo ){
          response = await axios.put(
          `${this.$urlApi}TestModule`,
          this.itemModelModulo,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("jwt")
            }
          });
        } else {
          response = await axios.post(
          `${this.$urlApi}TestModule`,
          this.itemModelModulo,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("jwt")
            }
          });
        }
        if (response.data > 0) {
          this.$swal(
            "Guardado!",
            "El módulo ha sido guardado con éxito",
            "success"
          );
          this.ListarModulo()
          this.CerrarModulo()
        } else {
          this.$swal(
            "¡Error!",
            "El módulo no ha sido guardado correctamente, comuniquese con soporte",
            "error"
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },
    async GuardarSeccion() {
      var act = this.editSeccion ? "axios.put" : "axios.post";
      this.showLoading({
        title: "Accediendo a la información",
        color: "secondary"
      });
      try {
        let response = await act(
          `${this.$urlApi}TestPart`,
          this.itemModelSeccion,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("jwt")
            }
          }
        );
        if (response.data > 0) {
          this.$swal(
            "Guardado!",
            "La sección ha sido guardada con éxito",
            "success"
          );
        } else {
          this.$swal(
            "¡Error!",
            "La sección no ha sido guardada correctamente, comuniquese con soporte",
            "error"
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },
    async GuardarPregunta() {
      var act = this.editPregunta ? "axios.put" : "axios.post";
      this.showLoading({
        title: "Accediendo a la información",
        color: "secondary"
      });
      try {
        let response = await act(
          `${this.$urlApi}Question`,
          this.itemModelPregunta,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("jwt")
            }
          }
        );
        if (response.data > 0) {
          this.$swal(
            "Guardado!",
            "La pregunta ha sido guardada con éxito",
            "success"
          );
        } else {
          this.$swal(
            "¡Error!",
            "La pregunta no ha sido guardada correctamente, comuniquese con soporte",
            "error"
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },
    CerrarModulo() {
      this.dialogModulo = false;
      this.editModulo = false;
    },
    CerrarSeccion() {
      this.dialogSeccion = false;
      this.editSeccion = false;
    },
    CerrarPregunta() {
      this.dialogPregunta = false;
      this.editPregunta = false;
    }
  }
};
</script>

<style scoped>
.container-personalizado {
  background: white;
  background-size: 100%;
  background-size: cover;
  height: 100vh;
}
</style>
