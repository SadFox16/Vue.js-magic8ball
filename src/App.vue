<template>

  <h1 class="error">{{ err }}</h1>

  <div id="main" v-if="flags.show_main" class="main">
    <h1 class="hello">Приветствую, {{ login.username }}</h1>
    <h1>Введите вопрос:</h1>
    <input type="text" v-model="question" class="question" placeholder="Введите вопрос">
    <button @click="getAnswer()" class="get_answer">Получить предсказание</button>
    <div>
      <button @click="logout()" class="logout">Выйти</button>
    </div>
    <h1 class="answer">Ответ: {{ answer }}</h1>
    <h1 class="quest_cnt">Этот вопрос задавали {{ question_cnt }} раз</h1>
  </div>


  <div id="login" v-if="flags.show_login" class="login">
      <h1>Логин:</h1>
      <input type="text" v-model="login.username" class="user_name" placeholder="Введите логин">
      <h1>Пароль:</h1>
      <input type="password" v-model="login.password" class="user_pwd" placeholder="Введите пароль">
      <div>
        <button @click="do_login()" class="login_click">Логин</button>
        <button @click="do_register()" class="register_click">Регистрация</button>
      </div>
  </div>


  <div id="register" v-if="flags.show_register" class="register">
    <div class="login">
      <h1>Придумайте логин:</h1>
      <input type="text" v-model="register.username" class="user_name" placeholder="Придумайте логин">
    </div>

    <div class="password">
      <h1>Придумайте пароль:</h1>
      <input type="password" v-model="register.password" class="user_pwd" placeholder="Придумайте пароль(8 символов, не должен совпадать с логином)">
    </div>

    <div class="password">
      <h1>Повторите пароль:</h1>
      <input type="password" v-model="register.password2" class="user_pwd" placeholder="Повторите пароль">
    </div>
    <button @click="registrate()" class="register_click">Регистрация</button>
    <button @click="back()" class="register_click">Назад</button>
  </div>
</template>

<script>
import axios from 'axios'

export default {

  data() {
    return {
      flags: {
        show_main: false,
        show_login: true,
        show_register: false,
      },
      login: {
        username: '',
        password: ''
      },
      question: '',
      answer: '',
      question_cnt: 0,
      reg_error: '',
      register: {
        username: '',
        password: '',
        password2: ''
      },
      token: '',
      err: '',
    }
  },
  created() {

  },
  mounted() {
    this.check_token()
  },

  methods: {

    do_login() {
      this.err = ''
      axios
        .post(process.env.VUE_APP_APIURL+'/login/', {
          username: this.login.username,
          password: this.login.password,
        })
        .then(response => {
          localStorage.setItem('access_token', JSON.stringify(response.data.access))
          localStorage.setItem('refresh_token', JSON.stringify(response.data.refresh))
          this.token = JSON.parse(localStorage.getItem('access_token'))
          this.flags.show_login = false
          this.flags.show_main = true
          this.flags.show_register = false
        }).catch(error => {
          console.log("Error login")
          console.log(error)
          this.err = 'Данные указаны неверно!'
          this.flags.show_login = true
          this.flags.show_main = false
          this.flags.show_register = false
        })
    },

    do_register() {
      this.err = ''
      this.flags.show_login = false
      this.flags.show_main = false
      this.flags.show_register = true
    },

    back() {
      this.err = ''
      this.flags.show_login = true
      this.flags.show_main = false
      this.flags.show_register = false
    },

    check_token() {
      this.err = ''
      this.token = JSON.parse(localStorage.getItem('access_token'))
      if (this.token) {
        axios
          .post(process.env.VUE_APP_APIURL+'api/token/verify/',
            {
              token: this.token
            })
          .then(response => {
            if (response.status == 401) {
              this.flags.show_login = true
              this.flags.show_main = false
              this.flags.show_register = false
            } else {
              this.flags.show_login = false
              this.flags.show_main = true
              this.flags.show_register = false
            }
          })
          .catch(error => {
            console.log("Error auth")
            console.log(error)
            this.err = 'Вы не авторизованы!'
          })
      } else {
        this.logout()
      }
    },

    logout() {
      this.err = ''
      localStorage.removeItem('access_token')
      this.flags.show_login = true
      this.flags.show_main = false
      this.flags.show_register = false
    },

    registrate() {
      this.err = ''
      if(this.register.password == this.register.username){
        this.err = 'Пароль не должен совпадать с логином!'
        return;
      }
      if(this.register.password.length < 8){
        this.err = 'Пароль должен состоять минимум из 8 символов!'
        return;
      }
      axios
        .post(process.env.VUE_APP_APIURL+'/register/', {
          username: this.register.username,
          password: this.register.password,
          password2: this.register.password2
        })
        .then(response => {
        })
        .catch(error => {
          console.log("Error login")
          console.log(error)
          this.flags.show_register = true
          this.reg_error = error
          this.err = 'Неверно указаны данные!'
        })
    },

    getAnswer() {
      this.err = ''
      if(this.question == ''){
        this.err = 'Вы не задали вопрос!'
        return;
      }
      axios
        .post(process.env.VUE_APP_APIURL+'/getanswer/',
          { question: this.question },
          { headers: { "Authorization": 'Bearer ' + this.token } })
        .then(response => {
          this.answer = response.data.answer
          this.question_cnt = response.data.question_cnt
          this.flags.show_main = true
        })
        .catch(error => {
          console.log("Error getAnswer")
          console.log(error)
          this.err = 'Невозможно получить ответ!'
        })
    },
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

body{
  background-color: white;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

h1.hello{
  font: italic small-caps bold 30px cursive;
}

div.main{
  font: italic small-caps bold 30px cursive;
  margin-top: 200px;
}

button.get_answer{
  background-color: #FFD700;
  height: 40px;
  margin-left: 20px;
  cursor: pointer;
}

button.logout{
  background-color: #f44336;
  height: 40px;
  width: 600px;
  margin-left: 20px;
  cursor: pointer;
}

input.question{
  height: 30px;
  width: 500px;
  font: italic small-caps bold 16px cursive;
}

div.login{
  margin-top: 200px;
  font: italic small-caps bold 30px cursive;
}

input.user_name{
  height: 30px;
  width: 500px;
  font: italic small-caps bold 16px cursive;
}

input.user_pwd{
  height: 30px;
  width: 500px;
  font: italic small-caps bold 16px cursive;
}

button.login_click{
  background-color: #FFD700;
  height: 40px;
  margin-right: 20px;
  width: 120px;
  margin-top: 20px;
  cursor: pointer;
}

button.register_click{
  background-color: #FFD700;
  height: 40px;
  margin-right: 20px;
  width: 120px;
  cursor: pointer;
}

div.register{
  margin-top: 10px;
  font: italic small-caps bold 30px cursive;
}

h1.error{
  color: #f44336; 
}
</style>
