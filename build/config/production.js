export default config => ({
  devTool: false,
  serverHost: 'localhost',
  publicPath: `http://${config.serverHost}/`,
  hashType: 'chunkhash',
  minimize: true
})
