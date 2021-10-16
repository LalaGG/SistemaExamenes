<template>
  <v-container fluid fill-height class="container-personalizado">
    <v-layout align-center justify-center>
      <v-flex xs12 sm6 md3>
        <v-card class="elevation-20 login-box">
          <!-- <img src="@/assets/png/logo-grade.png" class="avatar" /> -->
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
                :rules="ReglasPaciente"
                required
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
        try {
          let response = await axios.post(
            `${this.$urlApi}User/Login`,
            this.usuarioLogin
          );
          if (response.data.success) {
            this.$session.start();
            sessionStorage.setItem("jwt", response.data.token);

            this.$session.set("user", response.data);
            this.$router.push("/");
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
.login-box {
  background: rgba(204, 205, 0, 0.5);
  color: #031781;
  top: 50%;
  left: 50%;
  position: absolute;
  transform: translate(-50%, -50%);
  box-sizing: border-box;
  padding: 40px 30px;
}
.avatar {
  width: 544px;
  height: 215px;
  position: absolute;
  top: -130px;
  left: -110px;
  -webkit-transform: scale(0.5);
  transform: scale(0.5);
}
.container-personalizado {
  background: white;
  /* background: linear-gradient(
    0deg,
    rgba(204, 205, 0, 1) 0%,
    rgba(10, 74, 0, 1) 100%
  ); */
  background-size: 100%;
  background-size: cover;
}
</style>
