if (__DEV__ || (!__DEV__ && !__SERVER__)) {
  require('styles/bootstrap')
  require('styles/app')
}

import(`styles/theme-${['blue', 'green', 'purple', 'red'][~~(Math.random() * 4)]}.styl`)

/* eslint-disable import/first */
import Vue from 'vue'

import router$ from 'router'
import store$ from 'store'

import 'plugins'

import App from 'views/App'
/* eslint-enable import/first */

export const router = router$
export const store = store$

if (module.hot) module.hot.accept()

// eslint-disable-next-line no-new
export const app = new Vue({
  ...App,
  router,
  store
})
