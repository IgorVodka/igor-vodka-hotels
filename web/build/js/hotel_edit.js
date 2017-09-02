webpackJsonp([1],{

/***/ "./web/assets/js/hotel_edit.js":
/*!*************************************!*\
  !*** ./web/assets/js/hotel_edit.js ***!
  \*************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {var app = __webpack_require__(/*! ./app.js */ "./web/assets/js/app.js");

function gmapsInit(google) {
    this.updateHiddenFields = function (markerPosition) {
        $("#add_hotel_form_latitude").val(markerPosition.lat());
        $("#add_hotel_form_longitude").val(markerPosition.lng());
    };

    var laCity = {
        lat: 34.05,
        lng: -118.25
    };

    this.initMap = function () {
        var $mapNode = $('#map');

        var coords = {
            lat: $mapNode.data('latitude') == 0 ? laCity.lat : $mapNode.data('latitude'),
            lng: $mapNode.data('longitude') == 0 ? laCity.lng : $mapNode.data('longitude')
        };

        var map = new google.maps.Map($mapNode.get(0), {
            zoom: 12,
            center: coords
        });

        var marker = new google.maps.Marker({
            draggable: true,
            position: coords,
            animation: google.maps.Animation.DROP,
            map: map,
            title: [coords.lat, coords.lng].join(', ')
        });

        google.maps.event.addListener(marker, 'dragend', function () {
            return updateHiddenFields(marker.getPosition());
        });
    };

    this.initMap();
}

$(function () {
    app.loadGmaps().then(function (googleMaps) {
        gmapsInit({
            maps: googleMaps
        });
    }).catch(function (err) {
        console.error(err);
    });
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ "./node_modules/jquery/src/jquery.js")))

/***/ })

},["./web/assets/js/hotel_edit.js"]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi93ZWIvYXNzZXRzL2pzL2hvdGVsX2VkaXQuanMiXSwibmFtZXMiOlsiYXBwIiwicmVxdWlyZSIsImdtYXBzSW5pdCIsImdvb2dsZSIsInVwZGF0ZUhpZGRlbkZpZWxkcyIsIm1hcmtlclBvc2l0aW9uIiwiJCIsInZhbCIsImxhdCIsImxuZyIsImxhQ2l0eSIsImluaXRNYXAiLCIkbWFwTm9kZSIsImNvb3JkcyIsImRhdGEiLCJtYXAiLCJtYXBzIiwiTWFwIiwiZ2V0Iiwiem9vbSIsImNlbnRlciIsIm1hcmtlciIsIk1hcmtlciIsImRyYWdnYWJsZSIsInBvc2l0aW9uIiwiYW5pbWF0aW9uIiwiQW5pbWF0aW9uIiwiRFJPUCIsInRpdGxlIiwiam9pbiIsImV2ZW50IiwiYWRkTGlzdGVuZXIiLCJnZXRQb3NpdGlvbiIsImxvYWRHbWFwcyIsInRoZW4iLCJnb29nbGVNYXBzIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSw2Q0FBSUEsTUFBTSxtQkFBQUMsQ0FBUSx3Q0FBUixDQUFWOztBQUVBLFNBQVNDLFNBQVQsQ0FBbUJDLE1BQW5CLEVBQTJCO0FBQ3ZCLFNBQUtDLGtCQUFMLEdBQTBCLFVBQVNDLGNBQVQsRUFBeUI7QUFDL0NDLFVBQUUsMEJBQUYsRUFBOEJDLEdBQTlCLENBQWtDRixlQUFlRyxHQUFmLEVBQWxDO0FBQ0FGLFVBQUUsMkJBQUYsRUFBK0JDLEdBQS9CLENBQW1DRixlQUFlSSxHQUFmLEVBQW5DO0FBQ0gsS0FIRDs7QUFLQSxRQUFJQyxTQUFTO0FBQ1RGLGFBQUssS0FESTtBQUVUQyxhQUFLLENBQUM7QUFGRyxLQUFiOztBQUtBLFNBQUtFLE9BQUwsR0FBZSxZQUFXO0FBQ3RCLFlBQUlDLFdBQVdOLEVBQUUsTUFBRixDQUFmOztBQUVBLFlBQU1PLFNBQVM7QUFDWEwsaUJBQUtJLFNBQVNFLElBQVQsQ0FBYyxVQUFkLEtBQTZCLENBQTdCLEdBQ0RKLE9BQU9GLEdBRE4sR0FDWUksU0FBU0UsSUFBVCxDQUFjLFVBQWQsQ0FGTjtBQUdYTCxpQkFBS0csU0FBU0UsSUFBVCxDQUFjLFdBQWQsS0FBOEIsQ0FBOUIsR0FDREosT0FBT0QsR0FETixHQUNZRyxTQUFTRSxJQUFULENBQWMsV0FBZDtBQUpOLFNBQWY7O0FBT0EsWUFBSUMsTUFBTSxJQUFJWixPQUFPYSxJQUFQLENBQVlDLEdBQWhCLENBQW9CTCxTQUFTTSxHQUFULENBQWEsQ0FBYixDQUFwQixFQUFxQztBQUMzQ0Msa0JBQU0sRUFEcUM7QUFFM0NDLG9CQUFRUDtBQUZtQyxTQUFyQyxDQUFWOztBQUtBLFlBQUlRLFNBQVMsSUFBSWxCLE9BQU9hLElBQVAsQ0FBWU0sTUFBaEIsQ0FBdUI7QUFDaENDLHVCQUFXLElBRHFCO0FBRWhDQyxzQkFBVVgsTUFGc0I7QUFHaENZLHVCQUFXdEIsT0FBT2EsSUFBUCxDQUFZVSxTQUFaLENBQXNCQyxJQUhEO0FBSWhDWixpQkFBS0EsR0FKMkI7QUFLaENhLG1CQUFPLENBQUNmLE9BQU9MLEdBQVIsRUFBYUssT0FBT0osR0FBcEIsRUFBeUJvQixJQUF6QixDQUE4QixJQUE5QjtBQUx5QixTQUF2QixDQUFiOztBQVFBMUIsZUFBT2EsSUFBUCxDQUFZYyxLQUFaLENBQWtCQyxXQUFsQixDQUNJVixNQURKLEVBRUksU0FGSixFQUdLO0FBQUEsbUJBQU1qQixtQkFBbUJpQixPQUFPVyxXQUFQLEVBQW5CLENBQU47QUFBQSxTQUhMO0FBS0gsS0E1QkQ7O0FBOEJBLFNBQUtyQixPQUFMO0FBQ0g7O0FBRURMLEVBQUUsWUFBVztBQUNUTixRQUFJaUMsU0FBSixHQUFnQkMsSUFBaEIsQ0FBcUIsVUFBU0MsVUFBVCxFQUFxQjtBQUN0Q2pDLGtCQUFVO0FBQ05jLGtCQUFNbUI7QUFEQSxTQUFWO0FBR0gsS0FKRCxFQUlHQyxLQUpILENBSVMsVUFBQ0MsR0FBRCxFQUFTO0FBQ2hCQyxnQkFBUUMsS0FBUixDQUFjRixHQUFkO0FBQ0QsS0FORDtBQU9ILENBUkQsRSIsImZpbGUiOiJqcy9ob3RlbF9lZGl0LmpzIiwic291cmNlc0NvbnRlbnQiOlsibGV0IGFwcCA9IHJlcXVpcmUoJy4vYXBwLmpzJyk7XHJcblxyXG5mdW5jdGlvbiBnbWFwc0luaXQoZ29vZ2xlKSB7XHJcbiAgICB0aGlzLnVwZGF0ZUhpZGRlbkZpZWxkcyA9IGZ1bmN0aW9uKG1hcmtlclBvc2l0aW9uKSB7XHJcbiAgICAgICAgJChcIiNhZGRfaG90ZWxfZm9ybV9sYXRpdHVkZVwiKS52YWwobWFya2VyUG9zaXRpb24ubGF0KCkpO1xyXG4gICAgICAgICQoXCIjYWRkX2hvdGVsX2Zvcm1fbG9uZ2l0dWRlXCIpLnZhbChtYXJrZXJQb3NpdGlvbi5sbmcoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgbGV0IGxhQ2l0eSA9IHtcclxuICAgICAgICBsYXQ6IDM0LjA1LFxyXG4gICAgICAgIGxuZzogLTExOC4yNSxcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaXRNYXAgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgJG1hcE5vZGUgPSAkKCcjbWFwJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvb3JkcyA9IHtcclxuICAgICAgICAgICAgbGF0OiAkbWFwTm9kZS5kYXRhKCdsYXRpdHVkZScpID09IDAgP1xyXG4gICAgICAgICAgICAgICAgbGFDaXR5LmxhdCA6ICRtYXBOb2RlLmRhdGEoJ2xhdGl0dWRlJyksXHJcbiAgICAgICAgICAgIGxuZzogJG1hcE5vZGUuZGF0YSgnbG9uZ2l0dWRlJykgPT0gMCA/XHJcbiAgICAgICAgICAgICAgICBsYUNpdHkubG5nIDogJG1hcE5vZGUuZGF0YSgnbG9uZ2l0dWRlJylcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBsZXQgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcCgkbWFwTm9kZS5nZXQoMCksIHtcclxuICAgICAgICAgICAgem9vbTogMTIsXHJcbiAgICAgICAgICAgIGNlbnRlcjogY29vcmRzXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCBtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcclxuICAgICAgICAgICAgZHJhZ2dhYmxlOiB0cnVlLFxyXG4gICAgICAgICAgICBwb3NpdGlvbjogY29vcmRzLFxyXG4gICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QLFxyXG4gICAgICAgICAgICBtYXA6IG1hcCxcclxuICAgICAgICAgICAgdGl0bGU6IFtjb29yZHMubGF0LCBjb29yZHMubG5nXS5qb2luKCcsICcpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKFxyXG4gICAgICAgICAgICBtYXJrZXIsXHJcbiAgICAgICAgICAgICdkcmFnZW5kJyxcclxuICAgICAgICAgICAgICgpID0+IHVwZGF0ZUhpZGRlbkZpZWxkcyhtYXJrZXIuZ2V0UG9zaXRpb24oKSlcclxuICAgICAgICApO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmluaXRNYXAoKTtcclxufVxyXG5cclxuJChmdW5jdGlvbigpIHtcclxuICAgIGFwcC5sb2FkR21hcHMoKS50aGVuKGZ1bmN0aW9uKGdvb2dsZU1hcHMpIHtcclxuICAgICAgICBnbWFwc0luaXQoe1xyXG4gICAgICAgICAgICBtYXBzOiBnb29nbGVNYXBzXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgIH0pO1xyXG59KTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vd2ViL2Fzc2V0cy9qcy9ob3RlbF9lZGl0LmpzIl0sInNvdXJjZVJvb3QiOiIifQ==