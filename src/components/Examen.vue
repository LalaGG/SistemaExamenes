<template>
  <v-container fluid>
    <v-row no-gutters class="d-flex align-content-center flex-wrap">
      <div class="base-timer">
        <svg
          class="base-timer__svg"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g class="base-timer__circle">
            <circle
              class="base-timer__path-elapsed"
              cx="50"
              cy="50"
              r="45"
            ></circle>
            <path
              :stroke-dasharray="circleDasharray"
              class="base-timer__path-remaining"
              :class="remainingPathColor"
              d="
                        M 50, 50
                        m -45, 0
                        a 45,45 0 1,0 90,0
                        a 45,45 0 1,0 -90,0
                      "
            ></path>
          </g>
        </svg>
        <span class="base-timer__label">{{ formattedTimeLeft }}</span>
      </div>
      <v-col sm="10">
        <v-stepper v-model="e1">
          <v-stepper-header>
            <template v-for="(modulo, index) in listaDePreguntas.testModules">
              <v-stepper-step
                @click="startTimer()"
                :key="modulo.id"
                :editable="cronometroInicio"
                :step="index + 1"
              >
                {{ modulo.name }}
              </v-stepper-step>
              <v-divider :key="index"></v-divider>
            </template>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content
              v-for="(modulo, index) in listaDePreguntas.testModules"
              :key="modulo.id"
              :step="index + 1"
            >
              <v-card
                class="mb-12"
                v-for="(secciones, index) in modulo.testParts"
                :key="index + 1"
              >
                <h1>{{ secciones.name }}</h1>
                <h3>{{ secciones.description }}</h3>
                <v-row>
                  <v-col
                    sm="3"
                    v-for="(preguntas, index) in secciones.questions"
                    :key="index + 1"
                  >
                    <v-card-text>
                      <div
                        v-if="preguntas.text != ''"
                        style="border: 2px solid black; padding: 15px; text-align: center;"
                      >
                        <h1>{{ preguntas.text }}</h1>
                      </div>

                      <v-radio-group v-model="preguntas.idSelectedAnswer">
                        <v-radio
                          v-for="n in preguntas.answers"
                          :key="n.id"
                          :label="n.text"
                          :value="n.id"
                        ></v-radio>
                      </v-radio-group>
                    </v-card-text>
                  </v-col>
                </v-row>
              </v-card>

              <v-btn color="primary" @click="terminarPrueba">
                Finalizar el Exámen
              </v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>

    <v-dialog v-model="resultadoDialog" persistent max-width="800">
      <v-toolbar color="primary" dark>
        <v-toolbar-title>
          Resultado
        </v-toolbar-title>
      </v-toolbar>
      <v-card class="py-5">
        <v-card-text>
          <v-row class="justify-center">
            <p class="text-h2">
              {{ itemModelNota.approved ? "Aprobado" : "Desaprobado" }}
            </p>
          </v-row>
          <v-row class="justify-center">
            <p style="font-weight: 800;" class="text-h3">
              Nota: {{ itemModelNota.totalScore }}
            </p>
          </v-row>
          <v-row class="justify-center">
            <v-btn class="ma-3" @click="EnviarCorreo" color="primary"
              >Enviar Certificado</v-btn
            >
            <v-btn class="ma-3" @click="SalirDelSistema" color="error"
              >Salir del Sistema</v-btn
            >
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex";

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green",
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD,
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD,
  },
};

export default {
  data() {
    return {
      itemModelNota: {
        approved: true,
        totalScore: 14,
      },
      e1: 0,
      radioGroup: [],
      listaDePreguntas: [],
      sumaMinutos: 0,
      timePassed: 0,
      timerInterval: null,
      cronometroInicio: true,
      resultadoDialog: false,
    };
  },
  created() {
    this.ListarExamen();
  },
  computed: {
    circleDasharray() {
      return `${(this.timeFraction * FULL_DASH_ARRAY).toFixed(0)} 283`;
    },
    formattedTimeLeft() {
      const timeLeft = this.timeLeft;
      let minutes = Math.floor(timeLeft / 60);
      let seconds = timeLeft % 60;

      if (minutes < 10) {
        minutes = `0${minutes}`;
      }
      if (seconds < 10) {
        seconds = `0${seconds}`;
      }

      return `${minutes}:${seconds}`;
    },

    timeLeft() {
      return this.sumaMinutos - this.timePassed;
    },

    timeFraction() {
      const rawTimeFraction = this.timeLeft / this.sumaMinutos;
      return rawTimeFraction - (1 / this.sumaMinutos) * (1 - rawTimeFraction);
    },

    remainingPathColor() {
      const { alert, warning, info } = COLOR_CODES;

      if (this.timeLeft <= alert.threshold) {
        return alert.color;
      } else if (this.timeLeft <= warning.threshold) {
        return warning.color;
      } else {
        return info.color;
      }
    },
  },
  watch: {
    timeLeft(newValue) {
      if (newValue === 0) {
        this.onTimesUp();
      }
    },
  },
  methods: {
    ...mapMutations(["showLoading", "hideLoading", "showNotification"]),
    EnviarCorreo() {},
    SalirDelSistema() {
      sessionStorage.clear();
      this.$session.destroy();
      this.$router.push("/Login");
    },
    onTimesUp() {
      clearInterval(this.timerInterval);
    },
    async startTimer() {
      this.cronometroInicio = false;
      try {
        var token = sessionStorage.getItem("jwt");
        let response = await axios.post(
          `${this.$urlApi}Test/submit`,
          { token },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("jwt"),
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
      this.timerInterval = setInterval(() => (this.timePassed += 1), 1000);
    },
    async terminarPrueba() {
      clearInterval(this.timerInterval);
      this.showLoading({
        title: "Accediendo a la información",
        color: "secondary",
      });
      try {
        var listaToken = {
          token: sessionStorage.getItem("jwt"),
          testModules: this.listaDePreguntas.testModules,
        };
        let response = await axios.post(
          `${this.$urlApi}Test/finish`,
          listaToken,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("jwt"),
            },
          }
        );
        if (response.data) {
          this.itemModelNota.approved = response.data.approved;
          this.itemModelNota.totalScore = response.data.totalScore;
          this.resultadoDialog = true;
        } else {
          this.$swal(
            "¡Error!",
            "Ha ocurrido un error al registrar su exámen, comuniquese con soporte",
            "error"
          );
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },
    async ListarExamen() {
      this.showLoading({
        title: "Accediendo a la información",
        color: "secondary",
      });
      try {
        let response = await axios.get(`${this.$urlApi}Test`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("jwt"),
          },
        });
        this.listaDePreguntas = response.data;
        this.listaDePreguntas.testModules.forEach((m) => {
          m.testParts.forEach((s) => {
            s.questions.forEach((p) => {
              this.sumaMinutos = Number(this.sumaMinutos) + Number(p.timeLimit);
            });
          });
        });
        this.sumaMinutos = this.sumaMinutos * 60;
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },
  },
};
</script>

<style scoped lang="scss">
.base-timer {
  position: fixed;
  top: 1em;
  right: 1em;
  width: 200px;
  height: 200px;

  &__svg {
    transform: scaleX(-1);
  }

  &__circle {
    fill: none;
    stroke: none;
  }

  &__path-elapsed {
    stroke-width: 7px;
    stroke: grey;
  }

  &__path-remaining {
    stroke-width: 7px;
    stroke-linecap: round;
    transform: rotate(90deg);
    transform-origin: center;
    transition: 1s linear all;
    fill-rule: nonzero;
    stroke: currentColor;

    &.green {
      color: rgb(65, 184, 131);
    }

    &.orange {
      color: orange;
    }

    &.red {
      color: red;
    }
  }

  &__label {
    position: absolute;
    width: 200px;
    height: 200px;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
  }
}
</style>
