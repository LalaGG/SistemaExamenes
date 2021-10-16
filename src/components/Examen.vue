<template>
  <v-container>
    <v-row no-gutters class="d-flex align-content-center flex-wrap">
      <v-col sm="12">
        <v-stepper v-model="e1">
          <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1">
              Primera Parte del Exámen
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 2" step="2">
              Segunda Parte del Exámen
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 3" step="3">
              Tercera Parte del Exámen
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="e1 > 4" step="4">
              Cuarta Parte del Exámen
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="5">
              Quinta Parte del Exámen
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card class="mb-12" >
                <h1>{{ listaDePreguntas[0].instrucciones }}</h1>
                <v-row>
                  <v-col sm="3" v-for="item in listaDePreguntas" :key="item.id">
                    <v-card-text v-if="item.seccion == 1">
                      <div
                        style="border: 2px solid black; padding: 15px; justify-content: center; display: flex;"
                      >
                        <v-img
                          :src="require('@/assets/png/' + `${item.imagen}`)"
                          width="50%"
                          aspect-ratio="1"
                        ></v-img>
                      </div>

                      <v-radio-group v-model="item.respuestaIngresada">
                        <v-radio
                          v-for="(n) in item.respuestas"
                          :key="n.id"
                          :label="n.descripcion"
                          :value="n.id"
                        ></v-radio>
                      </v-radio-group>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-card>

              <v-btn color="primary" @click="terminarPrueba">
                Terminar Primera Parte
              </v-btn>
            </v-stepper-content>

            <!-- <v-stepper-content step="2">
              <v-card class="mb-12">
                <h1>{{ listaDePreguntas[4].instrucciones }}</h1>
                <v-row>
                  <v-col sm="3" v-for="item in listaDePreguntas" :key="item.id">
                    <v-card-text v-if="item.seccion == 2">
                      <div
                        style="border: 2px solid black; padding: 15px; text-align: center;"
                      >
                        <h1>{{ item.pregunta }}</h1>
                      </div>
                      <v-combobox
                        v-model="itemModel.parte2"
                        :items="item.respuestas"
                        item-value="id"
                        item-text="id"
                        return-object
                        label="Seleccione la opción correcta"
                      >
                        >
                         <template slot="item" slot-scope="data">
                          <img
                            :src="
                              require('@/assets/png/' + `${data.item.imagen}`)
                            "
                            width="200px"
                          />
                          <span class="pl-2">{{ data.item.id }}</span>
                        </template> 
                      </v-combobox>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-card>

              <v-btn class="pr-5 mr-5" color="primary" @click="e1 = 1">
                Regresar Primera Parte
              </v-btn>
              <v-btn color="primary" @click="e1 = 3">
                Terminar Segunda Parte
              </v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card class="mb-12">
                <h1>{{ listaDePreguntas[6].instrucciones }}</h1>
                <v-row>
                  <v-col sm="3" v-for="item in listaDePreguntas" :key="item.id">
                    <v-card-text v-if="item.seccion == 3">
                      <div
                        style="border: 2px solid black; padding: 15px; text-align: center;"
                      >
                        <h1>{{ item.pregunta }}</h1>
                      </div>

                      <v-radio-group v-model="itemModel.parte3">
                        <v-radio
                          v-for="n in item.respuestas"
                          :key="n.id"
                          :label="n.descripcion"
                          :value="n.id"
                        ></v-radio>
                      </v-radio-group>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-card>

              <v-btn class="pr-5 mr-5" color="primary" @click="e1 = 2">
                Regresar Segunda Parte
              </v-btn>
              <v-btn color="primary" @click="e1 = 4">
                Terminar Tercera Parte
              </v-btn>
            </v-stepper-content>

            <v-stepper-content step="4">
              <v-card class="mb-12" >
                <h1>{{ listaDePreguntas[6].instrucciones }}</h1>
                <v-row>
                  <v-col sm="4" v-for="item in listaDePreguntas" :key="item.id">
                    <v-card-text v-if="item.seccion == 4">
                      <div
                        style="border: 2px solid black; padding: 15px; text-align: center;"
                      >
                        <h1>{{ item.indicaciones }}</h1>
                      </div>
                    <div
                        style="padding: 15px; text-align: center;"
                      >
                        <h3>{{ item.pregunta }}</h3>
                      </div>
                      <v-radio-group v-model="itemModel.parte4">
                        <v-radio
                          v-for="n in item.respuestas"
                          :key="n.id"
                          :label="n.descripcion"
                          :value="n.id"
                        ></v-radio>
                      </v-radio-group>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-card>

              <v-btn class="pr-5 mr-5" color="primary" @click="e1 = 3">
                Regresar Tercera Parte
              </v-btn>
              <v-btn color="primary" @click="e1 = 5">
                Terminar Cuarta Parte
              </v-btn>
            </v-stepper-content>

            <v-stepper-content step="5">
              <v-card class="mb-12">
                <h1>{{ listaDePreguntas[15].instrucciones }}</h1>
                <v-row>
                  <v-col sm="4" v-for="item in listaDePreguntas" :key="item.id">
                    <v-card-text v-if="item.seccion == 5">
                    <div
                        style="padding: 15px; text-align: center;"
                      >
                        <h1>{{ item.indicaciones }}</h1>
                    </div>
                      <div style="border: 2px solid black; padding: 15px; text-align: center;" v-for="img in item.imagen" :key="img.id">
                        <img :src=" require('@/assets/png/' + `${img.img}`)" width="200px"/>
                        <p>{{img.descripcion}}</p>
                      </div>
                    <div
                        style="padding: 15px; text-align: center;"
                      >
                        <h3>{{ item.pregunta }}</h3>
                      </div>
                      <v-radio-group v-model="itemModel.parte5">
                        <v-radio
                          v-for="n in item.respuestas"
                          :key="n.id"
                          :label="n.descripcion"
                          :value="n.id"
                        ></v-radio>
                      </v-radio-group>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-card>

              <v-btn class="pr-5 mr-5" color="primary" @click="e1 = 4">
                Regresar a la Cuarta Parte
              </v-btn>
              <v-btn color="primary" @click="terminarPrueba()">
                Terminar Quinta Parte
              </v-btn>
            </v-stepper-content> -->
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      itemModel: {
        pregunta1: [],
        pregunta2: [],
        pregunta3: [],
        pregunta4: [],
      },
      e1: 1,
      radioGroup: [],
      listaDeRespuestas : [],
      listaDePreguntas: [
        {
          id: 1,
          respuestaIngresada : "",
          seccion: 1,
          instrucciones:
            "Deberás observar la imagen y luego hacer un clic en el recuadro que se relacione con el dibujo.",
            indicaciones : "",
          pregunta: "",
          imagen: ["1-bandera.png"],
          respuestas: [
            {
              id: 1,
              opcion : "A",
              descripcion: "Madera",
              imagen: "",
              correcta: false,
            },
            {
              id: 2,
              opcion : "B",
              descripcion: "Perro",
              imagen: "",
              correcta: false,
            },
            {
              id: 3,
              opcion : "C",
              descripcion: "Bandera",
              imagen: "",
              correcta: true,
            },
            {
              id: 4,
              opcion : "D",
              descripcion: "Jarra",
              imagen: "",
              correcta: false,
            },
          ],
        },
        {
          id: 2,
          respuestaIngresada : "",
          seccion: 1,
          instrucciones:
            "Deberás observar la imagen y luego hacer un clic en el recuadro que se relacione con el dibujo.",
            indicaciones : "",
          pregunta: "",
          imagen: ["2-vasoroto.png"],
          respuestas: [
            {
              id: 5,
              opcion : "A",
              descripcion: "Madera",
              imagen: "",
              correcta: false,
            },
            {
              id: 6,
              opcion : "B",
              descripcion: "Perro",
              imagen: "",
              correcta: false,
            },
            {
              id: 7,
              opcion : "C",
              descripcion: "Bandera",
              imagen: "",
              correcta: true,
            },
            {
              id: 8,
              opcion : "D",
              descripcion: "Jarra",
              imagen: "",
              correcta: false,
            },
          ],
        },
        {
          id: 3,
          respuestaIngresada : "",
          seccion: 1,
          instrucciones:
            "Deberás observar la imagen y luego hacer un clic en el recuadro que se relacione con el dibujo.",
            indicaciones : "",
          pregunta: "",
          imagen: ["3-cuchara.png"],
          respuestas: [
            {
              id: 9,
              opcion : "A",
              descripcion: "Madera",
              imagen: "",
              correcta: false,
            },
            {
              id: 10,
              opcion : "B",
              descripcion: "Perro",
              imagen: "",
              correcta: false,
            },
            {
              id: 11,
              opcion : "C",
              descripcion: "Bandera",
              imagen: "",
              correcta: true,
            },
            {
              id: 12,
              opcion : "D",
              descripcion: "Jarra",
              imagen: "",
              correcta: false,
            },
          ],
        },
        {
          id: 4,
          respuestaIngresada : "",
          seccion: 1,
          instrucciones:
            "Deberás observar la imagen y luego hacer un clic en el recuadro que se relacione con el dibujo.",
            indicaciones : "Mateo patea la pelota.",
          pregunta: "",
          imagen: ["4-jarrallenadeagua.png"],
          respuestas: [
            {
              id: 13,
              opcion : "A",
              descripcion: "Madera",
              imagen: "",
              correcta: false,
            },
            {
              id: 14,
              opcion : "B",
              descripcion: "Perro",
              imagen: "",
              correcta: false,
            },
            {
              id: 15,
              opcion : "C",
              descripcion: "Bandera",
              imagen: "",
              correcta: true,
            },
            {
              id: 16,
              opcion : "D",
              descripcion: "Jarra",
              imagen: "",
              correcta: false,
            },
          ],
        },
        {
          id: 5,
          respuestaIngresada : "",
          seccion: 2,
          instrucciones:
            "Deberás leer la palabra u oración y luego hacer un clic en el recuadro en blanco.",
            indicaciones : "",
          pregunta: "Mari Corre",
          imagen: "",
          respuestas: [
            {
              id: "A",
              descripcion: "",
              imagen: "8.png",
              correcta: false,
            },
            {
              id: "B",
              descripcion: "",
              imagen: "9.png",
              correcta: false,
            },
            {
              id: "C",
              descripcion: "",
              imagen: "49-niñavideojugo.png",
              correcta: true,
            },
            {
              id: "D",
              descripcion: "",
              imagen: "10.png",
              correcta: false,
            },
          ],
        },
        {
          id: 6,
          respuestaIngresada : "",
          seccion: 2,
          instrucciones:
            "Deberás leer la palabra u oración y luego hacer un clic en el recuadro en blanco.",
            indicaciones : "",
          pregunta: "Ira",
          imagen: [],
          respuestas: [
            {
              id: "A",
              descripcion: "",
              imagen: "22-personallorando.png",
              correcta: false,
            },
            {
              id: "B",
              descripcion: "",
              imagen: "23-personaestresada.png",
              correcta: false,
            },
            {
              id: "C",
              descripcion: "",
              imagen: "21-personafuriosa.png",
              correcta: true,
            },
            {
              id: "D",
              descripcion: "",
              imagen: "24-personafeliz.png",
              correcta: false,
            },
          ],
        },
        {
          id: 7,
          respuestaIngresada : "",
          seccion: 2,
          instrucciones:
            "Deberás leer la palabra u oración y luego hacer un clic en el recuadro en blanco.",
            indicaciones : "",
          pregunta: "Mari Corre",
          imagen: [],
          respuestas: [
            {
              id: "A",
              descripcion: "",
              imagen: "8.png",
              correcta: false,
            },
            {
              id: "B",
              descripcion: "",
              imagen: "9.png",
              correcta: false,
            },
            {
              id: "C",
              descripcion: "",
              imagen: "49-niñavideojugo.png",
              correcta: true,
            },
            {
              id: "D",
              descripcion: "",
              imagen: "10.png",
              correcta: false,
            },
          ],
        },
        {
          id: 8,
          respuestaIngresada : "",
          seccion: 2,
          instrucciones:
            "Deberás leer la palabra u oración y luego hacer un clic en el recuadro en blanco.",
            indicaciones : "",
          pregunta: "Ira",
          imagen: [],
          respuestas: [
            {
              id: "A",
              descripcion: "",
              imagen: "22-personallorando.png",
              correcta: false,
            },
            {
              id: "B",
              descripcion: "",
              imagen: "23-personaestresada.png",
              correcta: false,
            },
            {
              id: "C",
              descripcion: "",
              imagen: "21-personafuriosa.png",
              correcta: true,
            },
            {
              id: "D",
              descripcion: "",
              imagen: "24-personafeliz.png",
              correcta: false,
            },
          ],
        },
        {
          id: 9,
          respuestaIngresada : "",
          seccion: 3,
          instrucciones:
            "Deberás seleccionar la palabra que complete el sentido de la oración.",
        indicaciones : "Mateo patea la pelota.",
          pregunta: "La ___ tiene cuatro patas.",
          imagen: [],
          respuestas: [
            {
              id: "A",
              descripcion: "Gallina",
              imagen: "",
              correcta: false,
            },
            {
              id: "B",
              descripcion: "Mesa",
              imagen: "",
              correcta: false,
            },
            {
              id: "C",
              descripcion: "Taza",
              imagen: "",
              correcta: true,
            },
            {
              id: "D",
              descripcion: "Tetera",
              imagen: "",
              correcta: false,
            },
          ],
        },
        {
          id: 10,
          respuestaIngresada : "",
          seccion: 3,
          instrucciones:
            "Deberás seleccionar la palabra que complete el sentido de la oración.",
        indicaciones : "Mateo patea la pelota.",
          pregunta: "La ___ tiene cuatro patas.",
          iimagen: [],
          respuestas: [
            {
              id: "A",
              descripcion: "Gallina",
              imagen: "",
              correcta: false,
            },
            {
              id: "B",
              descripcion: "Mesa",
              imagen: "",
              correcta: false,
            },
            {
              id: "C",
              descripcion: "Taza",
              imagen: "",
              correcta: true,
            },
            {
              id: "D",
              descripcion: "Tetera",
              imagen: "",
              correcta: false,
            },
          ],
        },
        {
          id: 11,
          respuestaIngresada : "",
          seccion: 3,
          instrucciones:
            "Deberás seleccionar la palabra que complete el sentido de la oración.",
        indicaciones : "Mateo patea la pelota.",
          pregunta: "La ___ tiene cuatro patas.",
          imagen: [],
          respuestas: [
            {
              id: "A",
              descripcion: "Gallina",
              imagen: "",
              correcta: false,
            },
            {
              id: "B",
              descripcion: "Mesa",
              imagen: "",
              correcta: false,
            },
            {
              id: "C",
              descripcion: "Taza",
              imagen: "",
              correcta: true,
            },
            {
              id: "D",
              descripcion: "Tetera",
              imagen: "",
              correcta: false,
            },
          ],
        },
        {
          id: 12,
          respuestaIngresada : "",
          seccion: 3,
          instrucciones:
            "Deberás seleccionar la palabra que complete el sentido de la oración.",
        indicaciones : "Mateo patea la pelota.",
          pregunta: "La ___ tiene cuatro patas.",
          imagen: [],
          respuestas: [
            {
              id: "A",
              descripcion: "Gallina",
              imagen: "",
              correcta: false,
            },
            {
              id: "B",
              descripcion: "Mesa",
              imagen: "",
              correcta: false,
            },
            {
              id: "C",
              descripcion: "Taza",
              imagen: "",
              correcta: true,
            },
            {
              id: "D",
              descripcion: "Tetera",
              imagen: "",
              correcta: false,
            },
          ],
        },
        {
          id: 13,
          respuestaIngresada : "",
          seccion: 4,
          instrucciones:
            "Deberás leer la oración del recuadro y seleccionar la opción que responda a la pregunta.",
            indicaciones : "Mateo patea la pelota.",
          pregunta: "¿Qué patea Mateo?",
          imagen: [],
          respuestas: [
            {
              id: "A",
              descripcion: "Gallina",
              imagen: "",
              correcta: false,
            },
            {
              id: "B",
              descripcion: "Mesa",
              imagen: "",
              correcta: false,
            },
            {
              id: "C",
              descripcion: "Taza",
              imagen: "",
              correcta: true,
            },
            {
              id: "D",
              descripcion: "Tetera",
              imagen: "",
              correcta: false,
            },
          ],
        },
        {
          id: 14,
          respuestaIngresada : "",
          seccion: 4,
          instrucciones:
            "Deberás leer la oración del recuadro y seleccionar la opción que responda a la pregunta.",
            indicaciones : "Mateo patea la pelota.",
          pregunta: "¿Qué patea Mateo?",
          imagen: [],
          respuestas: [
            {
              id: "A",
              descripcion: "Gallina",
              imagen: "",
              correcta: false,
            },
            {
              id: "B",
              descripcion: "Mesa",
              imagen: "",
              correcta: false,
            },
            {
              id: "C",
              descripcion: "Taza",
              imagen: "",
              correcta: true,
            },
            {
              id: "D",
              descripcion: "Tetera",
              imagen: "",
              correcta: false,
            },
          ],
        },
        {
          id: 15,
          respuestaIngresada : "",
          seccion: 4,
          instrucciones:
            "Deberás leer la oración del recuadro y seleccionar la opción que responda a la pregunta.",
            indicaciones : "Mateo patea la pelota.",
          pregunta: "¿Qué patea Mateo?",
          imagen: [
            {
                id : 1,
                img : "cuervo1.jpg",
                descripcion: "Es un día caluroso y,luego de haber volado mucho, el cuervo tiene mucha sed."
            },
            {
                id : 2,
                img : "cuervo2.jpg",
                descripcion: "Ve una botella con un poco de agua y mete el pico para tomarla, pero no alcanza."
            },
            {
                id : 3,
                img : "cuervo3.jpg",
                descripcion: "Entonces se le ocurre una idea. Coge unas piedras y las mete una por una dentro de la"
            },
            {
                id : 4,
                img : "cuervo4.jpg",
                descripcion: "Poco a poco, las piedras empiezan a subir el nivel del agua en la botella."
            },
            {
                id : 5,
                img : "cuervo5.jpg",
                descripcion: "Hasta que al fin el cuervo puede tomar el agua."
            },
          ],
          respuestas: [
            {
              id: "A",
              descripcion: "Gallina",
              imagen: "",
              correcta: false,
            },
            {
              id: "B",
              descripcion: "Mesa",
              imagen: "",
              correcta: false,
            },
            {
              id: "C",
              descripcion: "Taza",
              imagen: "",
              correcta: true,
            },
            {
              id: "D",
              descripcion: "Tetera",
              imagen: "",
              correcta: false,
            },
          ],
        },
        {
          id: 16,
          respuestaIngresada : "",
          seccion: 5,
          instrucciones:
            "Deberás observar el dibujo y el texto de la imagen. Luego, haz un clic dentro del recuadro de la alternativa que consideres adecuada.",
            indicaciones : "Observa y lee con atención la siguiente imagen:",
          pregunta: "¿Por qué el cuervo no podía tomar el agua de la botella?",
          imagen: [
            {
                id : 1,
                img : "cuervo1.jpg",
                descripcion: "Es un día caluroso y,luego de haber volado mucho, el cuervo tiene mucha sed."
            },
            {
                id : 2,
                img : "cuervo2.jpg",
                descripcion: "Ve una botella con un poco de agua y mete el pico para tomarla, pero no alcanza."
            },
            {
                id : 3,
                img : "cuervo3.jpg",
                descripcion: "Entonces se le ocurre una idea. Coge unas piedras y las mete una por una dentro de la"
            },
            {
                id : 4,
                img : "cuervo4.jpg",
                descripcion: "Poco a poco, las piedras empiezan a subir el nivel del agua en la botella."
            },
            {
                id : 5,
                img : "cuervo5.jpg",
                descripcion: "Hasta que al fin el cuervo puede tomar el agua."
            },
          ],
          respuestas: [
            {
              id: "A",
              descripcion: "Porque su pico no alcanzaba al agua.",
              imagen: "",
              correcta: false,
            },
            {
              id: "B",
              descripcion: "Porque el agua tenía piedras.",
              imagen: "",
              correcta: false,
            },
            {
              id: "C",
              descripcion: "Porque la botella era muy chica.",
              imagen: "",
              correcta: true,
            },
            {
              id: "D",
              descripcion: "Porque estaba contaminada.",
              imagen: "",
              correcta: false,
            },
          ],
        },
        {
          id: 17,
          respuestaIngresada : "",
          seccion: 5,
          instrucciones:
            "Deberás observar el dibujo y el texto de la imagen. Luego, haz un clic dentro del recuadro de la alternativa que consideres adecuada.",
            indicaciones : "Observa y lee con atención la siguiente imagen:",
          pregunta: "¿En qué lugar se pondrán las vacunas?",
          imagen: [
            {
                id : 1,
                img : "cuervo1.jpg",
                descripcion: "Es un día caluroso y,luego de haber volado mucho, el cuervo tiene mucha sed."
            },
            {
                id : 2,
                img : "cuervo2.jpg",
                descripcion: "Ve una botella con un poco de agua y mete el pico para tomarla, pero no alcanza."
            },
            {
                id : 3,
                img : "cuervo3.jpg",
                descripcion: "Entonces se le ocurre una idea. Coge unas piedras y las mete una por una dentro de la"
            },
            {
                id : 4,
                img : "cuervo4.jpg",
                descripcion: "Poco a poco, las piedras empiezan a subir el nivel del agua en la botella."
            },
            {
                id : 5,
                img : "cuervo5.jpg",
                descripcion: "Hasta que al fin el cuervo puede tomar el agua."
            },
          ],
          respuestas: [
            {
              id: "A",
              descripcion: "En la direccion de la escuela",
              imagen: "",
              correcta: false,
            },
            {
              id: "B",
              descripcion: "En el centro de vacunacion",
              imagen: "",
              correcta: false,
            },
            {
              id: "C",
              descripcion: "En la casa",
              imagen: "",
              correcta: true,
            },
            {
              id: "D",
              descripcion: "En el primer piso de la escuela",
              imagen: "",
              correcta: false,
            },
          ],
        },
      ],
    };
  },
  methods : {
    terminarPrueba(){
        this.listaDePreguntas.forEach(e => this.listaDeRespuestas.push({
            id : e.id,
            respuesta : e.respuestaIngresada
        }))
        console.log(this.listaDeRespuestas)
    }
  }
};
</script>
