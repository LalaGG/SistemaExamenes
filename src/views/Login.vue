<template>

  <v-container fluid :style="{'height' : '100vh','background-image': `url(${require('@/assets/png/fondo_grade.jpg')})`, 'background-size': 'cover'}">
    <v-layout align-center justify-center>
      <v-flex xs12 sm6 md3>
        <v-card class="elevation-20 login-box">
          <!-- <img src="../assets/png/logo_GRADE.png" class="avatar" /> -->
          <v-card-text>
            <v-form v-model="valid" ref="form" lazy-validation>
              <v-text-field
                prepend-icon="person"
                v-model="usuarioLogin.username"
                label="Usuario"
                type="text"
                v-on:keyup.enter="getCredenciales"
                :rules="ReglasPaciente"
                required
              >
              </v-text-field>
              <v-text-field
                prepend-icon="lock"
                v-model="usuarioLogin.password"
                :append-icon="show1 ? 'visibility' : 'visibility_off'"
                :type="show1 ? 'text' : 'password'"
                label="Contraseña"
                @click:append="show1 = !show1"
                v-on:keyup.enter="getCredenciales"
                required
                v-show="false"
              >
              </v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="getCredenciales">Ingresar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapMutations } from "vuex";
import axios from "axios";

export default {
  name: "Login",
  data() {
    return {
      valid: true,
      usuarioLogin: {
        username: "",
        password: "",
      },
      show1: false,
      ReglasPaciente: [(v) => !!v || "Este campo es necesario"],
    };
  },
  props: ["config"],
  methods: {
    ...mapMutations(["showLoading", "hideLoading", "showNotification"]),
    async getCredenciales() {
      if (this.$refs.form.validate()) {
        this.showLoading({
          title: "Accediendo a la información",
          color: "secondary",
        });
        this.usuarioLogin.password = this.usuarioLogin.username
        try {
          let response = await axios.post(
            `${this.$urlApi}User/Login`,
            this.usuarioLogin
          );
          if (response.data.success) {
            this.$session.start();
            sessionStorage.setItem("jwt", response.data.token);

            this.$session.set("user", response.data);
            if(this.$session.get('user').userType != 'adm') this.$router.push("/Examen/Principal");
            if(this.$session.get('user').userType == 'adm') this.$router.push("/");
            } else {
            this.showNotification({
              message: response.data.message,
              color: "error",
              icon: "error",
            });
          }
        } catch (error) {
          console.log(error);
        } finally {
          this.hideLoading();
        }
      }
      // this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.login-box{
    width: 330px;
    height: 350px;
    background: rgba(110, 201, 211, 0.3);
    color: #031781;
    top: 60%;
    left: 50%;
    position: absolute;
    transform: translate(-50%,-50%);
    box-sizing: border-box;
    padding: 70px 30px;
}
.avatar{
    width: 544px;
    height: 215px;
    position: absolute;
    top: -100px;
    left: -110px;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
}
</style>
