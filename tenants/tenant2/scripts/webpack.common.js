const common = require('../../../scripts/webpack.common');

module.exports = (env = {}) => common(env)
    .addHtmlWebpackPluginConfig({
        template: './src/index.html',
    });
