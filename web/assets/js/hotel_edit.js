let app = require('./app.js');

function gmapsInit(google) {
    this.updateHiddenFields = function(markerPosition) {
        $("#add_hotel_form_latitude").val(markerPosition.lat());
        $("#add_hotel_form_longitude").val(markerPosition.lng());
    }

    let laCity = {
        lat: 34.05,
        lng: -118.25,
    }

    this.initMap = function() {
        let $mapNode = $('#map');

        const coords = {
            lat: $mapNode.data('latitude') == 0 ?
                laCity.lat : $mapNode.data('latitude'),
            lng: $mapNode.data('longitude') == 0 ?
                laCity.lng : $mapNode.data('longitude')
        };

        let map = new google.maps.Map($mapNode.get(0), {
            zoom: 12,
            center: coords
        });

        let marker = new google.maps.Marker({
            draggable: true,
            position: coords,
            animation: google.maps.Animation.DROP,
            map: map,
            title: [coords.lat, coords.lng].join(', ')
        });

        google.maps.event.addListener(
            marker,
            'dragend',
             () => updateHiddenFields(marker.getPosition())
        );
    };

    this.initMap();
}

$(function() {
    app.loadGmaps().then(function(googleMaps) {
        gmapsInit({
            maps: googleMaps
        });
    }).catch((err) => {
      console.error(err);
    });
});
