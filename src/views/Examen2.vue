<template>
    <!--container-->
<section class="container">

	<!--questionBox-->
	<div class="questionBox" id="app">

		<!-- transition -->
		<transition :duration="{ enter: 500, leave: 300 }" enter-active-class="animated zoomIn" leave-active-class="animated zoomOut" mode="out-in">

			<!--qusetionContainer-->
			<div class="questionContainer" v-if="questionIndex<quiz.questions.length && (questionIndex == 0 || !changeModule)" v-bind:key="questionIndex">

				<header>
					<h1 class="title is-6">{{quiz.questions[questionIndex].testModuleName}} - {{quiz.questions[questionIndex].testPartName}}</h1>
					<!--progress-->
					<div class="progressContainer">
						<progress class="progress is-info is-small" :value="(questionIndex/quiz.questions.length)*100" max="100">{{(questionIndex/quiz.questions.length)*100}}%</progress>
						<p>{{(questionIndex/quiz.questions.length)*100}}% complete</p>
					</div>
					<!--/progress-->
				</header>

				<!-- questionTitle -->
				<h2 class="titleContainer title">{{ quiz.questions[questionIndex].text }}</h2>

				<!-- quizOptions -->
				<div class="optionContainer">
					<div class="option" v-for="(response, index) in quiz.questions[questionIndex].answers" :class="{ 'is-selected': userResponses[questionIndex] == index}" @click="selectOption(index)"  :key="index">
						{{ index | charIndex }}. {{ response.text }}
					</div>
				</div>

				<!--quizFooter: navigation and progress-->
				<footer class="questionFooter">

					<!--pagination-->
					<nav class="pagination" role="navigation" aria-label="pagination">

						<!-- back button -->
						<!-- <a class="button" v-on:click="prev();" :disabled="questionIndex < 1">
                    Back
                  </a> -->

						<!-- next button -->
						<a class="button" :class="(userResponses[questionIndex]==null)?'':'is-active'" v-on:click=" (questionIndex == quiz.questions.length -1 ) || (quiz.questions[questionIndex+1].testModuleName == currentModule) ? next() : hideQuestions()">
                    {{ (questionIndex == quiz.questions.length -1 ) || (quiz.questions[questionIndex+1].testModuleName == currentModule) ? 'Siguiente':'Terminar' }}
                  </a>	

					</nav>
					<!--/pagination-->

				</footer>
				<!--/quizFooter-->

			</div>
			<!--/questionContainer-->

			<!--quizCompletedResult-->
			<div v-if=" questionIndex > 0 && changeModule" v-bind:key="questionIndex" class="quizCompleted has-text-centered">

				<span class="icon">
                <i class="fa" :class="1==1?'fa-check-circle-o is-active':'fa-times-circle'"></i>
              </span>

				<h2 class="title">
					Tomate un respiro 
				</h2>
				<p class="subtitle">
					da a iniciar cuando estes listo para la {{currentModule}}
				</p>
					<br>
					<a class="button" @click="next()">Iniciar <i class="fa fa-refresh"></i></a>

			</div>

			<div v-if="questionIndex > 0 && questionIndex >= quiz.questions.length" v-bind:key="questionIndex" class="quizCompleted has-text-centered">

				<span class="icon">
                <i class="fa" :class="1==1?'fa-check-circle-o is-active':'fa-times-circle'"></i>
              </span>

				<h2 class="title">
					Gracias por terminar la prueba
				</h2>
				<p class="subtitle">
					AEA
				</p>
					<br>
					<a class="button" @click="cerrarSesion()">Salir <i class="fa fa-refresh"></i></a>

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

export default {
  data: () => ({
    quiz: {},
	questionIndex: 0,
	userResponses: [],
	isActive: false,
	currentModule : "",
	changeModule : false,
	partName : ""
  }),
  filters: {
    charIndex: function(i) {
      return String.fromCharCode(97 + i);
    }
  },
  created() {
	   this.ListarExamen()
	   this.userResponseSkelaton()
  },
  methods: {
    //    ...mapMutations(["showLoading", "hideLoading", "showNotification"]),
       async ListarExamen() {
		   this.quiz = {
			   	modulos : [
					   "Modulo 1",
					   "Modulo 2"
				   ],
				questions: [
					{
						text: "What is the full form of HTTP?",
						testModuleName: "Modulo 1",
						testPartName: "Parte 1",
						answers: [
							{ text: "Hyper text transfer package" },
							{ text: "Hyper text transfer protocol" },
							{ text: "Hyphenation text test program" },
							{ text: "None of the above" }
						]
					},
					{
						text: "HTML document start and end with which tag pairs?",
						testModuleName: "Modulo 1",
						testPartName: "Parte 1",
						answers: [
							{ text: "HTML", correct: true },
							{ text: "WEB" },
							{ text: "HEAD" },
							{ text: "BODY" }
						]
					},
					{
						text: "Which tag is used to create body text in HTML?",
						testModuleName: "Modulo 1",
						testPartName: "Parte 2",
						answers: [
							{ text: "HEAD" },
							{ text: "BODY", correct: true },
							{ text: "TITLE" },
							{ text: "TEXT" }
						]
					},
					{
						text: "Outlook Express is _________",
						testModuleName: "Modulo 1",
						testPartName: "Parte 2",
						answers: [
							{ text: "E-Mail Client", correct: true },
							{ text: "Browser" },
							{
							text: "Search Engine"
							},
							{ text: "None of the above" }
						]
					},
					{
						text: "What is a search engine?",
						testModuleName: "Modulo 1",
						testPartName: "Parte 3",
						answers: [
							{ text: "A hardware component " },
							{
							text: "A machinery engine that search data"
							},
							{ text: "A web site that searches anything", correct: true },
							{ text: "A program that searches engines" }
						]
					},
					{
						text: "What does the .com domain represents?",
						testModuleName: "Modulo 1",
						testPartName: "Parte 3",
						answers: [
							{ text: "Network" },
							{ text: "Education" },
							{ text: "Commercial", correct: true },
							{ text: "None of the above" }
						]
					},
					{
						text: "In Satellite based communication, VSAT stands for? ",
						testModuleName: "Modulo 2",
						testPartName: "Parte 1",
						answers: [
							{ text: " Very Small Aperture Terminal", correct: true },
							{ text: "Varying Size Aperture Terminal " },
							{
							text: "Very Small Analog Terminal"
							},
							{ text: "None of the above" }
						]
					},
					{
						text: "What is the full form of TCP/IP? ",
						testModuleName: "Modulo 2",
						testPartName: "Parte 1",
						answers: [
							{ text: "Telephone call protocol / international protocol" },
							{
							text: "Transmission control protocol / internet protocol",
							correct: true
							},
							{ text: "Transport control protocol / internet protocol " },
							{ text: "None of the above" }
						]
					},
					{
						text: "What is the full form of HTML?",
						testModuleName: "Modulo 3",
						testPartName: "Parte 1",
						answers: [
							{
							text: "Hyper text marking language"
							},
							{ text: "Hyphenation text markup language " },
							{ text: "Hyper text markup language", correct: true },
							{ text: "Hyphenation test marking language" }
						]
					},
					{
						text: '"Yahoo", "Infoseek" and "Lycos" are _________?',
						testModuleName: "Modulo 3",
						testPartName: "Parte 1",
						answers: [
							{ text: "Browsers " },
							{ text: "Search Engines", correct: true },
							{ text: "News Group" },
							{ text: "None of the above" }
						]
					}
				]
		   }
		   this.currentModule = this.quiz.questions[this.questionIndex].testModuleName
		},
		userResponseSkelaton (){
			this.userResponses = Array(this.quiz.questions.length).fill(null)
		},
		restart() {
		this.questionIndex = 0;
		this.userResponses = Array(this.quiz.questions.length).fill(null);
		},
		selectOption(index) {
		this.$set(this.userResponses, this.questionIndex, index);
		},
		next() {
			if (this.questionIndex < this.quiz.questions.length){
				this.questionIndex++
				this.changeModule = false
			}
		},
		hideQuestions(){
			this.currentModule =  this.quiz.questions[this.questionIndex+1].testModuleName
			this.changeModule = true
		},
		cerrarSesion() {
			sessionStorage.clear();
			this.$session.destroy();
			this.$router.push("/Login");
		},
	}
}
</script>

<style lang="scss" scoped>
$trans_duration: 0.3s;
$primary_color: #3d5afe;

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

.button {
  transition: $trans_duration;
}
.title,
.subtitle {
  font-family: Montserrat, sans-serif;
  font-weight: normal;
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
  max-width: 30rem;
  width: 30rem;
  min-height: 30rem;

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
        border: none;

        color: $primary_color;
        &::-moz-progress-bar {
          background: $primary_color;
        }
        &::-webkit-progress-value {
          background: $primary_color;
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
    padding: 1.5rem;
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
        margin: 0 18px;
        margin-bottom: 12px;
        transition: $trans_duration;
        cursor: pointer;
        background-color: rgba(0, 0, 0, 0.05);
        color: rgba(0, 0, 0, 0.85);
        border: transparent 1px solid;

        &.is-selected {
          border-color: rgba(black, 0.25);
        background-color: $primary-color;
		  color : white;
        }
        &:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }
        &:active {
          transform: scaleX(0.9);
        }
      }
    }

    .questionFooter {
      background: rgba(0, 0, 0, 0.025);
      border-top: 1px solid rgba(0, 0, 0, 0.1);
      width: 100%;
      align-self: flex-end;

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
  padding: 0.5rem 1rem;
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



