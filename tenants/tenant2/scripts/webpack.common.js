const common = require('../../../scripts/webpack.common');

module.exports = () => common()
    .addHtmlWebpackPluginConfig({
        template: './src/index.html',
    });
