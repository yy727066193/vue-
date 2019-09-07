import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

import Login from '../views/Login'

export default new Router({
  routes: [
    { path: '/', component: Login }
  ]
})
