window.$ = window.jQuery = $;
window.List = require('list.js');

require('bootstrap-sass');
require('bootstrap/dist/js/bootstrap');

const gmaps = require('load-google-maps-api');

module.exports = {
    loadGmaps: function() {
        return gmaps({
            key: 'AIzaSyBFnR3fcPsA9WqSAanumQhhpIejLqTXArs'
        });
    }
};
