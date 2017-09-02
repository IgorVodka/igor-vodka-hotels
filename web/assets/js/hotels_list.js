let app = require('./app.js');
require('bootstrap-datetime-picker');

function gmapsInit(google) {
    var map;

    this.openBookingForm = function(hotelData) {
        $('#booking_hotelId').val(hotelData.id);
        $('#hotel-edit').attr(
            'href',
            $('#hotel-edit').data('path').replace('_', hotelData.id)
        );
        $('#booking-modal').modal('show');
    };

    this.addMarker = function(hotelData) {
        let marker = new google.maps.Marker({
            position: hotelData.coords,
            animation: google.maps.Animation.DROP,
            map: map,
            title: hotelData.name,
            metadata: {
                id: hotelData.id
            },
        });

        const selector = '#hotel-list .list-group-item[data-id=' +
                                                hotelData.id + ']';

        google.maps.event.addListener(marker, 'mouseover',
            () => $(selector).addClass('highlight')
        );
        google.maps.event.addListener(marker, 'mouseout',
            () => $(selector).removeClass('highlight')
        );
        google.maps.event.addListener(marker, 'click',
            () => openBookingForm(hotelData)
        );

        $(selector).hover(() => map.setCenter(marker.getPosition()));
        $(selector).click(() => openBookingForm(hotelData));
    };

    this.handleAllMarkers = function($parentNode) {
        $parentNode.each(function(index, node) {
            const lat = $(node).data('latitude');
            const lng = $(node).data('longitude');

            if(lat != null && lng != null) {
                addMarker({
                    coords: {
                        lat: lat,
                        lng: lng,
                    },
                    name: $('.name', $(node)).html().trim(),
                    id: $(node).data('id'),
                });
            }
        });
    };

    this.initMap = function() {
        let $mapNode = $('#map');

        const coords = {
            lat: 40,
            lng: 0
        };

        map = new google.maps.Map($mapNode.get(0), {
            zoom: 2,
            center: coords
        });

        handleAllMarkers($("#hotel-list .list li"));
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

    const today = new Date();
    const dayMs = 86400 * 1000;

    let getDateTimeSettings = function(selector) {
        let $node = $(selector);

        return {
            minView: 'month',
            autoclose: true,
            format: 'yyyy-mm-dd',
            weekStart: 1,
            initialDate: today,
            startDate: today,
            endDate: new Date(today.getTime() + 60 * dayMs),
            todayBtn: true,
            container: $('.date', $node).parent().attr('id'),
        }
    };

    const dateFields = {
        '#booking_dateIn': ['#booking_dateOut', 'setStartDate'],
        '#booking_dateOut': ['#booking_dateIn', 'setEndDate'],
    };

    for(let curSelector in dateFields) {
        var [anotherSelector, methodName] = dateFields[curSelector];
        $(curSelector)
        .datetimepicker(getDateTimeSettings(curSelector))
        .on('changeDate', function(ev) {
            $(anotherSelector).datetimepicker(methodName, ev.date);
        });
    }

    var options = {
        valueNames: [
            { data: ['id', 'latitude', 'longitude'] },
            'name',
            'price',
            'address',
        ],
    };

    var hotelList = new List('hotel-list', options);
});
