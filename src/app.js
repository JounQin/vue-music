import 'styles/bootstrap'
import 'styles/app'

import Vue from 'vue'

import router from 'router'
import store from 'store'

import 'plugins'

import App from 'views/App'

module.hot && module.hot.accept()

// eslint-disable-next-line no-new
export const app = new Vue({
  ...App,
  router,
  store
})

export {router, store}
