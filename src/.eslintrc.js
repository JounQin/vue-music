module.exports = {
  env: {
    browser: true,
    node: true
  },
  globals: {
    __DEV__: false,
    __PROD__: false,
    __SERVER__: false,
    __VUE_SSR_CONTEXT__: false,
    SERVER_PREFIX: false,
    INNER_SERVER: false
  }
}
