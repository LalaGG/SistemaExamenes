<template>
  <v-container
    class="container-personalizado"
    v-if="this.$session.get('user').userType != 'adm'"
  >
    <BarraNavegacion />
    
  </v-container>

  <v-container fluid class="container-personalizado" v-else>
    <BarraNavegacion />
    <v-row>
      <v-col sm12>
        <v-stepper v-model="e1" non-linear>
          <v-stepper-header>
            <v-stepper-step @click="LimpiarIds()" editable step="1">
              Módulo de Exámen
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step @click="AsignarModulo({ id: 0 })" editable step="2">
              Secciones por Módulo
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step
              @click="AsignarSeccion({ id: 0 })"
              editable
              step="3"
            >
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
                  @click:row="AsignarModulo"
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
                    v-model="search1"
                    append-icon="search"
                    label="Buscar"
                    single-line
                    hide-details
                  ></v-text-field>
                  <v-spacer></v-spacer>
                  <v-btn
                    dark
                    color="primary"
                    @click="abrirDialogSeccion"
                    v-show="itemModelSeccion.idTestModule > 0"
                    >Nueva Sección</v-btn
                  >
                </v-toolbar>
                <v-data-table
                  :headers="headersSeccion"
                  :items="listaDeSecciones"
                  :search="search"
                  class="elevation-1"
                  @click:row="AsignarSeccion"
                >
                  <template v-slot:items="props">
                    <tr>
                      <td>{{ props.item.testModuleName }}</td>
                      <td>{{ props.item.name }}</td>
                      <td>{{ props.item.Instructions }}</td>
                    </tr>
                  </template>
                  <template v-slot:item.opciones="{ item }">
                    <v-icon medium class="mr-2" @click="editarSeccion(item)">
                      mdi-pencil
                    </v-icon>
                    <v-icon medium @click="eliminarSeccion(item)">
                      mdi-delete
                    </v-icon>
                  </template>
                </v-data-table>
              </v-card>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card class="mb-12">
                <v-toolbar flat color="white">
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search2"
                    append-icon="search"
                    label="Buscar"
                    single-line
                    hide-details
                  ></v-text-field>
                  <v-spacer></v-spacer>
                  <v-btn
                    dark
                    color="primary"
                    @click="abrirDialogPregunta"
                    v-show="itemModelPregunta.idTestPart > 0"
                    >Nueva Pregunta</v-btn
                  >
                </v-toolbar>
                <v-data-table
                  :headers="headersPreguntas"
                  :items="listaDePreguntas"
                  :search="search"
                  class="elevation-1"
                >
                  <template v-slot:items="props">
                    <tr>
                      <td>{{ props.item.testPartName }}</td>
                      <td>{{ props.item.type }}</td>
                      <td>{{ props.item.value }}</td>
                      <td>{{ props.item.image }}</td>
                      <td>{{ props.item.score }}</td>
                      <td>{{ props.item.timeLimit }}</td>
                    </tr>
                  </template>
                  <template v-slot:item.opciones="{ item }">
                    <v-icon medium class="mr-2" @click="editarPregunta(item)">
                      mdi-pencil
                    </v-icon>
                    <v-icon medium @click="eliminarPregunta(item)">
                      mdi-delete
                    </v-icon>
                  </template>
                </v-data-table>
              </v-card>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogModulo" max-width="1200px">
      <v-form v-model="valid" ref="form" lazy-validation>
        <v-card>
          <v-toolbar>
            <v-toolbar-title>Mantenimiento de Módulos</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-row class="pt-5" >
              <v-col sm="6">
                <v-text-field
                  v-model="itemModelModulo.name"
                  type="text"
                  label="Nombre del Módulo"
                  outlined
                  filled
                  :rules="ReglasGenerales"
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
      </v-form>
      
    </v-dialog>

    <v-dialog v-model="dialogSeccion" max-width="1200px">
      <v-form v-model="valid1" ref="form1" lazy-validation>
        <v-card>
          <v-toolbar>
            <v-toolbar-title>Mantenimiento de Secciones</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-row class="pt-5">
              <v-col  sm="6">
                <v-text-field
                  v-model="itemModelSeccion.name"
                  type="text"
                  label="Nombre de la Sección"
                  outlined
                  filled
                  :rules="ReglasGenerales"
                >
                </v-text-field>
              </v-col>
              <v-col sm="6">
                    <v-combobox
                      v-model="itemModelSeccion.type"
                      :items="listaDeTiposPregunta"
                      label="Tipo de Pregunta"
                      hint="Eliga el tipo de pregunta que desea crear"
                      item-value="id"
                      item-text="description"
                      clearable
                      filled
                      hide-selected
                      outlined
                      :rules="ReglasCombo"
                    ></v-combobox>
              </v-col>
              <v-col class="pt-5" sm="12">
                <v-textarea
                  v-model="itemModelSeccion.instructions"
                  type="text"
                  label="Instrucciones de la Sección"
                  outlined
                  filled
                  :rules="ReglasGenerales"
                >
                </v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col sm="12">
                <v-switch
                  v-model="itemModelSeccion.active"
                  label="Activo"
                  color="primary"
                >
                </v-switch>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark color="primary" @click="CerrarSeccion">Cancelar</v-btn>
            <v-btn dark color="primary" @click="GuardarSeccion">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
      
    </v-dialog>

    <v-dialog v-model="dialogPregunta" max-width="1200px">
      <v-form v-model="valid2" ref="form2" lazy-validation>
        <v-card>
          <v-toolbar>
            <v-toolbar-title>Mantenimiento de Preguntas</v-toolbar-title>
          </v-toolbar>
          <v-card-text class="pt-5">
            <v-row>
              <v-col sm="12">
                <v-textarea
                  v-model="itemModelPregunta.indications"
                  label="Indicaciones de la Pregunta"
                  filled
                  outlined
                  auto-grow
                  rows="4"
                  row-height="15"
                  hide-details
                ></v-textarea>
              </v-col>
              <v-col sm="12">
                <tiptap-vuetify
                  v-model="itemModelPregunta.text"
                  :extensions="extensions"
                />
              </v-col>
              <v-col class="mb-3" sm="12">
                <v-text-field
                  v-model="itemModelPregunta.value"
                  label="Pregunta"
                  filled
                  outlined
                  placeholder="Ej: ¿Que simbolo patrio observas en la imagen?"
                  hide-details
                ></v-text-field>
              </v-col>
              <v-col sm="6">
                <v-row>
                  <v-col sm="12">
                    <v-file-input
                      v-model="itemModelPregunta.image"
                      accept="image/*"
                      label="Imagen"
                      outlined
                      @change="previewImage"
                      hide-details
                    ></v-file-input>
                  </v-col>
                  <v-col sm="6">
                    <v-text-field
                      v-model="itemModelPregunta.score"
                      type="number"
                      :min="0"
                      label="Puntaje"
                      filled
                      outlined
                      hide-details
                      :rules="ReglasGenerales"
                    ></v-text-field>
                  </v-col>
                  <v-col sm="6">
                    <v-text-field
                      v-model="itemModelPregunta.timeLimit"
                      type="number"
                      :min="0"
                      label="Tiempo Límite en minutos"
                      filled
                      outlined
                      hide-details
                      :rules="ReglasGenerales"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-col>
              <v-col class="justify-center" sm="6">
                <v-img
                  class="align-self-center"
                  max-height="200"
                  max-width="300"
                  :src="itemModelPregunta.url"
                ></v-img>
              </v-col>
              <v-col sm="12">
                <v-toolbar flat color="white">
                  <v-toolbar-title>Lista de Respuestas</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-icon large color="blue" @click="AgregarLineaVacia"
                    >add</v-icon
                  >
                </v-toolbar>
                <v-data-table
                  :headers="headersRespuestas"
                  :items="listaDeRespuestas"
                  class="elevation-1"
                >
                  <template v-slot:item.text="props">
                    <v-edit-dialog
                      :return-value.sync="props.item.text"
                      @save="save"
                      @cancel="cancel"
                      @open="open"
                      @close="close"
                    >
                      {{ props.item.text }}
                      <template v-slot:input>
                        <v-text-field
                          v-model="props.item.text"
                          label="Texto de Respuesta"
                          single-line
                        ></v-text-field>
                      </template>
                    </v-edit-dialog>
                  </template>
                  <template v-slot:item.image="props">
                    <v-edit-dialog
                      large
                      persistent
                      cancel-text="Cancelar"
                      save-text="Guardar"
                      :return-value.sync="props.item.image"
                      @save="save"
                      @cancel="cancel"
                      @open="open"
                      @close="close"
                    >
                      <v-img
                        class="align-self-center"
                        max-height="90"
                        max-width="90"
                        :src="props.item.url"
                      >
                      </v-img>
                      <template v-slot:input>
                        <v-file-input
                          v-model="props.item.image"
                          accept="image/*"
                          label="Imagen"
                          @change="previewImageRespuesta(props.index)"
                        ></v-file-input>
                      </template>
                    </v-edit-dialog>
                  </template>
                  <template v-slot:item.isCorrect="props">
                    <v-simple-checkbox
                      v-model="props.item.isCorrect"
                      :ripple="false"
                    ></v-simple-checkbox>
                  </template>
                  <template v-slot:item.opciones="{ item, index }">
                    <v-icon medium @click="eliminarRespuesta(index)">
                      mdi-delete
                    </v-icon>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
            <v-row>
              <v-col sm="6">
                <v-switch
                  v-model="itemModelPregunta.active"
                  label="Activo"
                  color="primary"
                >
                </v-switch>
              </v-col> 
              <v-col sm="6">
                <v-switch
                  v-model="itemModelPregunta.isDemo"
                  label="¿Es pregunta demo?"
                  color="primary"
                >
                </v-switch>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn dark color="primary" @click="CerrarPregunta">Cancelar</v-btn>
            <v-btn dark color="primary" @click="GuardarPregunta">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
      
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex";
import BarraNavegacion from "../components/NavBar";
import {
  TiptapVuetify,
  Heading,
  Bold,
  Italic,
  Strike,
  Underline,
  Code,
  Paragraph,
  BulletList,
  OrderedList,
  ListItem,
  Link,
  Blockquote,
  HardBreak,
  HorizontalRule,
  History
} from "tiptap-vuetify";

export default {
  name: "Home",
  data: () => ({
    valid: true,
    valid1 : true,
    valid2: true,
    usuario: "",
    e1: 1,
    dialogModulo: false,
    dialogSeccion: false,
    dialogPregunta: false,
    resultadoDialog: false,
    search: "",
    search1: "",
    search2: "",
    ReglasGenerales: [
      v => !!v || 'Este campo es necesario',
    ],
    ReglasCombo: [
      v => v.id > 0 || 'Este campo es necesario',
    ],
    headersModulos: [
      {
        text: "Nombre",
        align: "left",
        sortable: false,
        value: "name"
      },
      { text: "Opciones", align: "right", sortable: false, value: "opciones" }
    ],
    headersSeccion: [
      {
        text: "Módulo",
        align: "left",
        sortable: false,
        value: "testModuleName"
      },
      {
        text: "Nombre",
        align: "left",
        sortable: false,
        value: "name"
      },
      {
        text: "Intrucciones",
        align: "left",
        sortable: false,
        value: "instructions"
      },
      {
        text: "Tipo Pregunta",
        align: "left",
        sortable: false,
        value: "type"
      },
      { text: "Opciones", align: "right", sortable: false, value: "opciones" }
    ],
    headersPreguntas: [
      {
        text: "Sección",
        align: "left",
        sortable: false,
        value: "testPartName"
      },
      {
        text: "Texto Pregunta",
        align: "left",
        sortable: false,
        value: "value"
      },
      {
        text: "Imagen",
        align: "left",
        sortable: false,
        value: "image"
      },
      {
        text: "Puntaje",
        align: "left",
        sortable: false,
        value: "score"
      },
      {
        text: "Tiempo Límite",
        align: "left",
        sortable: false,
        value: "timeLimit"
      },
      { text: "Opciones", align: "right", sortable: false, value: "opciones" }
    ],
    headersRespuestas: [
      {
        text: "Texto",
        align: "left",
        sortable: false,
        value: "text"
      },
      {
        text: "Imagen",
        align: "left",
        sortable: false,
        value: "image"
      },
      {
        text: "Es Correcta",
        align: "left",
        sortable: false,
        value: "isCorrect"
      },
      { text: "Opciones", align: "right", sortable: false, value: "opciones" }
    ],
    listaDeModulos: [],
    listaDeSecciones: [],
    listaDePreguntas: [],
    listaDeRespuestas: [],
    itemModelModulo: {
      id: "",
      name: "",
      active: true
    },
    editModulo: false,
    itemModelSeccion: {
      idTestModule: "",
      id: "",
      name: "",
      type: "",
      active: true,
      instructions: ""
    },
    editSeccion: false,
    itemModelPregunta: {
      idTestPart: "",
      id: 0,
      text: "",
      value: "",
      image: null,
      score: "",
      timeLimit: "",
      url: "",
      indications: "",
      answers: [],
      active : true,
      isDemo: false
    },
    editPregunta: false,
    listaDeTiposPregunta: [],
    listaDeRespuestasImagenes: [],
    itemModelNota: {
      totalScore: 0
    },
    urlImage: "http://evaluacionescrita.ino.gob.pe/img/",
    extensions: [
      History,
      Blockquote,
      Link,
      Underline,
      Strike,
      Italic,
      ListItem,
      BulletList,
      OrderedList,
      [
        Heading,
        {
          options: {
            levels: [1, 2, 3]
          }
        }
      ],
      Bold,
      Code,
      HorizontalRule,
      Paragraph,
      HardBreak
    ]
  }),
  components: {
    BarraNavegacion,
    TiptapVuetify
  },
  created() {
    if (this.$session.exists()) {
      this.usuario = this.$session.get("user");
      this.showNotification({
        message: this.usuario.message,
        color: "success",
        icon: "check-circle"
      });
    } 
    this.ListarModulo();
  },
  methods: {
    ...mapMutations(["showLoading", "hideLoading", "showNotification"]),
    async ListarTipoPregunta(idTestModule) {
      this.showLoading({
        title: "Accediendo a la información",
        color: "secondary"
      });
      try {
        let response = await axios.get(
          `${this.$urlApi}Question/GetQuestionTypes/${idTestModule}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("jwt")
            }
          }
        );
        this.listaDeTiposPregunta = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },
    async EnviarCorreo() {
      try {
        let itemCertificado = {
          idUser: this.$session.get("user").idUser
        };
        let response = await axios.post(
          `${
            this.$urlApiInvision
          }Evaluacion/EnviarCertificadoEvaluacionEscrita`,
          itemCertificado,
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        );
        this.respuestaBD = response.data;
        if (this.respuestaBD.id > 0) {
          this.$swal("¡Enviado!", this.respuestaBD.mensaje, "success");
          this.SalirDelSistema();
        } else {
          this.$swal("¡Error!", this.respuestaBD.mensaje, "warning");
        }
      } catch (error) {
        console.log(error);
      }
      this.timerInterval = setInterval(() => (this.timePassed += 1), 1000);
    },
    SalirDelSistema() {
      sessionStorage.clear();
      this.$session.destroy();
      this.$router.push("/Login");
    },
    IngresarAlExamen() {
      this.$router.push("/Examen/Principal");
    },
    LimpiarIds() {
      this.itemModelSeccion.idTestModule = 0;
      this.itemModelPregunta.idTestPart = 0;
    },
    AsignarModulo(item) {
      this.itemModelSeccion.idTestModule = item.id;
      this.editModulo ? (this.e1 = 1) : (this.e1 = 2);
      this.ListarSeccion(this.itemModelSeccion.idTestModule);
      this.ListarTipoPregunta(this.itemModelSeccion.idTestModule);
    },
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
      let alerta = await this.$swal({
        title: `Esta operación eliminará las secciones y preguntas afiliadas al módulo. ¿Desea continuar?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      });
      if (alerta.value) {
        this.showLoading({
          title: "Accediendo a la información",
          color: "secondary"
        });
        try {
          let response = await axios.delete(
            `${this.$urlApi}TestModule/${item.id}`,
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
            this.ListarModulo();
          } else if (response.data == -1) {
            this.$swal(
              "¡Error!",
              "El módulo no puede ser eliminado porque contiene una o mas preguntas asociadas a los resultados de la evaluación.",
              "success"
            );
          } else {
            this.$swal(
              "¡Error!",
              "El módulo no ha sido eliminado correctamente, comuniquese con soporte",
              "error"
            );
          }
          this.e1 = 1;
        } catch (error) {
          console.log(error);
        } finally {
          this.hideLoading();
        }
      }
    },
    AsignarSeccion(item) {
      this.itemModelPregunta.idTestPart = item.id;
      this.editSeccion ? (this.e1 = 2) : (this.e1 = 3);
      this.ListarPregunta(this.itemModelPregunta.idTestPart);
    },
    abrirDialogSeccion() {
      this.dialogSeccion = true;
    },
    async ListarSeccion(idTestModule) {
      this.showLoading({
        title: "Accediendo a la información",
        color: "secondary"
      });
      try {
        let response = await axios.get(
          `${this.$urlApi}TestPart/${idTestModule}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("jwt")
            }
          }
        );
        this.listaDeSecciones = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },
    editarSeccion(item) {
      this.editSeccion = true;
      if (this.editSeccion) {
        this.itemModelSeccion.id = item.id;
        this.itemModelSeccion.name = item.name;
        this.itemModelSeccion.active = item.active;
        this.itemModelSeccion.instructions = item.instructions;
        this.dialogSeccion = true;
      }
    },
    async eliminarSeccion(item) {
      let alerta = await this.$swal({
        title: `Esta operation eliminará las preguntas afiliadas a la sección. ¿Desea continuar?`,
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar"
      });
      if (alerta.value) {
        this.showLoading({
          title: "Accediendo a la información",
          color: "secondary"
        });
        try {
          let response = await axios.delete(
            `${this.$urlApi}TestPart/${item.id}`,
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
              "La Sección ha sido eliminada con éxito",
              "success"
            );
            this.ListarSeccion(this.itemModelSeccion.idTestModule);
          } else if (response.data == -1) {
            this.$swal(
              "¡Error!",
              "La sección no puede ser eliminada porque contiene una o mas preguntas asociadas a los resultados de la evaluación.",
              "success"
            );
          } else {
            this.$swal(
              "¡Error!",
              "La Sección no ha sido eliminada correctamente, comuniquese con soporte",
              "error"
            );
          }
          this.e1 = 2;
        } catch (error) {
          console.log(error);
        } finally {
          this.hideLoading();
        }
      }
    },
    abrirDialogPregunta() {
      this.dialogPregunta = true;
    },
    async ListarPregunta(idTestPart) {
      this.showLoading({
        title: "Accediendo a la información",
        color: "secondary"
      });
      try {
        let response = await axios.get(
          `${this.$urlApi}Question/${idTestPart}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("jwt")
            }
          }
        );
        this.listaDePreguntas = response.data;
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },
    editarPregunta(item) {
      this.editPregunta = true;
      if (this.editPregunta) {
        this.itemModelPregunta.id = item.id;
        this.itemModelPregunta.text = item.text;
        this.itemModelPregunta.type = item.type;
        this.itemModelPregunta.image = null;
        this.itemModelPregunta.url = this.urlImage+`${item.image}`;
        this.itemModelPregunta.score = item.score;
        this.itemModelPregunta.timeLimit = item.timeLimit;
        this.itemModelPregunta.indications = item.indications;
        this.itemModelPregunta.value = item.value;
        this.itemModelPregunta.active = item.active
        this.itemModelPregunta.isDemo = item.isDemo
        item.answers.forEach(element => {
          this.listaDeRespuestas.push({
            text: element.text,
            url: this.urlImage+`${element.image}`,
            image: "",
            isCorrect: element.isCorrect
          });
        });
        this.dialogPregunta = true;
      }
    },
    async eliminarPregunta(item) {
      this.showLoading({
        title: "Accediendo a la información",
        color: "secondary"
      });
      try {
        let response = await axios.delete(
          `${this.$urlApi}Question/${item.id}`,
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
            "La pregunta ha sido eliminado con éxito",
            "success"
          );
          this.ListarPregunta(this.itemModelPregunta.idTestPart);
        } else if (response.data == -1) {
          this.$swal(
            "¡Error!",
            "La pregunta no puede ser eliminada porque esta asociada a resultados de la evaluación.",
            "success"
          );
        } else {
          this.$swal(
            "¡Error!",
            "La pregunta no ha sido eliminado correctamente, comuniquese con soporte",
            "error"
          );
        }
        this.e1 = 3;
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },
    async GuardarModulo() {
      if(this.$refs.form.validate()){
        var response = "";
        this.showLoading({
          title: "Accediendo a la información",
          color: "secondary"
        });
        try {
          if (this.editModulo) {
            response = await axios.put(
              `${this.$urlApi}TestModule`,
              this.itemModelModulo,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + sessionStorage.getItem("jwt")
                }
              }
            );
          } else {
            response = await axios.post(
              `${this.$urlApi}TestModule`,
              this.itemModelModulo,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + sessionStorage.getItem("jwt")
                }
              }
            );
          }
          if (response.data > 0) {
            this.$swal(
              "Guardado!",
              "El módulo ha sido guardado con éxito",
              "success"
            );
            this.ListarModulo();
            this.CerrarModulo();
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
      }
      
    },
    async GuardarSeccion() {
      if(this.$refs.form1.validate()){
        var response = "";
        this.showLoading({
          title: "Accediendo a la información",
          color: "secondary"
        });
        try {
          if (this.editSeccion) {
            response = await axios.put(
              `${this.$urlApi}TestPart`,
              this.itemModelSeccion,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + sessionStorage.getItem("jwt")
                }
              }
            );
          } else {
            response = await axios.post(
              `${this.$urlApi}TestPart`,
              this.itemModelSeccion,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + sessionStorage.getItem("jwt")
                }
              }
            );
          }
          if (response.data > 0) {
            this.$swal(
              "Guardado!",
              "La sección ha sido guardada con éxito",
              "success"
            );
            this.ListarSeccion(this.itemModelSeccion.idTestModule);
            this.CerrarSeccion();
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
      }
      
    },
    async GuardarPregunta() {
      if(this.$refs.form2.validate()){
        var response = "";
        this.itemModelPregunta.answers = this.listaDeRespuestas;
        this.listaDeRespuestas.forEach(element => {
          element.isCorrect = element.isCorrect == "1" ? true : false;
        });
        const fd = new FormData();
        this.itemModelPregunta.image != null
          ? fd.append(
              "image",
              this.itemModelPregunta.image,
              this.itemModelPregunta.image.name
            )
          : fd.append("image", "");
        fd.append("id", this.itemModelPregunta.id);
        fd.append("idTestPart", this.itemModelPregunta.idTestPart);
        fd.append("text", this.itemModelPregunta.text);
        fd.append("score", this.itemModelPregunta.score);
        fd.append("timeLimit", this.itemModelPregunta.timeLimit);
        fd.append("indications", this.itemModelPregunta.indications);
        fd.append("value", this.itemModelPregunta.value);
        fd.append("active", this.itemModelPregunta.active);
        fd.append("isDemo", this.itemModelPregunta.isDemo);
        for (var i = 0; i < this.listaDeRespuestas.length; i++) {
          fd.append("answers[" + i + "].text", this.listaDeRespuestas[i].text);
          fd.append(
            "answers[" + i + "].isCorrect",
            this.listaDeRespuestas[i].isCorrect
          );
          this.listaDeRespuestas[i].image != null
            ? fd.append(
                "answers[" + i + "].image",
                this.listaDeRespuestas[i].image
              )
            : fd.append("answers[" + i + "].image", "");
        }
        this.showLoading({
          title: "Accediendo a la información",
          color: "secondary"
        });
        try {
          response = await axios.post(`${this.$urlApi}Question`, fd, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + sessionStorage.getItem("jwt")
            }
          });
          if (response.data > 0) {
            this.$swal(
              "Guardado!",
              "La pregunta ha sido guardada con éxito",
              "success"
            );
            this.ListarPregunta(this.itemModelPregunta.idTestPart);
            this.CerrarPregunta();
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
      }
    },
    CerrarModulo() {
      this.dialogModulo = false;
      this.editModulo = false;
      this.itemModelModulo.id = "";
      this.itemModelModulo.name = "";
      this.itemModelModulo.active = true;
      this.$refs.form.resetValidation()
    },
    CerrarSeccion() {
      this.dialogSeccion = false;
      this.editSeccion = false;
      this.itemModelSeccion.id = "";
      this.itemModelSeccion.name = "";
      this.itemModelSeccion.instructions = "";
      this.itemModelSeccion.type = "";
      this.itemModelSeccion.active = true;
      this.$refs.form1.resetValidation()
    },
    CerrarPregunta() {
      this.dialogPregunta = false;
      this.editPregunta = false;
      this.itemModelPregunta.id = 0;
      this.itemModelPregunta.type = "";
      this.itemModelPregunta.text = "";
      this.itemModelPregunta.image = null;
      this.itemModelPregunta.score = "";
      this.itemModelPregunta.timeLimit = "";
      this.itemModelPregunta.url = "";
      this.itemModelPregunta.answers = [];
      this.itemModelPregunta.indications = "";
      this.itemModelPregunta.value = "";
      this.itemModelPregunta.isDemo = false;
      this.listaDeRespuestas = [];
      this.$refs.form2.resetValidation()
    },
    AgregarLineaVacia() {
      this.listaDeRespuestas.push({
        text: "",
        image: null,
        isCorrect: false,
        url: ""
      });
    },
    save() {},
    cancel() {},
    open() {},
    close() {},
    eliminarRespuesta(index) {
      this.listaDeRespuestas.splice(index, 1);
    },
    previewImage() {
      this.itemModelPregunta.url = URL.createObjectURL(
        this.itemModelPregunta.image
      );
    },
    previewImageRespuesta(index) {
      this.listaDeRespuestas[index].url = URL.createObjectURL(
        this.listaDeRespuestas[index].image
      );
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
