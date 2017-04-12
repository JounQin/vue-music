import 'styles/bootstrap'
import 'styles/app'

import {app, router, store} from './app'

import {on} from 'utils'

import {throttle} from 'lodash'

import(`styles/theme-${['blue', 'green', 'purple', 'red'][~~(Math.random() * 4)]}.styl`)

if (__PROD__) require('vconsole')

const {documentElement: docEl} = document

const resize = () => {
  store.dispatch('setSize', {winHeight: docEl.clientHeight, winWidth: docEl.clientWidth})
  docEl.style.fontSize = store.getters.fontSize + 'px'
}

on(window, 'resize', throttle(resize, 300))

resize()

router.onReady(() => app.$mount('#app'))

location.protocol === 'https:' && navigator.serviceWorker && navigator.serviceWorker.register('/service-worker.js')