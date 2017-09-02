var webpack = require('webpack');
var path = require('path');
var Encore = require('@symfony/webpack-encore');

Encore
    .setOutputPath('web/build/')
    .setPublicPath('/build')
    .cleanupOutputBeforeBuild()

    .addEntry('js/app', './web/assets/js/app.js')
    .addEntry('js/hotels_list', './web/assets/js/hotels_list.js')
    .addEntry('js/hotel_edit', './web/assets/js/hotel_edit.js')

    .addStyleEntry('global', './web/assets/css/global.scss')
    .enableSassLoader()

    .autoProvidejQuery()
    .enableSourceMaps(!Encore.isProduction())
    .setManifestKeyPrefix('/build')
    .cleanupOutputBeforeBuild()
;

const config = Encore.getWebpackConfig();
config.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
        name: "commons",
        filename: 'js/commons.js',
        chunks: ['js/app', 'js/hotels_list', 'js/hotel_edit']
    })
);
config.resolve.alias.jquery =
    path.join(__dirname, 'node_modules/jquery/src/jquery'); // fix for datetime

module.exports = config;
