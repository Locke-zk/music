const path = require('path')

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        img: path.resolve(__dirname, 'src/assets/img'),
        views: path.resolve(__dirname, 'src/views'),
        cpn: path.resolve(__dirname, 'src/components')
      }
    }
  }
}
