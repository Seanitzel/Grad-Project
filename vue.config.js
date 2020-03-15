// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

module.exports = {
  transpileDependencies: [
    'vuetify',
  ],
  chainWebpack:          config => {
    config.resolve.alias.set('components', path.resolve('src/components'))
    config.resolve.alias.set('sections', path.resolve('src/sections'))
    config.resolve.alias.set('assets', path.resolve('src/assets'))
    config.resolve.alias.set('models', path.resolve('src/models'))
    config.resolve.alias.set('store', path.resolve('src/store'))
    config.resolve.alias.set('mixins', path.resolve('src/mixins'))
    config.resolve.alias.set('utilities', path.resolve('src/utilities'))
    config.resolve.alias.set('misc', path.resolve('src/misc'))
    config.resolve.alias.set('plugins', path.resolve('src/plugins'))
    config.resolve.alias.set('views', path.resolve('src/views'))
    config.resolve.alias.set('reporting', path.resolve('src/reporting'))
  },
}
