<template>
  <!--container-->
  <section class="container">
    <!--questionBox-->
    <div class="questionBox" id="app">
      <!-- transition -->
      <transition
        :duration="{ enter: 500, leave: 300 }"
        enter-active-class="animated zoomIn"
        leave-active-class="animated zoomOut"
        mode="out-in"
      >
        <!--qusetionContainer-->
        <div
          class="questionContainer"
          v-if="
            questionIndex < quiz.questions.length &&
              startDemo &&
              !changeModule &&
              !startNewModule &&
              !finishTest
          "
          v-bind:key="questionIndex"
        >
          <div class="divTimer">
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
          </div>

          <header class="questionHeader">
            <h1
              v-if="
                quiz.questions[questionIndex].testPartInstructions != null &&
                  quiz.questions[questionIndex].testPartInstructions != ''
              "
              class="title is-6"
            >
              {{ quiz.questions[questionIndex].testPartInstructions }}
            </h1>
            <!--progress-->
            <!-- <div class="progressContainer" v-if="finishDemo">
              <progress
                class="progress is-info is-small"
                :value="((questionIndex - totalQuestionDemo) / (quiz.questions.length - totalQuestionDemo)) * 100"
                max="100"
                >{{ ((questionIndex - totalQuestionDemo) / (quiz.questions.length - totalQuestionDemo)) * 100 }}%</progress
              >
              <p>
                {{ Math.floor(((questionIndex - totalQuestionDemo) / (quiz.questions.length - totalQuestionDemo)) * 100) }}%
                Completo
              </p>
            </div> -->
            <!--/progress-->
          </header>

          <!-- questionTitle -->
          <h2
            v-if="
              quiz.questions[questionIndex].indications != null &&
                quiz.questions[questionIndex].indications != ''
            "
            class="titleContainer title"
          >
            {{ quiz.questions[questionIndex].indications }}
          </h2>
          <div
            v-if="
              quiz.questions[questionIndex].text != null &&
                quiz.questions[questionIndex].text != ''
            "
            :class="
              quiz.questions[questionIndex].text.length > 200
                ? 'titletext'
                : 'titletext1'
            "
            v-html="quiz.questions[questionIndex].text"
          ></div>
          <div
            class="imageContainer"
            v-if="quiz.questions[questionIndex].image != null"
          >
            <v-img
              :src="`${urlImage}${quiz.questions[questionIndex].image}`"
              width="50%"
              aspect-ratio="1"
              contain
            ></v-img>
          </div>
          <h2
            v-if="
              quiz.questions[questionIndex].value != null &&
                quiz.questions[questionIndex].value != ''
            "
            class="titlevalue"
          >
            {{ quiz.questions[questionIndex].value }}
          </h2>

          <!-- quizOptions -->
          <div
            v-bind:class="{
              optionContainerImage:
                quiz.questions[questionIndex].answers[0].image != null,
              optionContainer:
                quiz.questions[questionIndex].answers[0].image == null,
            }"
          >
            <div
              v-for="(response, index) in quiz.questions[questionIndex].answers"
              class="option"
              :class="{
                'is-selected':
                  userResponses[questionIndex] == null
                    ? ''
                    : userResponses[questionIndex].index == index,
              }"
              @click="selectOption(quiz.questions[questionIndex], index)"
              :key="index"
            >
              <div v-if="response.text != null">
                {{ index | charIndex }}. {{ response.text }}
              </div>
              <div v-if="response.image != null" class="imageAnswerContainer">
                <h3>{{ index | charIndex }}.</h3>
                <v-img
                  :src="`${urlImage}${response.image}`"
                  width="50%"
                  aspect-ratio="1"
                  contain
                ></v-img>
              </div>
            </div>
          </div>

          <!--quizFooter: navigation and progress-->
          <footer class="questionFooter">
            <!--pagination-->
            <nav class="pagination" role="navigation" aria-label="pagination">
              <!-- next button -->
              <a
                class="button"
                :class="userResponses[questionIndex] == null ? '' : 'is-active'"
                v-on:click="!endButton ? next() : hideQuestions()"
              >
                {{ !endButton ? "Siguiente" : "Terminar" }}
              </a>
            </nav>
            <!--/pagination-->
          </footer>
          <!--/quizFooter-->
        </div>
        <!--/questionContainer-->

        <!--quizCompletedResult-->
        <div
          v-if="
            questionIndex >= 0 && changeModule && startNewModule && !finishTest
          "
          v-bind:key="questionIndex"
          class="quizCompleted has-text-centered"
        >
          <span class="icon">
            <i
              class="fa"
              :class="
                1 == 1 ? 'fa-check-circle-o is-active' : 'fa-times-circle'
              "
            ></i>
          </span>

          <h2 class="title">
            Tómate un respiro
          </h2>
          <p class="subtitle">
            da a
            <a @click="next()" class="iniciarText">iniciar <i class="fa fa-refresh"></i></a> cuando
            estes listo para el {{ currentModule }}
          </p>
          <br />
        </div>

        <div
          v-if="
            (questionIndex > 0 && questionIndex == quiz.questions.length) ||
              finishTest
          "
          v-bind:key="questionIndex"
          class="quizCompleted has-text-centered"
        >
          <span class="icon">
            <i
              class="fa"
              :class="
                1 == 1 ? 'fa-check-circle-o is-active' : 'fa-times-circle'
              "
            ></i>
          </span>

          <h2 class="title">
            ¡FELICIDADES!
          </h2>
          <p class="subtitle">
            FIN DE LA PRUEBA.
          </p>
          <br />
          <a class="button" @click="cerrarSesion()"
            >Salir <i class="fa fa-refresh"></i
          ></a>
        </div>

        <div
          v-if="questionIndex == 0 && !startDemo && !finishTest"
          v-bind:key="questionIndex"
          class="quizCompleted has-text-centered"
        >
          <span class="icon">
            <i
              class="fa"
              :class="
                1 == 1 ? 'fa-check-circle-o is-active' : 'fa-times-circle'
              "
            ></i>
          </span>

          <h2 class="title">
            Empezaremos practicando
          </h2>
          <p class="subtitle">
            A continuación, encontrarás 4 preguntas. Haz un clic en la
            alternativa que mejor responde cada una
          </p>
          <br />
          <a class="button" @click="IniciarPractica()"
            >Iniciar Prueba<i class="fa fa-refresh"></i
          ></a>
        </div>

        <!--/quizCompetedResult-->
      </transition>
    </div>
    <!--/questionBox-->
  </section>
  <!--/container-->
</template>

<script>
import axios from "axios";
import { mapMutations } from "vuex";

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 60;
const ALERT_THRESHOLD = 30;

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
  data: () => ({
    quiz: {},
    questionIndex: 0,
    userResponses: "",
    isActive: false,
    currentModule: "",
    nextModule: "",
    changeModule: false,
    startNewModule: false,
    startDemo: false,
    endButton: false,
    partName: "",
    finishDemo: "",
    timePassed: 0,
    timeQuestion: 0,
    //urlImage: "http://evaluacionescrita.ino.gob.pe/img/",
    urlImage: "http://crecelee.net/img/",
    totalQuestionDemo: 0,
    finishTest: "",
    timeOut: false,
    timeOutDemo: false,
    flag: false,
  }),
  filters: {
    charIndex: function(i) {
      return String.fromCharCode(97 + i);
    },
  },
  computed: {
    circleDasharray() {
      return `${(this.timeFraction * FULL_DASH_ARRAY).toFixed(0)} 283`;
    },
    formattedTimeLeft() {
      let timeLeft = this.timeLeft;
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
      return this.timeQuestion - this.timePassed;
    },

    timeFraction() {
      const rawTimeFraction = this.timeLeft / this.timeQuestion;
      return rawTimeFraction - (1 / this.timeQuestion) * (1 - rawTimeFraction);
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
    async timeLeft(newValue) {
      if (this.finishDemo && newValue === 0) {
        this.onTimesUp();
      }
      if (!this.finishDemo && newValue == 60) {
        clearInterval(this.timerInterval);
        this.$swal({
          title: "No olvides elegir una de las cuatro opciones",
          icon: "info",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Continuar",
        }).then((result) => {
          if (result.isConfirmed) {
            this.timeQuestion = 120;
            this.timePassed = 60;
            this.startTimer();
          }
        });
      }
      if (!this.finishDemo && newValue == 0 && this.questionIndex < 3) {
        clearInterval(this.timerInterval);
        this.$swal({
          title:
            "Pasemos a la siguiente pregunta. No olvides elegir una de las cuatro opciones",
          icon: "info",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Continuar",
        }).then((result) => {
          if (result.isConfirmed) {
            this.timeOutDemo = true;
            this.next();
          }
        });
      }
      if (!this.finishDemo && newValue == 0 && this.questionIndex == 3) {
        // var selectedAnswer = {
        //   index: -1,
        //   idQuestion: this.quiz.questions[this.questionIndex].id,
        //   idAnswer: 0,
        //   idUser: this.$session.get("user").idUser,
        //   timePassed: 120,
        //   attempts: 2,
        // };
        // this.$set(this.userResponses, this.questionIndex, selectedAnswer);
        // try {
        //   axios.post(
        //     `${this.$urlApi}Test/SubmitAnswer`,
        //     this.userResponses[this.questionIndex],
        //     {
        //       headers: {
        //         "Content-Type": "application/json",
        //         Authorization: "Bearer " + sessionStorage.getItem("jwt"),
        //       },
        //     }
        //   );
        // } catch (error) {
        //   console.log(error);
        // }
        try {
          let response = await axios.get(
            `${this.$urlApi}Test/ValidateDemoByUser/${
              this.$session.get("user").idUser
            }`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("jwt"),
              },
            }
          );
          if (response.data != 1) {
            this.$swal({
              title: "Muchas gracias por tu tiempo, la prueba ha terminado",
              icon: "info",
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Continuar",
            }).then((result) => {
              if (result.isConfirmed) {
                this.Expulsado();
              }
            });
          } else {
            this.timeOutDemo = true;
            this.hideQuestions()
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  async created() {
    this.finishDemo = this.$session.get("user").finishDemo;
    this.finishTest = this.$session.get("user").testFinish;
    await this.ListarExamen();
    if (this.finishDemo) {
      this.startDemo = true;
      this.timeQuestion =
        this.quiz.questions[this.questionIndex].timeLimit * 60;
      this.startTimer();
    }
  },
  methods: {
    ...mapMutations(["showLoading", "hideLoading", "showNotification"]),
    async Expulsado() {
      try {
        var token = sessionStorage.getItem("jwt");
        let response = await axios.post(
          `${this.$urlApi}Test/Finish`,
          { token },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("jwt"),
            },
          }
        );
        if (response.data > 0) {
          console.log("examen terminado satisfactoriamente");
        } else {
          this.$swal(
            "¡Error!",
            "Ha ocurrido un error al registrar su exámen, comuniquese con soporte",
            "error"
          );
        }
      } catch (error) {
        console.log(error);
      }
      sessionStorage.clear();
      this.$session.destroy();
      this.$router.push("/Login");
    },
    async onTimesUp() {
      clearInterval(this.timerInterval);
      this.timeOut = true;
      await this.$swal({
        title: "Se acabó el tiempo de esta pregunta",
        text: "No te preocupes, pasemos al siguiente",
        icon: "info",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Continuar",
      }).then((result) => {
        if (result.isConfirmed) {
          console.log(this.currentModule)
          console.log(this.nextModule)
          if(!this.endButton && this.finishDemo){
            this.next()
          } else {
            this.hideQuestions()
          }
        }
      });
    },
    async startTimer() {
      this.timerInterval = setInterval(() => (this.timePassed += 1), 1000);
    },
    async ListarExamen() {
      this.showLoading({
        title: "Accediendo a la información",
        color: "secondary",
      });
      try {
        let response = await axios.get(
          `${this.$urlApi}Test/GetTestByUser/${
            this.$session.get("user").idUser
          }`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("jwt"),
            },
          }
        );
        this.quiz = response.data;
        this.currentModule =
          this.quiz.questions.length > 0
            ? this.quiz.questions[this.questionIndex].testModuleName
            : "";
        this.userResponses =
          this.quiz.questions.length > 0
            ? Array(this.quiz.questions.length).fill(null)
            : [];
        var filteredQuiz =
          this.quiz.questions.length > 0
            ? this.quiz.questions.filter(
                (q) => q.testModuleName == "Módulo Prueba"
              )
            : [];
        this.totalQuestionDemo = filteredQuiz.length;
      } catch (error) {
        console.log(error);
      } finally {
        this.hideLoading();
      }
    },
    selectOption(item, index) {
      var selectedAnswer = {
        index: index,
        idQuestion: item.id,
        idAnswer: item.answers[index].id,
        idUser: this.$session.get("user").idUser,
        timePassed: this.timePassed,
        attempts: 0,
      };
      this.$set(this.userResponses, this.questionIndex, selectedAnswer);
    },
    async next() {
      if (this.questionIndex < this.quiz.questions.length) {
        //Logic for changeModule
        this.currentModule = this.quiz.questions[
          this.questionIndex
        ].testModuleName;
        if (!this.startNewModule) {
          if (this.finishDemo) {
            if (this.userResponses[this.questionIndex] == null) {
              if (!this.timeOut) {
                const confirm = await this.$swal({
                  title: "No has marcado aún",
                  text: "¿deseas continuar de todos modos?",
                  icon: "question",
                  confirmButtonColor: "#3085d6",
                  confirmButtonText: "Continuar",
                  showCancelButton: true,
                  cancelButtonColor: "#d33",
                  cancelButtonText: "Cancelar",
                });

                if (confirm.isConfirmed) {
                  var selectedAnswer = {
                    index: -2,
                    idQuestion: this.quiz.questions[this.questionIndex].id,
                    idAnswer: 0,
                    idUser: this.$session.get("user").idUser,
                    timePassed: this.timePassed,
                  };
                  this.$set(
                    this.userResponses,
                    this.questionIndex,
                    selectedAnswer
                  );
                  try {
                    axios.post(
                      `${this.$urlApi}Test/SubmitAnswer`,
                      this.userResponses[this.questionIndex],
                      {
                        headers: {
                          "Content-Type": "application/json",
                          Authorization:
                            "Bearer " + sessionStorage.getItem("jwt"),
                        },
                      }
                    );
                  } catch (error) {
                    console.log(error);
                  }

                  this.questionIndex++;
                } else if (result.dismiss === this.$swal.DismissReason.cancel) {
                  return;
                }
              } else {
                var selectedAnswer = {
                  index: -1,
                  idQuestion: this.quiz.questions[this.questionIndex].id,
                  idAnswer: 0,
                  idUser: this.$session.get("user").idUser,
                  timePassed: this.timePassed,
                };
                this.$set(
                  this.userResponses,
                  this.questionIndex,
                  selectedAnswer
                );
                try {
                  axios.post(
                    `${this.$urlApi}Test/SubmitAnswer`,
                    this.userResponses[this.questionIndex],
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization:
                          "Bearer " + sessionStorage.getItem("jwt"),
                      },
                    }
                  );
                } catch (error) {
                  console.log(error);
                }
                this.timeOut = false;
                this.questionIndex++;
              }
            } else {
              try {
                axios.post(
                  `${this.$urlApi}Test/SubmitAnswer`,
                  this.userResponses[this.questionIndex],
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
              this.questionIndex++;
            }
          } else {
            if (this.userResponses[this.questionIndex] == null) {
              if (!this.timeOutDemo) {
                const confirm = await this.$swal({
                  title: "No has marcado aún",
                  text: "¿deseas continuar de todos modos?",
                  icon: "question",
                  confirmButtonColor: "#3085d6",
                  confirmButtonText: "OK",
                  showCancelButton: true,
                  cancelButtonColor: "#d33",
                  cancelButtonText: "Cancelar",
                });

                if (confirm.isConfirmed) {
                  var selectedAnswer = {
                    index: -2,
                    idQuestion: this.quiz.questions[this.questionIndex].id,
                    idAnswer: 0,
                    idUser: this.$session.get("user").idUser,
                    timePassed: this.timePassed,
                  };
                  this.$set(
                    this.userResponses,
                    this.questionIndex,
                    selectedAnswer
                  );
                  try {
                    axios.post(
                      `${this.$urlApi}Test/SubmitAnswer`,
                      this.userResponses[this.questionIndex],
                      {
                        headers: {
                          "Content-Type": "application/json",
                          Authorization:
                            "Bearer " + sessionStorage.getItem("jwt"),
                        },
                      }
                    );
                  } catch (error) {
                    console.log(error);
                  }

                  this.questionIndex++;
                  // this.flag = true
                  // console.log(this.flag)
                  // return
                } else if (result.dismiss === this.$swal.DismissReason.cancel) {
                  return;
                }
              } else {
                var selectedAnswer = {
                  index: -1,
                  idQuestion: this.quiz.questions[this.questionIndex].id,
                  idAnswer: 0,
                  idUser: this.$session.get("user").idUser,
                  timePassed: 120,
                  attempts: 2,
                };
                this.$set(
                  this.userResponses,
                  this.questionIndex,
                  selectedAnswer
                );
                try {
                  axios.post(
                    `${this.$urlApi}Test/SubmitAnswer`,
                    this.userResponses[this.questionIndex],
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization:
                          "Bearer " + sessionStorage.getItem("jwt"),
                      },
                    }
                  );
                } catch (error) {
                  console.log(error);
                }
                this.timeOutDemo = false;
                this.questionIndex++;
              }
            } else {
              this.userResponses[this.questionIndex].attempts =
                this.userResponses[this.questionIndex].timePassed < 60 ? 0 : 1;
              try {
                axios.post(
                  `${this.$urlApi}Test/SubmitAnswer`,
                  this.userResponses[this.questionIndex],
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
              this.questionIndex++;
            }
          }
          this.timeOutDemo = false;
        } else {
          this.startNewModule = false;
          this.changeModule = false;
        }
        this.nextModule = this.quiz.questions[
          this.questionIndex
        ].testModuleName;
        if (this.currentModule == this.nextModule) {
          this.changeModule = false;
        } else {
          this.changeModule = true;
        }
        //logic for EndButton
        if (
          this.questionIndex < this.quiz.questions.length - 1 &&
          this.nextModule !=
            this.quiz.questions[this.questionIndex + 1].testModuleName
        ) {
          this.endButton = true;
        }
        if (this.questionIndex == this.quiz.questions.length - 1) {
          this.endButton = true;
        }
        clearInterval(this.timerInterval);
        this.timeQuestion =
          this.quiz.questions[this.questionIndex].timeLimit * 60;
        this.timePassed = 0;
        this.startTimer();
      }
    },
    async hideQuestions() {
      if (this.userResponses[this.questionIndex] == null) {
        if (!this.timeOutDemo) {
          try {
            let response = await axios.get(
              `${this.$urlApi}Test/ValidateDemoByUser/${
                this.$session.get("user").idUser
              }`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + sessionStorage.getItem("jwt"),
                },
              }
            );
            if (response.data != 1) {
              try {
                var token = sessionStorage.getItem("jwt");
                let response = await axios.post(
                  `${this.$urlApi}Test/Finish`,
                  { token },
                  {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + sessionStorage.getItem("jwt"),
                    },
                  }
                );
                if (response.data > 0) {
                  console.log("examen terminado satisfactoriamente");
                } else {
                  this.$swal(
                    "¡Error!",
                    "Ha ocurrido un error al registrar su exámen, comuniquese con soporte",
                    "error"
                  );
                }
              } catch (error) {
                console.log(error);
              }
              this.$swal({
                title: "Muchas gracias por tu tiempo, la prueba ha terminado",
                icon: "info",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "Continuar",
              }).then((result) => {
                if (result.isConfirmed) {
                  this.Expulsado();
                }
              });
            }
          } catch (error) {
            console.log(error);
          }
        } else {     
          var selectedAnswer = {
            index: -1,
            idQuestion: this.quiz.questions[this.questionIndex].id,
            idAnswer: 0,
            idUser: this.$session.get("user").idUser,
            timePassed: 120,
            attempts: 2,
          };
          this.$set(this.userResponses, this.questionIndex, selectedAnswer);
          try {
            axios.post(
              `${this.$urlApi}Test/SubmitAnswer`,
              this.userResponses[this.questionIndex],
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
          this.timeOutDemo = false;
          this.questionIndex++;
        }
      } else {
        if (!this.finishDemo) {
          this.userResponses[this.questionIndex].attempts =
            this.userResponses[this.questionIndex].timePassed < 60 ? 0 : this.userResponses[this.questionIndex].timePassed == 120 ? 2 : 1;
          try {
            axios.post(
              `${this.$urlApi}Test/SubmitAnswer`,
              this.userResponses[this.questionIndex],
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
        }
      }
      this.timeOut = false;
      if (this.finishDemo) {
        if(this.userResponses[this.questionIndex] != null){
          try {
            var idUser = this.$session.get("user").idUser;
            let response = await axios.post(
              `${this.$urlApi}Test/SubmitAnswer`,
              this.userResponses[this.questionIndex],
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + sessionStorage.getItem("jwt"),
                },
              }
            );
            if (response.data > 0) {
              console.log("respuesta registrada satisfactoriamente");
            } else {
              this.$swal(
                "¡Error!",
                "Ha ocurrido un error al registrar su exámen, comuniquese con soporte",
                "error"
              );
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          var selectedAnswer = {
              index: -1,
              idQuestion: this.quiz.questions[this.questionIndex].id,
              idAnswer: 0,
              idUser: this.$session.get("user").idUser,
              timePassed: 120,
              attempts: 0,
            };
            this.$set(
                  this.userResponses,
                  this.questionIndex,
                  selectedAnswer
                );
          try {
            var idUser = this.$session.get("user").idUser;
            let response = await axios.post(
              `${this.$urlApi}Test/SubmitAnswer`,
              this.userResponses[this.questionIndex],
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + sessionStorage.getItem("jwt"),
                },
              }
            );
            if (response.data > 0) {
              console.log("respuesta registrada satisfactoriamente");
            } else {
              this.$swal(
                "¡Error!",
                "Ha ocurrido un error al registrar su exámen, comuniquese con soporte",
                "error"
              );
            }
          } catch (error) {
            console.log(error);
          } 
        } 
      }
      this.questionIndex++;
      if (this.questionIndex == this.quiz.questions.length) {
        try {
          var token = sessionStorage.getItem("jwt");
          let response = await axios.post(
            `${this.$urlApi}Test/Finish`,
            { token },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("jwt"),
              },
            }
          );
          if (response.data > 0) {
            console.log("examen terminado satisfactoriamente");
          } else {
            this.$swal(
              "¡Error!",
              "Ha ocurrido un error al registrar su exámen, comuniquese con soporte",
              "error"
            );
          }
        } catch (error) {
          console.log(error);
        }
        return;
      }
      this.currentModule = this.quiz.questions[
        this.questionIndex
      ].testModuleName;

      if (!this.finishDemo) {
        try {
          var idUser = this.$session.get("user").idUser;
          let response = await axios.post(
            `${this.$urlApi}Test/FinishDemo`,
            { idUser },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("jwt"),
              },
            }
          );
          if (response.data > 0) {
            console.log("practica terminada satisfactoriamente");
            this.finishDemo = true;
          } else {
            this.$swal(
              "¡Error!",
              "Ha ocurrido un error al registrar su exámen, comuniquese con soporte",
              "error"
            );
          }
        } catch (error) {
          console.log(error);
        }
      }
      this.changeModule = true;
      this.endButton = false;
      if (this.finishDemo && this.changeModule && !this.startNewModule) {
        this.startNewModule = true;
      }
    },
    cerrarSesion() {
      sessionStorage.clear();
      this.$session.destroy();
      this.$router.push("/Login");
    },

    async IniciarPractica() {
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
        if (response.data > 0) {
          console.log("Exámen iniciando de manera correcta");
        } else if (response.data == -1) {
          console.log("el exámen ya ha sido iniciado");
        } else {
          console.log("ha habido un error al iniciar el exámen");
        }
      } catch (error) {
        console.log(error);
      }
      this.startDemo = true;
      this.timeQuestion =
        this.quiz.questions[this.questionIndex].timeLimit * 60;
      this.startTimer();
      if (this.totalQuestionDemo == 1) {
        this.endButton = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$trans_duration: 0.3s;
$primary_color: #77dd77;

@import url("https://fonts.googleapis.com/css?family=Montserrat:400,400i,700");
@import url("https://fonts.googleapis.com/css?family=Open+Sans:400,400i,700");

body {
  font-family: "Open Sans", sans-serif;
  font-size: 14px;

  height: 100vh;

  background: #cfd8dc;

  /* mocking native UI */
  cursor: default !important; /* remove text selection cursor */
  user-select: none; /* remove text selection */
  user-drag: none; /* disbale element dragging */

  display: flex;
  align-items: center;
  justify-content: center;
}

.iniciarText{
  border : solid 2px black;
  padding : 5px;
}
.divTimer {
  background-color: $primary_color;
}
.button {
  transition: $trans_duration;
}
.title {
  font-family: Montserrat, sans-serif;
  font-weight: 700;
  font-size: larger;
}
.subtitle {
  font-family: Montserrat, sans-serif;
  font-weight: normal;
  font-size: larger;
}
.animated {
  transition-duration: $trans_duration/2;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.questionBox {
  max-width: 60rem;
  width: 60rem;
  min-height: 50rem;

  background: #fafafa;
  position: relative;
  display: flex;

  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);

  header {
    background: rgba(0, 0, 0, 0.025);
    padding: 1.5rem;
    text-align: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    background-color: $primary-color;
    height: 70%;

    h1 {
      font-weight: bold;
      margin-bottom: 1rem !important;
    }
    .progressContainer {
      width: 60%;
      margin: 0 auto;
      > progress {
        margin: 0;
        border-radius: 5rem;
        overflow: hidden;
        border: solid 1px black;

        color: #03377a;
        &::-moz-progress-bar {
          background: #03377a;
        }
        &::-webkit-progress-value {
          background: #03377a;
        }
      }
      > p {
        margin: 0;
        margin-top: 0.5rem;
      }
    }
  }
  .titleContainer {
    text-align: center;
    margin: 0 auto;
    padding: 0.5rem;
    font-weight: bold;
    font-style: italic;
  }

  .titletext {
    text-align: center;
    margin: 0 auto;
    padding: 1.5rem;
    width: 100%;
    height: 200px;
    overflow-y: scroll;
    font-size: 17px;
    font-weight: normal;
  }
  .titletext1 {
    text-align: center;
    margin: 0 auto;
    padding: 0.5rem;
    font-size: 17px;
    font-weight: normal;
  }

  .imageContainer {
    display: flex;
    justify-content: center;
    height: 400px;
  }

  .imageAnswerContainer {
    display: flex;
    justify-content: center;
    height: 150px;
  }

  .titlevalue {
    text-align: center;
    margin: 0 auto;
    padding: 0.5rem;
    font-weight: bold;
  }

  .quizForm {
    display: block;
    white-space: normal;

    height: 100%;
    width: 100%;

    .quizFormContainer {
      height: 100%;
      margin: 15px 18px;

      .field-label {
        text-align: left;
        margin-bottom: 0.5rem;
      }
    }
  }
  .quizCompleted {
    width: 100%;
    padding: 1rem;
    text-align: center;

    > .icon {
      color: #ff5252;
      font-size: 5rem;

      .is-active {
        color: #00e676;
      }
    }
  }
  .questionContainer {
    white-space: normal;

    height: 100%;
    width: 100%;

    .optionContainer {
      margin-top: 12px;
      flex-grow: 1;
      .option {
        border-radius: 290486px;
        padding: 9px 18px;
        margin: 0 auto;
        margin-bottom: 12px;
        transition: $trans_duration;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.05);
        color: rgba(0, 0, 0, 0.85);
        border: transparent 1px solid;
        width: 70%;

        &.is-selected {
          border-color: rgba(black, 0.25);
          background-color: $primary-color;
          color: black;
        }
        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
        &:active {
          transform: scaleX(0.9);
        }
      }
    }

    .optionContainerImage {
      margin-top: 12px;
      flex-grow: 1;
      .option {
        margin: 0 auto;
        margin-bottom: 12px;
        transition: $trans_duration;
        cursor: pointer;
        border: black 2px solid;
        width: 20%;

        &.is-selected {
          border: $primary-color 4px solid;
        }
      }
    }

    .questionFooter {
      background: rgba(0, 0, 0, 0.025);
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      width: 100%;
      display: flex;
      align-self: flex-end;
      justify-content: flex-end;

      .pagination {
        margin: 15px 25px;
        display: flex;
        justify-content: right;
      }
    }
  }
}
.pagination {
  display: flex;
  justify-content: space-between;
}
.button {
  padding: 1rem 4rem;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 5rem;
  margin: 0 0.25rem;

  transition: 0.3s;

  &:hover {
    cursor: pointer;
    background: #eceff1;
    border-color: rgba(0, 0, 0, 0.25);
  }
  &.is-active {
    background: $primary_color;
    color: white;
    border-color: transparent;

    &:hover {
      background: darken($primary_color, 10%);
    }
  }
}
.base-timer {
  position: relative;
  width: 50px;
  height: 50px;
  float: right;
  display: flex;
  align-self: flex-end;
  justify-content: flex-end;
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
      color: rgb(29, 175, 53);
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
    width: 50px;
    height: 50px;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
  }
}

@media (max-width: 768px) {
  /* For mobile phones: */
  .base-timer {
    z-index: 100;

    &__label {
      font-size: 14px;
    }
  }
  .questionBox {
    .questionContainer {
      .optionContainerImage {
        .option {
          width: 70%;
        }
      }
    }
  }

  .quizCompleted {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
  }
}
@media screen and (min-width: 769px) {
  .questionBox {
    align-items: center;
    justify-content: center;

    .questionContainer {
      display: flex;
      flex-direction: column;
    }
  }
}
@media screen and (max-width: 768px) {
  .sidebar {
    height: auto !important;
    border-radius: 6px 6px 0px 0px;
  }
}
</style>
