webpackJsonp([0],{

/***/ "./node_modules/bootstrap-datetime-picker/js/bootstrap-datetimepicker.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/bootstrap-datetime-picker/js/bootstrap-datetimepicker.js ***!
  \*******************************************************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;﻿/* =========================================================
 * bootstrap-datetimepicker.js
 * =========================================================
 * Copyright 2012 Stefan Petre
 *
 * Improvements by Andrew Rowls
 * Improvements by Sébastien Malot
 * Improvements by Yun Lai
 * Improvements by Kenneth Henderick
 * Improvements by CuGBabyBeaR
 * Improvements by Christian Vaas <auspex@auspex.eu>
 *
 * Project URL : http://www.malot.fr/bootstrap-datetimepicker
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

(function(factory){
    if (true)
      !(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(/*! jquery */ "./node_modules/jquery/src/jquery.js")], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    else if (typeof exports === 'object')
      factory(require('jquery'));
    else
      factory(jQuery);

}(function($, undefined){

  // Add ECMA262-5 Array methods if not supported natively (IE8)
  if (!('indexOf' in Array.prototype)) {
    Array.prototype.indexOf = function (find, i) {
      if (i === undefined) i = 0;
      if (i < 0) i += this.length;
      if (i < 0) i = 0;
      for (var n = this.length; i < n; i++) {
        if (i in this && this[i] === find) {
          return i;
        }
      }
      return -1;
    }
  }

  // Add timezone abbreviation support for ie6+, Chrome, Firefox
  function timeZoneAbbreviation() {
    var abbreviation, date, formattedStr, i, len, matchedStrings, ref, str;
    date = (new Date()).toString();
    formattedStr = ((ref = date.split('(')[1]) != null ? ref.slice(0, -1) : 0) || date.split(' ');
    if (formattedStr instanceof Array) {
      matchedStrings = [];
      for (var i = 0, len = formattedStr.length; i < len; i++) {
        str = formattedStr[i];
        if ((abbreviation = (ref = str.match(/\b[A-Z]+\b/)) !== null) ? ref[0] : 0) {
          matchedStrings.push(abbreviation);
        }
      }
      formattedStr = matchedStrings.pop();
    }
    return formattedStr;
  }

  function UTCDate() {
    return new Date(Date.UTC.apply(Date, arguments));
  }

  // Picker object
  var Datetimepicker = function (element, options) {
    var that = this;

    this.element = $(element);

    // add container for single page application
    // when page switch the datetimepicker div will be removed also.
    this.container = options.container || 'body';

    this.language = options.language || this.element.data('date-language') || 'en';
    this.language = this.language in dates ? this.language : this.language.split('-')[0]; // fr-CA fallback to fr
    this.language = this.language in dates ? this.language : 'en';
    this.isRTL = dates[this.language].rtl || false;
    this.formatType = options.formatType || this.element.data('format-type') || 'standard';
    this.format = DPGlobal.parseFormat(options.format || this.element.data('date-format') || dates[this.language].format || DPGlobal.getDefaultFormat(this.formatType, 'input'), this.formatType);
    this.isInline = false;
    this.isVisible = false;
    this.isInput = this.element.is('input');
    this.fontAwesome = options.fontAwesome || this.element.data('font-awesome') || false;

    this.bootcssVer = options.bootcssVer || (this.isInput ? (this.element.is('.form-control') ? 3 : 2) : ( this.bootcssVer = this.element.is('.input-group') ? 3 : 2 ));

    this.component = this.element.is('.date') ? ( this.bootcssVer === 3 ? this.element.find('.input-group-addon .glyphicon-th, .input-group-addon .glyphicon-time, .input-group-addon .glyphicon-remove, .input-group-addon .glyphicon-calendar, .input-group-addon .fa-calendar, .input-group-addon .fa-clock-o').parent() : this.element.find('.add-on .icon-th, .add-on .icon-time, .add-on .icon-calendar, .add-on .fa-calendar, .add-on .fa-clock-o').parent()) : false;
    this.componentReset = this.element.is('.date') ? ( this.bootcssVer === 3 ? this.element.find('.input-group-addon .glyphicon-remove, .input-group-addon .fa-times').parent():this.element.find('.add-on .icon-remove, .add-on .fa-times').parent()) : false;
    this.hasInput = this.component && this.element.find('input').length;
    if (this.component && this.component.length === 0) {
      this.component = false;
    }
    this.linkField = options.linkField || this.element.data('link-field') || false;
    this.linkFormat = DPGlobal.parseFormat(options.linkFormat || this.element.data('link-format') || DPGlobal.getDefaultFormat(this.formatType, 'link'), this.formatType);
    this.minuteStep = options.minuteStep || this.element.data('minute-step') || 5;
    this.pickerPosition = options.pickerPosition || this.element.data('picker-position') || 'bottom-right';
    this.showMeridian = options.showMeridian || this.element.data('show-meridian') || false;
    this.initialDate = options.initialDate || new Date();
    this.zIndex = options.zIndex || this.element.data('z-index') || undefined;
    this.title = typeof options.title === 'undefined' ? false : options.title;
    this.timezone = options.timezone || timeZoneAbbreviation();

    this.icons = {
      leftArrow: this.fontAwesome ? 'fa-arrow-left' : (this.bootcssVer === 3 ? 'glyphicon-arrow-left' : 'icon-arrow-left'),
      rightArrow: this.fontAwesome ? 'fa-arrow-right' : (this.bootcssVer === 3 ? 'glyphicon-arrow-right' : 'icon-arrow-right')
    }
    this.icontype = this.fontAwesome ? 'fa' : 'glyphicon';

    this._attachEvents();

    this.clickedOutside = function (e) {
        // Clicked outside the datetimepicker, hide it
        if ($(e.target).closest('.datetimepicker').length === 0) {
            that.hide();
        }
    }

    this.formatViewType = 'datetime';
    if ('formatViewType' in options) {
      this.formatViewType = options.formatViewType;
    } else if ('formatViewType' in this.element.data()) {
      this.formatViewType = this.element.data('formatViewType');
    }

    this.minView = 0;
    if ('minView' in options) {
      this.minView = options.minView;
    } else if ('minView' in this.element.data()) {
      this.minView = this.element.data('min-view');
    }
    this.minView = DPGlobal.convertViewMode(this.minView);

    this.maxView = DPGlobal.modes.length - 1;
    if ('maxView' in options) {
      this.maxView = options.maxView;
    } else if ('maxView' in this.element.data()) {
      this.maxView = this.element.data('max-view');
    }
    this.maxView = DPGlobal.convertViewMode(this.maxView);

    this.wheelViewModeNavigation = false;
    if ('wheelViewModeNavigation' in options) {
      this.wheelViewModeNavigation = options.wheelViewModeNavigation;
    } else if ('wheelViewModeNavigation' in this.element.data()) {
      this.wheelViewModeNavigation = this.element.data('view-mode-wheel-navigation');
    }

    this.wheelViewModeNavigationInverseDirection = false;

    if ('wheelViewModeNavigationInverseDirection' in options) {
      this.wheelViewModeNavigationInverseDirection = options.wheelViewModeNavigationInverseDirection;
    } else if ('wheelViewModeNavigationInverseDirection' in this.element.data()) {
      this.wheelViewModeNavigationInverseDirection = this.element.data('view-mode-wheel-navigation-inverse-dir');
    }

    this.wheelViewModeNavigationDelay = 100;
    if ('wheelViewModeNavigationDelay' in options) {
      this.wheelViewModeNavigationDelay = options.wheelViewModeNavigationDelay;
    } else if ('wheelViewModeNavigationDelay' in this.element.data()) {
      this.wheelViewModeNavigationDelay = this.element.data('view-mode-wheel-navigation-delay');
    }

    this.startViewMode = 2;
    if ('startView' in options) {
      this.startViewMode = options.startView;
    } else if ('startView' in this.element.data()) {
      this.startViewMode = this.element.data('start-view');
    }
    this.startViewMode = DPGlobal.convertViewMode(this.startViewMode);
    this.viewMode = this.startViewMode;

    this.viewSelect = this.minView;
    if ('viewSelect' in options) {
      this.viewSelect = options.viewSelect;
    } else if ('viewSelect' in this.element.data()) {
      this.viewSelect = this.element.data('view-select');
    }
    this.viewSelect = DPGlobal.convertViewMode(this.viewSelect);

    this.forceParse = true;
    if ('forceParse' in options) {
      this.forceParse = options.forceParse;
    } else if ('dateForceParse' in this.element.data()) {
      this.forceParse = this.element.data('date-force-parse');
    }
    var template = this.bootcssVer === 3 ? DPGlobal.templateV3 : DPGlobal.template;
    while (template.indexOf('{iconType}') !== -1) {
      template = template.replace('{iconType}', this.icontype);
    }
    while (template.indexOf('{leftArrow}') !== -1) {
      template = template.replace('{leftArrow}', this.icons.leftArrow);
    }
    while (template.indexOf('{rightArrow}') !== -1) {
      template = template.replace('{rightArrow}', this.icons.rightArrow);
    }
    this.picker = $(template)
      .appendTo(this.isInline ? this.element : this.container) // 'body')
      .on({
        click:     $.proxy(this.click, this),
        mousedown: $.proxy(this.mousedown, this)
      });

    if (this.wheelViewModeNavigation) {
      if ($.fn.mousewheel) {
        this.picker.on({mousewheel: $.proxy(this.mousewheel, this)});
      } else {
        console.log('Mouse Wheel event is not supported. Please include the jQuery Mouse Wheel plugin before enabling this option');
      }
    }

    if (this.isInline) {
      this.picker.addClass('datetimepicker-inline');
    } else {
      this.picker.addClass('datetimepicker-dropdown-' + this.pickerPosition + ' dropdown-menu');
    }
    if (this.isRTL) {
      this.picker.addClass('datetimepicker-rtl');
      var selector = this.bootcssVer === 3 ? '.prev span, .next span' : '.prev i, .next i';
      this.picker.find(selector).toggleClass(this.icons.leftArrow + ' ' + this.icons.rightArrow);
    }

    $(document).on('mousedown touchend', this.clickedOutside);

    this.autoclose = false;
    if ('autoclose' in options) {
      this.autoclose = options.autoclose;
    } else if ('dateAutoclose' in this.element.data()) {
      this.autoclose = this.element.data('date-autoclose');
    }

    this.keyboardNavigation = true;
    if ('keyboardNavigation' in options) {
      this.keyboardNavigation = options.keyboardNavigation;
    } else if ('dateKeyboardNavigation' in this.element.data()) {
      this.keyboardNavigation = this.element.data('date-keyboard-navigation');
    }

    this.todayBtn = (options.todayBtn || this.element.data('date-today-btn') || false);
    this.clearBtn = (options.clearBtn || this.element.data('date-clear-btn') || false);
    this.todayHighlight = (options.todayHighlight || this.element.data('date-today-highlight') || false);

    this.weekStart = 0;
    if (typeof options.weekStart !== 'undefined') {
      this.weekStart = options.weekStart;
    } else if (typeof this.element.data('date-weekstart') !== 'undefined') {
      this.weekStart = this.element.data('date-weekstart');
    } else if (typeof dates[this.language].weekStart !== 'undefined') {
      this.weekStart = dates[this.language].weekStart;
    }
    this.weekStart = this.weekStart % 7;
    this.weekEnd = ((this.weekStart + 6) % 7);
    this.onRenderDay = function (date) {
      var render = (options.onRenderDay || function () { return []; })(date);
      if (typeof render === 'string') {
        render = [render];
      }
      var res = ['day'];
      return res.concat((render ? render : []));
    };
    this.onRenderHour = function (date) {
      var render = (options.onRenderHour || function () { return []; })(date);
      var res = ['hour'];
      if (typeof render === 'string') {
        render = [render];
      }
      return res.concat((render ? render : []));
    };
    this.onRenderMinute = function (date) {
      var render = (options.onRenderMinute || function () { return []; })(date);
      var res = ['minute'];
      if (typeof render === 'string') {
        render = [render];
      }
      if (date < this.startDate || date > this.endDate) {
        res.push('disabled');
      } else if (Math.floor(this.date.getUTCMinutes() / this.minuteStep) === Math.floor(date.getUTCMinutes() / this.minuteStep)) {
        res.push('active');
      }
      return res.concat((render ? render : []));
    };
    this.onRenderYear = function (date) {
      var render = (options.onRenderYear || function () { return []; })(date);
      var res = ['year'];
      if (typeof render === 'string') {
        render = [render];
      }
      if (this.date.getUTCFullYear() === date.getUTCFullYear()) {
        res.push('active');
      }
      var currentYear = date.getUTCFullYear();
      var endYear = this.endDate.getUTCFullYear();
      if (date < this.startDate || currentYear > endYear) {
        res.push('disabled');
      }
      return res.concat((render ? render : []));
    }
    this.onRenderMonth = function (date) {
      var render = (options.onRenderMonth || function () { return []; })(date);
      var res = ['month'];
      if (typeof render === 'string') {
        render = [render];
      }
      return res.concat((render ? render : []));
    }
    this.startDate = new Date(-8639968443048000);
    this.endDate = new Date(8639968443048000);
    this.datesDisabled = [];
    this.daysOfWeekDisabled = [];
    this.setStartDate(options.startDate || this.element.data('date-startdate'));
    this.setEndDate(options.endDate || this.element.data('date-enddate'));
    this.setDatesDisabled(options.datesDisabled || this.element.data('date-dates-disabled'));
    this.setDaysOfWeekDisabled(options.daysOfWeekDisabled || this.element.data('date-days-of-week-disabled'));
    this.setMinutesDisabled(options.minutesDisabled || this.element.data('date-minute-disabled'));
    this.setHoursDisabled(options.hoursDisabled || this.element.data('date-hour-disabled'));
    this.fillDow();
    this.fillMonths();
    this.update();
    this.showMode();

    if (this.isInline) {
      this.show();
    }
  };

  Datetimepicker.prototype = {
    constructor: Datetimepicker,

    _events:       [],
    _attachEvents: function () {
      this._detachEvents();
      if (this.isInput) { // single input
        this._events = [
          [this.element, {
            focus:   $.proxy(this.show, this),
            keyup:   $.proxy(this.update, this),
            keydown: $.proxy(this.keydown, this)
          }]
        ];
      }
      else if (this.component && this.hasInput) { // component: input + button
        this._events = [
          // For components that are not readonly, allow keyboard nav
          [this.element.find('input'), {
            focus:   $.proxy(this.show, this),
            keyup:   $.proxy(this.update, this),
            keydown: $.proxy(this.keydown, this)
          }],
          [this.component, {
            click: $.proxy(this.show, this)
          }]
        ];
        if (this.componentReset) {
          this._events.push([
            this.componentReset,
            {click: $.proxy(this.reset, this)}
          ]);
        }
      }
      else if (this.element.is('div')) {  // inline datetimepicker
        this.isInline = true;
      }
      else {
        this._events = [
          [this.element, {
            click: $.proxy(this.show, this)
          }]
        ];
      }
      for (var i = 0, el, ev; i < this._events.length; i++) {
        el = this._events[i][0];
        ev = this._events[i][1];
        el.on(ev);
      }
    },

    _detachEvents: function () {
      for (var i = 0, el, ev; i < this._events.length; i++) {
        el = this._events[i][0];
        ev = this._events[i][1];
        el.off(ev);
      }
      this._events = [];
    },

    show: function (e) {
      this.picker.show();
      this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
      if (this.forceParse) {
        this.update();
      }
      this.place();
      $(window).on('resize', $.proxy(this.place, this));
      if (e) {
        e.stopPropagation();
        e.preventDefault();
      }
      this.isVisible = true;
      this.element.trigger({
        type: 'show',
        date: this.date
      });
    },

    hide: function () {
      if (!this.isVisible) return;
      if (this.isInline) return;
      this.picker.hide();
      $(window).off('resize', this.place);
      this.viewMode = this.startViewMode;
      this.showMode();
      if (!this.isInput) {
        $(document).off('mousedown', this.hide);
      }

      if (
        this.forceParse &&
          (
            this.isInput && this.element.val() ||
              this.hasInput && this.element.find('input').val()
            )
        )
        this.setValue();
      this.isVisible = false;
      this.element.trigger({
        type: 'hide',
        date: this.date
      });
    },

    remove: function () {
      this._detachEvents();
      $(document).off('mousedown', this.clickedOutside);
      this.picker.remove();
      delete this.picker;
      delete this.element.data().datetimepicker;
    },

    getDate: function () {
      var d = this.getUTCDate();
      if (d === null) {
        return null;
      }
      return new Date(d.getTime() + (d.getTimezoneOffset() * 60000));
    },

    getUTCDate: function () {
      return this.date;
    },

    getInitialDate: function () {
      return this.initialDate
    },

    setInitialDate: function (initialDate) {
      this.initialDate = initialDate;
    },

    setDate: function (d) {
      this.setUTCDate(new Date(d.getTime() - (d.getTimezoneOffset() * 60000)));
    },

    setUTCDate: function (d) {
      if (d >= this.startDate && d <= this.endDate) {
        this.date = d;
        this.setValue();
        this.viewDate = this.date;
        this.fill();
      } else {
        this.element.trigger({
          type:      'outOfRange',
          date:      d,
          startDate: this.startDate,
          endDate:   this.endDate
        });
      }
    },

    setFormat: function (format) {
      this.format = DPGlobal.parseFormat(format, this.formatType);
      var element;
      if (this.isInput) {
        element = this.element;
      } else if (this.component) {
        element = this.element.find('input');
      }
      if (element && element.val()) {
        this.setValue();
      }
    },

    setValue: function () {
      var formatted = this.getFormattedDate();
      if (!this.isInput) {
        if (this.component) {
          this.element.find('input').val(formatted);
        }
        this.element.data('date', formatted);
      } else {
        this.element.val(formatted);
      }
      if (this.linkField) {
        $('#' + this.linkField).val(this.getFormattedDate(this.linkFormat));
      }
    },

    getFormattedDate: function (format) {
      format = format || this.format;
      return DPGlobal.formatDate(this.date, format, this.language, this.formatType, this.timezone);
    },

    setStartDate: function (startDate) {
      this.startDate = startDate || this.startDate;
      if (this.startDate.valueOf() !== 8639968443048000) {
        this.startDate = DPGlobal.parseDate(this.startDate, this.format, this.language, this.formatType, this.timezone);
      }
      this.update();
      this.updateNavArrows();
    },

    setEndDate: function (endDate) {
      this.endDate = endDate || this.endDate;
      if (this.endDate.valueOf() !== 8639968443048000) {
        this.endDate = DPGlobal.parseDate(this.endDate, this.format, this.language, this.formatType, this.timezone);
      }
      this.update();
      this.updateNavArrows();
    },

    setDatesDisabled: function (datesDisabled) {
      this.datesDisabled = datesDisabled || [];
      if (!$.isArray(this.datesDisabled)) {
        this.datesDisabled = this.datesDisabled.split(/,\s*/);
      }
      var mThis = this;
      this.datesDisabled = $.map(this.datesDisabled, function (d) {
        return DPGlobal.parseDate(d, mThis.format, mThis.language, mThis.formatType, mThis.timezone).toDateString();
      });
      this.update();
      this.updateNavArrows();
    },

    setTitle: function (selector, value) {
      return this.picker.find(selector)
        .find('th:eq(1)')
        .text(this.title === false ? value : this.title);
    },

    setDaysOfWeekDisabled: function (daysOfWeekDisabled) {
      this.daysOfWeekDisabled = daysOfWeekDisabled || [];
      if (!$.isArray(this.daysOfWeekDisabled)) {
        this.daysOfWeekDisabled = this.daysOfWeekDisabled.split(/,\s*/);
      }
      this.daysOfWeekDisabled = $.map(this.daysOfWeekDisabled, function (d) {
        return parseInt(d, 10);
      });
      this.update();
      this.updateNavArrows();
    },

    setMinutesDisabled: function (minutesDisabled) {
      this.minutesDisabled = minutesDisabled || [];
      if (!$.isArray(this.minutesDisabled)) {
        this.minutesDisabled = this.minutesDisabled.split(/,\s*/);
      }
      this.minutesDisabled = $.map(this.minutesDisabled, function (d) {
        return parseInt(d, 10);
      });
      this.update();
      this.updateNavArrows();
    },

    setHoursDisabled: function (hoursDisabled) {
      this.hoursDisabled = hoursDisabled || [];
      if (!$.isArray(this.hoursDisabled)) {
        this.hoursDisabled = this.hoursDisabled.split(/,\s*/);
      }
      this.hoursDisabled = $.map(this.hoursDisabled, function (d) {
        return parseInt(d, 10);
      });
      this.update();
      this.updateNavArrows();
    },

    place: function () {
      if (this.isInline) return;

      if (!this.zIndex) {
        var index_highest = 0;
        $('div').each(function () {
          var index_current = parseInt($(this).css('zIndex'), 10);
          if (index_current > index_highest) {
            index_highest = index_current;
          }
        });
        this.zIndex = index_highest + 10;
      }

      var offset, top, left, containerOffset;
      if (this.container instanceof $) {
        containerOffset = this.container.offset();
      } else {
        containerOffset = $(this.container).offset();
      }

      if (this.component) {
        offset = this.component.offset();
        left = offset.left;
        if (this.pickerPosition === 'bottom-left' || this.pickerPosition === 'top-left') {
          left += this.component.outerWidth() - this.picker.outerWidth();
        }
      } else {
        offset = this.element.offset();
        left = offset.left;
        if (this.pickerPosition === 'bottom-left' || this.pickerPosition === 'top-left') {
          left += this.element.outerWidth() - this.picker.outerWidth();
        }
      }

      var bodyWidth = document.body.clientWidth || window.innerWidth;
      if (left + 220 > bodyWidth) {
        left = bodyWidth - 220;
      }

      if (this.pickerPosition === 'top-left' || this.pickerPosition === 'top-right') {
        top = offset.top - this.picker.outerHeight();
      } else {
        top = offset.top + this.height;
      }

      top = top - containerOffset.top;
      left = left - containerOffset.left;

      this.picker.css({
        top:    top,
        left:   left,
        zIndex: this.zIndex
      });
    },

    hour_minute: "^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]",

    update: function () {
      var date, fromArgs = false;
      if (arguments && arguments.length && (typeof arguments[0] === 'string' || arguments[0] instanceof Date)) {
        date = arguments[0];
        fromArgs = true;
      } else {
        date = (this.isInput ? this.element.val() : this.element.find('input').val()) || this.element.data('date') || this.initialDate;
        if (typeof date === 'string') {
          date = date.replace(/^\s+|\s+$/g,'');
        }
      }

      if (!date) {
        date = new Date();
        fromArgs = false;
      }

      if (typeof date === "string") {
        if (new RegExp(this.hour_minute).test(date) || new RegExp(this.hour_minute + ":[0-5][0-9]").test(date)) {
          date = this.getDate()
        }
      }

      this.date = DPGlobal.parseDate(date, this.format, this.language, this.formatType, this.timezone);

      if (fromArgs) this.setValue();

      if (this.date < this.startDate) {
        this.viewDate = new Date(this.startDate);
      } else if (this.date > this.endDate) {
        this.viewDate = new Date(this.endDate);
      } else {
        this.viewDate = new Date(this.date);
      }
      this.fill();
    },

    fillDow: function () {
      var dowCnt = this.weekStart,
        html = '<tr>';
      while (dowCnt < this.weekStart + 7) {
        html += '<th class="dow">' + dates[this.language].daysMin[(dowCnt++) % 7] + '</th>';
      }
      html += '</tr>';
      this.picker.find('.datetimepicker-days thead').append(html);
    },

    fillMonths: function () {
      var html = '';
      var d = new Date(this.viewDate);
      for (var i = 0; i < 12; i++) {
        d.setUTCMonth(i);
        var classes = this.onRenderMonth(d);
        html += '<span class="' + classes.join(' ') + '">' + dates[this.language].monthsShort[i] + '</span>';
      }
      this.picker.find('.datetimepicker-months td').html(html);
    },

    fill: function () {
      if (!this.date || !this.viewDate) {
        return;
      }
      var d = new Date(this.viewDate),
        year = d.getUTCFullYear(),
        month = d.getUTCMonth(),
        dayMonth = d.getUTCDate(),
        hours = d.getUTCHours(),
        startYear = this.startDate.getUTCFullYear(),
        startMonth = this.startDate.getUTCMonth(),
        endYear = this.endDate.getUTCFullYear(),
        endMonth = this.endDate.getUTCMonth() + 1,
        currentDate = (new UTCDate(this.date.getUTCFullYear(), this.date.getUTCMonth(), this.date.getUTCDate())).valueOf(),
        today = new Date();
      this.setTitle('.datetimepicker-days', dates[this.language].months[month] + ' ' + year)
      if (this.formatViewType === 'time') {
        var formatted = this.getFormattedDate();
        this.setTitle('.datetimepicker-hours', formatted);
        this.setTitle('.datetimepicker-minutes', formatted);
      } else {
        this.setTitle('.datetimepicker-hours', dayMonth + ' ' + dates[this.language].months[month] + ' ' + year);
        this.setTitle('.datetimepicker-minutes', dayMonth + ' ' + dates[this.language].months[month] + ' ' + year);
      }
      this.picker.find('tfoot th.today')
        .text(dates[this.language].today || dates['en'].today)
        .toggle(this.todayBtn !== false);
      this.picker.find('tfoot th.clear')
        .text(dates[this.language].clear || dates['en'].clear)
        .toggle(this.clearBtn !== false);
      this.updateNavArrows();
      this.fillMonths();
      var prevMonth = UTCDate(year, month - 1, 28, 0, 0, 0, 0),
        day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
      prevMonth.setUTCDate(day);
      prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.weekStart + 7) % 7);
      var nextMonth = new Date(prevMonth);
      nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
      nextMonth = nextMonth.valueOf();
      var html = [];
      var classes;
      while (prevMonth.valueOf() < nextMonth) {
        if (prevMonth.getUTCDay() === this.weekStart) {
          html.push('<tr>');
        }
        classes = this.onRenderDay(prevMonth);
        if (prevMonth.getUTCFullYear() < year || (prevMonth.getUTCFullYear() === year && prevMonth.getUTCMonth() < month)) {
          classes.push('old');
        } else if (prevMonth.getUTCFullYear() > year || (prevMonth.getUTCFullYear() === year && prevMonth.getUTCMonth() > month)) {
          classes.push('new');
        }
        // Compare internal UTC date with local today, not UTC today
        if (this.todayHighlight &&
          prevMonth.getUTCFullYear() === today.getFullYear() &&
          prevMonth.getUTCMonth() === today.getMonth() &&
          prevMonth.getUTCDate() === today.getDate()) {
          classes.push('today');
        }
        if (prevMonth.valueOf() === currentDate) {
          classes.push('active');
        }
        if ((prevMonth.valueOf() + 86400000) <= this.startDate || prevMonth.valueOf() > this.endDate ||
          $.inArray(prevMonth.getUTCDay(), this.daysOfWeekDisabled) !== -1 ||
          $.inArray(prevMonth.toDateString(), this.datesDisabled) !== -1) {
          classes.push('disabled');
        }
        html.push('<td class="' + classes.join(' ') + '">' + prevMonth.getUTCDate() + '</td>');
        if (prevMonth.getUTCDay() === this.weekEnd) {
          html.push('</tr>');
        }
        prevMonth.setUTCDate(prevMonth.getUTCDate() + 1);
      }
      this.picker.find('.datetimepicker-days tbody').empty().append(html.join(''));

      html = [];
      var txt = '', meridian = '', meridianOld = '';
      var hoursDisabled = this.hoursDisabled || [];
      d = new Date(this.viewDate)
      for (var i = 0; i < 24; i++) {
        d.setUTCHours(i);
        classes = this.onRenderHour(d);
        if (hoursDisabled.indexOf(i) !== -1) {
          classes.push('disabled');
        }
        var actual = UTCDate(year, month, dayMonth, i);
        // We want the previous hour for the startDate
        if ((actual.valueOf() + 3600000) <= this.startDate || actual.valueOf() > this.endDate) {
          classes.push('disabled');
        } else if (hours === i) {
          classes.push('active');
        }
        if (this.showMeridian && dates[this.language].meridiem.length === 2) {
          meridian = (i < 12 ? dates[this.language].meridiem[0] : dates[this.language].meridiem[1]);
          if (meridian !== meridianOld) {
            if (meridianOld !== '') {
              html.push('</fieldset>');
            }
            html.push('<fieldset class="hour"><legend>' + meridian.toUpperCase() + '</legend>');
          }
          meridianOld = meridian;
          txt = (i % 12 ? i % 12 : 12);
          if (i < 12) {
            classes.push('hour_am');
          } else {
            classes.push('hour_pm');
          }
          html.push('<span class="' + classes.join(' ') + '">' + txt + '</span>');
          if (i === 23) {
            html.push('</fieldset>');
          }
        } else {
          txt = i + ':00';
          html.push('<span class="' + classes.join(' ') + '">' + txt + '</span>');
        }
      }
      this.picker.find('.datetimepicker-hours td').html(html.join(''));

      html = [];
      txt = '';
      meridian = '';
      meridianOld = '';
      var minutesDisabled = this.minutesDisabled || [];
      d = new Date(this.viewDate);
      for (var i = 0; i < 60; i += this.minuteStep) {
        if (minutesDisabled.indexOf(i) !== -1) continue;
        d.setUTCMinutes(i);
        d.setUTCSeconds(0);
        classes = this.onRenderMinute(d);
        if (this.showMeridian && dates[this.language].meridiem.length === 2) {
          meridian = (hours < 12 ? dates[this.language].meridiem[0] : dates[this.language].meridiem[1]);
          if (meridian !== meridianOld) {
            if (meridianOld !== '') {
              html.push('</fieldset>');
            }
            html.push('<fieldset class="minute"><legend>' + meridian.toUpperCase() + '</legend>');
          }
          meridianOld = meridian;
          txt = (hours % 12 ? hours % 12 : 12);
          html.push('<span class="' + classes.join(' ') + '">' + txt + ':' + (i < 10 ? '0' + i : i) + '</span>');
          if (i === 59) {
            html.push('</fieldset>');
          }
        } else {
          txt = i + ':00';
          html.push('<span class="' + classes.join(' ') + '">' + hours + ':' + (i < 10 ? '0' + i : i) + '</span>');
        }
      }
      this.picker.find('.datetimepicker-minutes td').html(html.join(''));

      var currentYear = this.date.getUTCFullYear();
      var months = this.setTitle('.datetimepicker-months', year)
        .end()
        .find('.month').removeClass('active');
      if (currentYear === year) {
        // getUTCMonths() returns 0 based, and we need to select the next one
        // To cater bootstrap 2 we don't need to select the next one
        months.eq(this.date.getUTCMonth()).addClass('active');
      }
      if (year < startYear || year > endYear) {
        months.addClass('disabled');
      }
      if (year === startYear) {
        months.slice(0, startMonth).addClass('disabled');
      }
      if (year === endYear) {
        months.slice(endMonth).addClass('disabled');
      }

      html = '';
      year = parseInt(year / 10, 10) * 10;
      var yearCont = this.setTitle('.datetimepicker-years', year + '-' + (year + 9))
        .end()
        .find('td');
      year -= 1;
      d = new Date(this.viewDate);
      for (var i = -1; i < 11; i++) {
        d.setUTCFullYear(year);
        classes = this.onRenderYear(d);
        if (i === -1 || i === 10) {
          classes.push(old);
        }
        html += '<span class="' + classes.join(' ') + '">' + year + '</span>';
        year += 1;
      }
      yearCont.html(html);
      this.place();
    },

    updateNavArrows: function () {
      var d = new Date(this.viewDate),
        year = d.getUTCFullYear(),
        month = d.getUTCMonth(),
        day = d.getUTCDate(),
        hour = d.getUTCHours();
      switch (this.viewMode) {
        case 0:
          if (year <= this.startDate.getUTCFullYear()
            && month <= this.startDate.getUTCMonth()
            && day <= this.startDate.getUTCDate()
            && hour <= this.startDate.getUTCHours()) {
            this.picker.find('.prev').css({visibility: 'hidden'});
          } else {
            this.picker.find('.prev').css({visibility: 'visible'});
          }
          if (year >= this.endDate.getUTCFullYear()
            && month >= this.endDate.getUTCMonth()
            && day >= this.endDate.getUTCDate()
            && hour >= this.endDate.getUTCHours()) {
            this.picker.find('.next').css({visibility: 'hidden'});
          } else {
            this.picker.find('.next').css({visibility: 'visible'});
          }
          break;
        case 1:
          if (year <= this.startDate.getUTCFullYear()
            && month <= this.startDate.getUTCMonth()
            && day <= this.startDate.getUTCDate()) {
            this.picker.find('.prev').css({visibility: 'hidden'});
          } else {
            this.picker.find('.prev').css({visibility: 'visible'});
          }
          if (year >= this.endDate.getUTCFullYear()
            && month >= this.endDate.getUTCMonth()
            && day >= this.endDate.getUTCDate()) {
            this.picker.find('.next').css({visibility: 'hidden'});
          } else {
            this.picker.find('.next').css({visibility: 'visible'});
          }
          break;
        case 2:
          if (year <= this.startDate.getUTCFullYear()
            && month <= this.startDate.getUTCMonth()) {
            this.picker.find('.prev').css({visibility: 'hidden'});
          } else {
            this.picker.find('.prev').css({visibility: 'visible'});
          }
          if (year >= this.endDate.getUTCFullYear()
            && month >= this.endDate.getUTCMonth()) {
            this.picker.find('.next').css({visibility: 'hidden'});
          } else {
            this.picker.find('.next').css({visibility: 'visible'});
          }
          break;
        case 3:
        case 4:
          if (year <= this.startDate.getUTCFullYear()) {
            this.picker.find('.prev').css({visibility: 'hidden'});
          } else {
            this.picker.find('.prev').css({visibility: 'visible'});
          }
          if (year >= this.endDate.getUTCFullYear()) {
            this.picker.find('.next').css({visibility: 'hidden'});
          } else {
            this.picker.find('.next').css({visibility: 'visible'});
          }
          break;
      }
    },

    mousewheel: function (e) {

      e.preventDefault();
      e.stopPropagation();

      if (this.wheelPause) {
        return;
      }

      this.wheelPause = true;

      var originalEvent = e.originalEvent;

      var delta = originalEvent.wheelDelta;

      var mode = delta > 0 ? 1 : (delta === 0) ? 0 : -1;

      if (this.wheelViewModeNavigationInverseDirection) {
        mode = -mode;
      }

      this.showMode(mode);

      setTimeout($.proxy(function () {

        this.wheelPause = false

      }, this), this.wheelViewModeNavigationDelay);

    },

    click: function (e) {
      e.stopPropagation();
      e.preventDefault();
      var target = $(e.target).closest('span, td, th, legend');
      if (target.is('.' + this.icontype)) {
        target = $(target).parent().closest('span, td, th, legend');
      }
      if (target.length === 1) {
        if (target.is('.disabled')) {
          this.element.trigger({
            type:      'outOfRange',
            date:      this.viewDate,
            startDate: this.startDate,
            endDate:   this.endDate
          });
          return;
        }
        switch (target[0].nodeName.toLowerCase()) {
          case 'th':
            switch (target[0].className) {
              case 'switch':
                this.showMode(1);
                break;
              case 'prev':
              case 'next':
                var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className === 'prev' ? -1 : 1);
                switch (this.viewMode) {
                  case 0:
                    this.viewDate = this.moveHour(this.viewDate, dir);
                    break;
                  case 1:
                    this.viewDate = this.moveDate(this.viewDate, dir);
                    break;
                  case 2:
                    this.viewDate = this.moveMonth(this.viewDate, dir);
                    break;
                  case 3:
                  case 4:
                    this.viewDate = this.moveYear(this.viewDate, dir);
                    break;
                }
                this.fill();
                this.element.trigger({
                  type:      target[0].className + ':' + this.convertViewModeText(this.viewMode),
                  date:      this.viewDate,
                  startDate: this.startDate,
                  endDate:   this.endDate
                });
                break;
              case 'clear':
                this.reset();
                if (this.autoclose) {
                  this.hide();
                }
                break;
              case 'today':
                var date = new Date();
                date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), 0);

                // Respect startDate and endDate.
                if (date < this.startDate) date = this.startDate;
                else if (date > this.endDate) date = this.endDate;

                this.viewMode = this.startViewMode;
                this.showMode(0);
                this._setDate(date);
                this.fill();
                if (this.autoclose) {
                  this.hide();
                }
                break;
            }
            break;
          case 'span':
            if (!target.is('.disabled')) {
              var year = this.viewDate.getUTCFullYear(),
                month = this.viewDate.getUTCMonth(),
                day = this.viewDate.getUTCDate(),
                hours = this.viewDate.getUTCHours(),
                minutes = this.viewDate.getUTCMinutes(),
                seconds = this.viewDate.getUTCSeconds();

              if (target.is('.month')) {
                this.viewDate.setUTCDate(1);
                month = target.parent().find('span').index(target);
                day = this.viewDate.getUTCDate();
                this.viewDate.setUTCMonth(month);
                this.element.trigger({
                  type: 'changeMonth',
                  date: this.viewDate
                });
                if (this.viewSelect >= 3) {
                  this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                }
              } else if (target.is('.year')) {
                this.viewDate.setUTCDate(1);
                year = parseInt(target.text(), 10) || 0;
                this.viewDate.setUTCFullYear(year);
                this.element.trigger({
                  type: 'changeYear',
                  date: this.viewDate
                });
                if (this.viewSelect >= 4) {
                  this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                }
              } else if (target.is('.hour')) {
                hours = parseInt(target.text(), 10) || 0;
                if (target.hasClass('hour_am') || target.hasClass('hour_pm')) {
                  if (hours === 12 && target.hasClass('hour_am')) {
                    hours = 0;
                  } else if (hours !== 12 && target.hasClass('hour_pm')) {
                    hours += 12;
                  }
                }
                this.viewDate.setUTCHours(hours);
                this.element.trigger({
                  type: 'changeHour',
                  date: this.viewDate
                });
                if (this.viewSelect >= 1) {
                  this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                }
              } else if (target.is('.minute')) {
                minutes = parseInt(target.text().substr(target.text().indexOf(':') + 1), 10) || 0;
                this.viewDate.setUTCMinutes(minutes);
                this.element.trigger({
                  type: 'changeMinute',
                  date: this.viewDate
                });
                if (this.viewSelect >= 0) {
                  this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
                }
              }
              if (this.viewMode !== 0) {
                var oldViewMode = this.viewMode;
                this.showMode(-1);
                this.fill();
                if (oldViewMode === this.viewMode && this.autoclose) {
                  this.hide();
                }
              } else {
                this.fill();
                if (this.autoclose) {
                  this.hide();
                }
              }
            }
            break;
          case 'td':
            if (target.is('.day') && !target.is('.disabled')) {
              var day = parseInt(target.text(), 10) || 1;
              var year = this.viewDate.getUTCFullYear(),
                month = this.viewDate.getUTCMonth(),
                hours = this.viewDate.getUTCHours(),
                minutes = this.viewDate.getUTCMinutes(),
                seconds = this.viewDate.getUTCSeconds();
              if (target.is('.old')) {
                if (month === 0) {
                  month = 11;
                  year -= 1;
                } else {
                  month -= 1;
                }
              } else if (target.is('.new')) {
                if (month === 11) {
                  month = 0;
                  year += 1;
                } else {
                  month += 1;
                }
              }
              this.viewDate.setUTCFullYear(year);
              this.viewDate.setUTCMonth(month, day);
              this.element.trigger({
                type: 'changeDay',
                date: this.viewDate
              });
              if (this.viewSelect >= 2) {
                this._setDate(UTCDate(year, month, day, hours, minutes, seconds, 0));
              }
            }
            var oldViewMode = this.viewMode;
            this.showMode(-1);
            this.fill();
            if (oldViewMode === this.viewMode && this.autoclose) {
              this.hide();
            }
            break;
        }
      }
    },

    _setDate: function (date, which) {
      if (!which || which === 'date')
        this.date = date;
      if (!which || which === 'view')
        this.viewDate = date;
      this.fill();
      this.setValue();
      var element;
      if (this.isInput) {
        element = this.element;
      } else if (this.component) {
        element = this.element.find('input');
      }
      if (element) {
        element.change();
      }
      this.element.trigger({
        type: 'changeDate',
        date: this.getDate()
      });
      if(date === null)
        this.date = this.viewDate;
    },

    moveMinute: function (date, dir) {
      if (!dir) return date;
      var new_date = new Date(date.valueOf());
      //dir = dir > 0 ? 1 : -1;
      new_date.setUTCMinutes(new_date.getUTCMinutes() + (dir * this.minuteStep));
      return new_date;
    },

    moveHour: function (date, dir) {
      if (!dir) return date;
      var new_date = new Date(date.valueOf());
      //dir = dir > 0 ? 1 : -1;
      new_date.setUTCHours(new_date.getUTCHours() + dir);
      return new_date;
    },

    moveDate: function (date, dir) {
      if (!dir) return date;
      var new_date = new Date(date.valueOf());
      //dir = dir > 0 ? 1 : -1;
      new_date.setUTCDate(new_date.getUTCDate() + dir);
      return new_date;
    },

    moveMonth: function (date, dir) {
      if (!dir) return date;
      var new_date = new Date(date.valueOf()),
        day = new_date.getUTCDate(),
        month = new_date.getUTCMonth(),
        mag = Math.abs(dir),
        new_month, test;
      dir = dir > 0 ? 1 : -1;
      if (mag === 1) {
        test = dir === -1
          // If going back one month, make sure month is not current month
          // (eg, Mar 31 -> Feb 31 === Feb 28, not Mar 02)
          ? function () {
          return new_date.getUTCMonth() === month;
        }
          // If going forward one month, make sure month is as expected
          // (eg, Jan 31 -> Feb 31 === Feb 28, not Mar 02)
          : function () {
          return new_date.getUTCMonth() !== new_month;
        };
        new_month = month + dir;
        new_date.setUTCMonth(new_month);
        // Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
        if (new_month < 0 || new_month > 11)
          new_month = (new_month + 12) % 12;
      } else {
        // For magnitudes >1, move one month at a time...
        for (var i = 0; i < mag; i++)
          // ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
          new_date = this.moveMonth(new_date, dir);
        // ...then reset the day, keeping it in the new month
        new_month = new_date.getUTCMonth();
        new_date.setUTCDate(day);
        test = function () {
          return new_month !== new_date.getUTCMonth();
        };
      }
      // Common date-resetting loop -- if date is beyond end of month, make it
      // end of month
      while (test()) {
        new_date.setUTCDate(--day);
        new_date.setUTCMonth(new_month);
      }
      return new_date;
    },

    moveYear: function (date, dir) {
      return this.moveMonth(date, dir * 12);
    },

    dateWithinRange: function (date) {
      return date >= this.startDate && date <= this.endDate;
    },

    keydown: function (e) {
      if (this.picker.is(':not(:visible)')) {
        if (e.keyCode === 27) // allow escape to hide and re-show picker
          this.show();
        return;
      }
      var dateChanged = false,
        dir, newDate, newViewDate;
      switch (e.keyCode) {
        case 27: // escape
          this.hide();
          e.preventDefault();
          break;
        case 37: // left
        case 39: // right
          if (!this.keyboardNavigation) break;
          dir = e.keyCode === 37 ? -1 : 1;
          var viewMode = this.viewMode;
          if (e.ctrlKey) {
            viewMode += 2;
          } else if (e.shiftKey) {
            viewMode += 1;
          }
          if (viewMode === 4) {
            newDate = this.moveYear(this.date, dir);
            newViewDate = this.moveYear(this.viewDate, dir);
          } else if (viewMode === 3) {
            newDate = this.moveMonth(this.date, dir);
            newViewDate = this.moveMonth(this.viewDate, dir);
          } else if (viewMode === 2) {
            newDate = this.moveDate(this.date, dir);
            newViewDate = this.moveDate(this.viewDate, dir);
          } else if (viewMode === 1) {
            newDate = this.moveHour(this.date, dir);
            newViewDate = this.moveHour(this.viewDate, dir);
          } else if (viewMode === 0) {
            newDate = this.moveMinute(this.date, dir);
            newViewDate = this.moveMinute(this.viewDate, dir);
          }
          if (this.dateWithinRange(newDate)) {
            this.date = newDate;
            this.viewDate = newViewDate;
            this.setValue();
            this.update();
            e.preventDefault();
            dateChanged = true;
          }
          break;
        case 38: // up
        case 40: // down
          if (!this.keyboardNavigation) break;
          dir = e.keyCode === 38 ? -1 : 1;
          viewMode = this.viewMode;
          if (e.ctrlKey) {
            viewMode += 2;
          } else if (e.shiftKey) {
            viewMode += 1;
          }
          if (viewMode === 4) {
            newDate = this.moveYear(this.date, dir);
            newViewDate = this.moveYear(this.viewDate, dir);
          } else if (viewMode === 3) {
            newDate = this.moveMonth(this.date, dir);
            newViewDate = this.moveMonth(this.viewDate, dir);
          } else if (viewMode === 2) {
            newDate = this.moveDate(this.date, dir * 7);
            newViewDate = this.moveDate(this.viewDate, dir * 7);
          } else if (viewMode === 1) {
            if (this.showMeridian) {
              newDate = this.moveHour(this.date, dir * 6);
              newViewDate = this.moveHour(this.viewDate, dir * 6);
            } else {
              newDate = this.moveHour(this.date, dir * 4);
              newViewDate = this.moveHour(this.viewDate, dir * 4);
            }
          } else if (viewMode === 0) {
            newDate = this.moveMinute(this.date, dir * 4);
            newViewDate = this.moveMinute(this.viewDate, dir * 4);
          }
          if (this.dateWithinRange(newDate)) {
            this.date = newDate;
            this.viewDate = newViewDate;
            this.setValue();
            this.update();
            e.preventDefault();
            dateChanged = true;
          }
          break;
        case 13: // enter
          if (this.viewMode !== 0) {
            var oldViewMode = this.viewMode;
            this.showMode(-1);
            this.fill();
            if (oldViewMode === this.viewMode && this.autoclose) {
              this.hide();
            }
          } else {
            this.fill();
            if (this.autoclose) {
              this.hide();
            }
          }
          e.preventDefault();
          break;
        case 9: // tab
          this.hide();
          break;
      }
      if (dateChanged) {
        var element;
        if (this.isInput) {
          element = this.element;
        } else if (this.component) {
          element = this.element.find('input');
        }
        if (element) {
          element.change();
        }
        this.element.trigger({
          type: 'changeDate',
          date: this.getDate()
        });
      }
    },

    showMode: function (dir) {
      if (dir) {
        var newViewMode = Math.max(0, Math.min(DPGlobal.modes.length - 1, this.viewMode + dir));
        if (newViewMode >= this.minView && newViewMode <= this.maxView) {
          this.element.trigger({
            type:        'changeMode',
            date:        this.viewDate,
            oldViewMode: this.viewMode,
            newViewMode: newViewMode
          });

          this.viewMode = newViewMode;
        }
      }
      /*
       vitalets: fixing bug of very special conditions:
       jquery 1.7.1 + webkit + show inline datetimepicker in bootstrap popover.
       Method show() does not set display css correctly and datetimepicker is not shown.
       Changed to .css('display', 'block') solve the problem.
       See https://github.com/vitalets/x-editable/issues/37

       In jquery 1.7.2+ everything works fine.
       */
      //this.picker.find('>div').hide().filter('.datetimepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
      this.picker.find('>div').hide().filter('.datetimepicker-' + DPGlobal.modes[this.viewMode].clsName).css('display', 'block');
      this.updateNavArrows();
    },

    reset: function () {
      this._setDate(null, 'date');
    },

    convertViewModeText:  function (viewMode) {
      switch (viewMode) {
        case 4:
          return 'decade';
        case 3:
          return 'year';
        case 2:
          return 'month';
        case 1:
          return 'day';
        case 0:
          return 'hour';
      }
    }
  };

  var old = $.fn.datetimepicker;
  $.fn.datetimepicker = function (option) {
    var args = Array.apply(null, arguments);
    args.shift();
    var internal_return;
    this.each(function () {
      var $this = $(this),
        data = $this.data('datetimepicker'),
        options = typeof option === 'object' && option;
      if (!data) {
        $this.data('datetimepicker', (data = new Datetimepicker(this, $.extend({}, $.fn.datetimepicker.defaults, options))));
      }
      if (typeof option === 'string' && typeof data[option] === 'function') {
        internal_return = data[option].apply(data, args);
        if (internal_return !== undefined) {
          return false;
        }
      }
    });
    if (internal_return !== undefined)
      return internal_return;
    else
      return this;
  };

  $.fn.datetimepicker.defaults = {
  };
  $.fn.datetimepicker.Constructor = Datetimepicker;
  var dates = $.fn.datetimepicker.dates = {
    en: {
      days:        ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      daysShort:   ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      daysMin:     ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
      months:      ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      meridiem:    ['am', 'pm'],
      suffix:      ['st', 'nd', 'rd', 'th'],
      today:       'Today',
      clear:       'Clear'
    }
  };

  var DPGlobal = {
    modes:            [
      {
        clsName: 'minutes',
        navFnc:  'Hours',
        navStep: 1
      },
      {
        clsName: 'hours',
        navFnc:  'Date',
        navStep: 1
      },
      {
        clsName: 'days',
        navFnc:  'Month',
        navStep: 1
      },
      {
        clsName: 'months',
        navFnc:  'FullYear',
        navStep: 1
      },
      {
        clsName: 'years',
        navFnc:  'FullYear',
        navStep: 10
      }
    ],
    isLeapYear:       function (year) {
      return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0))
    },
    getDaysInMonth:   function (year, month) {
      return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
    },
    getDefaultFormat: function (type, field) {
      if (type === 'standard') {
        if (field === 'input')
          return 'yyyy-mm-dd hh:ii';
        else
          return 'yyyy-mm-dd hh:ii:ss';
      } else if (type === 'php') {
        if (field === 'input')
          return 'Y-m-d H:i';
        else
          return 'Y-m-d H:i:s';
      } else {
        throw new Error('Invalid format type.');
      }
    },
    validParts: function (type) {
      if (type === 'standard') {
        return /t|hh?|HH?|p|P|z|Z|ii?|ss?|dd?|DD?|mm?|MM?|yy(?:yy)?/g;
      } else if (type === 'php') {
        return /[dDjlNwzFmMnStyYaABgGhHis]/g;
      } else {
        throw new Error('Invalid format type.');
      }
    },
    nonpunctuation: /[^ -\/:-@\[-`{-~\t\n\rTZ]+/g,
    parseFormat: function (format, type) {
      // IE treats \0 as a string end in inputs (truncating the value),
      // so it's a bad format delimiter, anyway
      var separators = format.replace(this.validParts(type), '\0').split('\0'),
        parts = format.match(this.validParts(type));
      if (!separators || !separators.length || !parts || parts.length === 0) {
        throw new Error('Invalid date format.');
      }
      return {separators: separators, parts: parts};
    },
    parseDate: function (date, format, language, type, timezone) {
      if (date instanceof Date) {
        var dateUTC = new Date(date.valueOf() - date.getTimezoneOffset() * 60000);
        dateUTC.setMilliseconds(0);
        return dateUTC;
      }
      if (/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(date)) {
        format = this.parseFormat('yyyy-mm-dd', type);
      }
      if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}$/.test(date)) {
        format = this.parseFormat('yyyy-mm-dd hh:ii', type);
      }
      if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}\:\d{1,2}[Z]{0,1}$/.test(date)) {
        format = this.parseFormat('yyyy-mm-dd hh:ii:ss', type);
      }
      if (/^[-+]\d+[dmwy]([\s,]+[-+]\d+[dmwy])*$/.test(date)) {
        var part_re = /([-+]\d+)([dmwy])/,
          parts = date.match(/([-+]\d+)([dmwy])/g),
          part, dir;
        date = new Date();
        for (var i = 0; i < parts.length; i++) {
          part = part_re.exec(parts[i]);
          dir = parseInt(part[1]);
          switch (part[2]) {
            case 'd':
              date.setUTCDate(date.getUTCDate() + dir);
              break;
            case 'm':
              date = Datetimepicker.prototype.moveMonth.call(Datetimepicker.prototype, date, dir);
              break;
            case 'w':
              date.setUTCDate(date.getUTCDate() + dir * 7);
              break;
            case 'y':
              date = Datetimepicker.prototype.moveYear.call(Datetimepicker.prototype, date, dir);
              break;
          }
        }
        return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), 0);
      }
      var parts = date && date.toString().match(this.nonpunctuation) || [],
        date = new Date(0, 0, 0, 0, 0, 0, 0),
        parsed = {},
        setters_order = ['hh', 'h', 'ii', 'i', 'ss', 's', 'yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'D', 'DD', 'd', 'dd', 'H', 'HH', 'p', 'P', 'z', 'Z'],
        setters_map = {
          hh:   function (d, v) {
            return d.setUTCHours(v);
          },
          h:    function (d, v) {
            return d.setUTCHours(v);
          },
          HH:   function (d, v) {
            return d.setUTCHours(v === 12 ? 0 : v);
          },
          H:    function (d, v) {
            return d.setUTCHours(v === 12 ? 0 : v);
          },
          ii:   function (d, v) {
            return d.setUTCMinutes(v);
          },
          i:    function (d, v) {
            return d.setUTCMinutes(v);
          },
          ss:   function (d, v) {
            return d.setUTCSeconds(v);
          },
          s:    function (d, v) {
            return d.setUTCSeconds(v);
          },
          yyyy: function (d, v) {
            return d.setUTCFullYear(v);
          },
          yy:   function (d, v) {
            return d.setUTCFullYear(2000 + v);
          },
          m:    function (d, v) {
            v -= 1;
            while (v < 0) v += 12;
            v %= 12;
            d.setUTCMonth(v);
            while (d.getUTCMonth() !== v)
              if (isNaN(d.getUTCMonth()))
                return d;
              else
                d.setUTCDate(d.getUTCDate() - 1);
            return d;
          },
          d:    function (d, v) {
            return d.setUTCDate(v);
          },
          p:    function (d, v) {
            return d.setUTCHours(v === 1 ? d.getUTCHours() + 12 : d.getUTCHours());
          },
          z:    function () {
            return timezone
          }
        },
        val, filtered, part;
      setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
      setters_map['dd'] = setters_map['d'];
      setters_map['P'] = setters_map['p'];
      setters_map['Z'] = setters_map['z'];
      date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
      if (parts.length === format.parts.length) {
        for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
          val = parseInt(parts[i], 10);
          part = format.parts[i];
          if (isNaN(val)) {
            switch (part) {
              case 'MM':
                filtered = $(dates[language].months).filter(function () {
                  var m = this.slice(0, parts[i].length),
                    p = parts[i].slice(0, m.length);
                  return m === p;
                });
                val = $.inArray(filtered[0], dates[language].months) + 1;
                break;
              case 'M':
                filtered = $(dates[language].monthsShort).filter(function () {
                  var m = this.slice(0, parts[i].length),
                    p = parts[i].slice(0, m.length);
                  return m.toLowerCase() === p.toLowerCase();
                });
                val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
                break;
              case 'p':
              case 'P':
                val = $.inArray(parts[i].toLowerCase(), dates[language].meridiem);
                break;
              case 'z':
              case 'Z':
                timezone;
                break;

            }
          }
          parsed[part] = val;
        }
        for (var i = 0, s; i < setters_order.length; i++) {
          s = setters_order[i];
          if (s in parsed && !isNaN(parsed[s]))
            setters_map[s](date, parsed[s])
        }
      }
      return date;
    },
    formatDate:       function (date, format, language, type, timezone) {
      if (date === null) {
        return '';
      }
      var val;
      if (type === 'standard') {
        val = {
          t:    date.getTime(),
          // year
          yy:   date.getUTCFullYear().toString().substring(2),
          yyyy: date.getUTCFullYear(),
          // month
          m:    date.getUTCMonth() + 1,
          M:    dates[language].monthsShort[date.getUTCMonth()],
          MM:   dates[language].months[date.getUTCMonth()],
          // day
          d:    date.getUTCDate(),
          D:    dates[language].daysShort[date.getUTCDay()],
          DD:   dates[language].days[date.getUTCDay()],
          p:    (dates[language].meridiem.length === 2 ? dates[language].meridiem[date.getUTCHours() < 12 ? 0 : 1] : ''),
          // hour
          h:    date.getUTCHours(),
          // minute
          i:    date.getUTCMinutes(),
          // second
          s:    date.getUTCSeconds(),
          // timezone
          z:    timezone
        };

        if (dates[language].meridiem.length === 2) {
          val.H = (val.h % 12 === 0 ? 12 : val.h % 12);
        }
        else {
          val.H = val.h;
        }
        val.HH = (val.H < 10 ? '0' : '') + val.H;
        val.P = val.p.toUpperCase();
        val.Z = val.z;
        val.hh = (val.h < 10 ? '0' : '') + val.h;
        val.ii = (val.i < 10 ? '0' : '') + val.i;
        val.ss = (val.s < 10 ? '0' : '') + val.s;
        val.dd = (val.d < 10 ? '0' : '') + val.d;
        val.mm = (val.m < 10 ? '0' : '') + val.m;
      } else if (type === 'php') {
        // php format
        val = {
          // year
          y: date.getUTCFullYear().toString().substring(2),
          Y: date.getUTCFullYear(),
          // month
          F: dates[language].months[date.getUTCMonth()],
          M: dates[language].monthsShort[date.getUTCMonth()],
          n: date.getUTCMonth() + 1,
          t: DPGlobal.getDaysInMonth(date.getUTCFullYear(), date.getUTCMonth()),
          // day
          j: date.getUTCDate(),
          l: dates[language].days[date.getUTCDay()],
          D: dates[language].daysShort[date.getUTCDay()],
          w: date.getUTCDay(), // 0 -> 6
          N: (date.getUTCDay() === 0 ? 7 : date.getUTCDay()),       // 1 -> 7
          S: (date.getUTCDate() % 10 <= dates[language].suffix.length ? dates[language].suffix[date.getUTCDate() % 10 - 1] : ''),
          // hour
          a: (dates[language].meridiem.length === 2 ? dates[language].meridiem[date.getUTCHours() < 12 ? 0 : 1] : ''),
          g: (date.getUTCHours() % 12 === 0 ? 12 : date.getUTCHours() % 12),
          G: date.getUTCHours(),
          // minute
          i: date.getUTCMinutes(),
          // second
          s: date.getUTCSeconds()
        };
        val.m = (val.n < 10 ? '0' : '') + val.n;
        val.d = (val.j < 10 ? '0' : '') + val.j;
        val.A = val.a.toString().toUpperCase();
        val.h = (val.g < 10 ? '0' : '') + val.g;
        val.H = (val.G < 10 ? '0' : '') + val.G;
        val.i = (val.i < 10 ? '0' : '') + val.i;
        val.s = (val.s < 10 ? '0' : '') + val.s;
      } else {
        throw new Error('Invalid format type.');
      }
      var date = [],
        seps = $.extend([], format.separators);
      for (var i = 0, cnt = format.parts.length; i < cnt; i++) {
        if (seps.length) {
          date.push(seps.shift());
        }
        date.push(val[format.parts[i]]);
      }
      if (seps.length) {
        date.push(seps.shift());
      }
      return date.join('');
    },
    convertViewMode:  function (viewMode) {
      switch (viewMode) {
        case 4:
        case 'decade':
          viewMode = 4;
          break;
        case 3:
        case 'year':
          viewMode = 3;
          break;
        case 2:
        case 'month':
          viewMode = 2;
          break;
        case 1:
        case 'day':
          viewMode = 1;
          break;
        case 0:
        case 'hour':
          viewMode = 0;
          break;
      }

      return viewMode;
    },
    headTemplate: '<thead>' +
                '<tr>' +
                '<th class="prev"><i class="{iconType} {leftArrow}"/></th>' +
                '<th colspan="5" class="switch"></th>' +
                '<th class="next"><i class="{iconType} {rightArrow}"/></th>' +
                '</tr>' +
      '</thead>',
    headTemplateV3: '<thead>' +
                '<tr>' +
                '<th class="prev"><span class="{iconType} {leftArrow}"></span> </th>' +
                '<th colspan="5" class="switch"></th>' +
                '<th class="next"><span class="{iconType} {rightArrow}"></span> </th>' +
                '</tr>' +
      '</thead>',
    contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
    footTemplate: '<tfoot>' + 
                    '<tr><th colspan="7" class="today"></th></tr>' +
                    '<tr><th colspan="7" class="clear"></th></tr>' +
                  '</tfoot>'
  };
  DPGlobal.template = '<div class="datetimepicker">' +
    '<div class="datetimepicker-minutes">' +
    '<table class=" table-condensed">' +
    DPGlobal.headTemplate +
    DPGlobal.contTemplate +
    DPGlobal.footTemplate +
    '</table>' +
    '</div>' +
    '<div class="datetimepicker-hours">' +
    '<table class=" table-condensed">' +
    DPGlobal.headTemplate +
    DPGlobal.contTemplate +
    DPGlobal.footTemplate +
    '</table>' +
    '</div>' +
    '<div class="datetimepicker-days">' +
    '<table class=" table-condensed">' +
    DPGlobal.headTemplate +
    '<tbody></tbody>' +
    DPGlobal.footTemplate +
    '</table>' +
    '</div>' +
    '<div class="datetimepicker-months">' +
    '<table class="table-condensed">' +
    DPGlobal.headTemplate +
    DPGlobal.contTemplate +
    DPGlobal.footTemplate +
    '</table>' +
    '</div>' +
    '<div class="datetimepicker-years">' +
    '<table class="table-condensed">' +
    DPGlobal.headTemplate +
    DPGlobal.contTemplate +
    DPGlobal.footTemplate +
    '</table>' +
    '</div>' +
    '</div>';
  DPGlobal.templateV3 = '<div class="datetimepicker">' +
    '<div class="datetimepicker-minutes">' +
    '<table class=" table-condensed">' +
    DPGlobal.headTemplateV3 +
    DPGlobal.contTemplate +
    DPGlobal.footTemplate +
    '</table>' +
    '</div>' +
    '<div class="datetimepicker-hours">' +
    '<table class=" table-condensed">' +
    DPGlobal.headTemplateV3 +
    DPGlobal.contTemplate +
    DPGlobal.footTemplate +
    '</table>' +
    '</div>' +
    '<div class="datetimepicker-days">' +
    '<table class=" table-condensed">' +
    DPGlobal.headTemplateV3 +
    '<tbody></tbody>' +
    DPGlobal.footTemplate +
    '</table>' +
    '</div>' +
    '<div class="datetimepicker-months">' +
    '<table class="table-condensed">' +
    DPGlobal.headTemplateV3 +
    DPGlobal.contTemplate +
    DPGlobal.footTemplate +
    '</table>' +
    '</div>' +
    '<div class="datetimepicker-years">' +
    '<table class="table-condensed">' +
    DPGlobal.headTemplateV3 +
    DPGlobal.contTemplate +
    DPGlobal.footTemplate +
    '</table>' +
    '</div>' +
    '</div>';
  $.fn.datetimepicker.DPGlobal = DPGlobal;

  /* DATETIMEPICKER NO CONFLICT
   * =================== */

  $.fn.datetimepicker.noConflict = function () {
    $.fn.datetimepicker = old;
    return this;
  };

  /* DATETIMEPICKER DATA-API
   * ================== */

  $(document).on(
    'focus.datetimepicker.data-api click.datetimepicker.data-api',
    '[data-provide="datetimepicker"]',
    function (e) {
      var $this = $(this);
      if ($this.data('datetimepicker')) return;
      e.preventDefault();
      // component click requires us to explicitly show it
      $this.datetimepicker('show');
    }
  );
  $(function () {
    $('[data-provide="datetimepicker-inline"]').datetimepicker();
  });

}));


/***/ }),

/***/ "./web/assets/js/hotels_list.js":
/*!**************************************!*\
  !*** ./web/assets/js/hotels_list.js ***!
  \**************************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function($) {var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var app = __webpack_require__(/*! ./app.js */ "./web/assets/js/app.js");
__webpack_require__(/*! bootstrap-datetime-picker */ "./node_modules/bootstrap-datetime-picker/js/bootstrap-datetimepicker.js");

function gmapsInit(google) {
    var map;

    this.openBookingForm = function (hotelData) {
        $('#booking_hotelId').val(hotelData.id);
        $('#hotel-edit').attr('href', $('#hotel-edit').data('path').replace('_', hotelData.id));
        $('#booking-modal').modal('show');
    };

    this.addMarker = function (hotelData) {
        var marker = new google.maps.Marker({
            position: hotelData.coords,
            animation: google.maps.Animation.DROP,
            map: map,
            title: hotelData.name,
            metadata: {
                id: hotelData.id
            }
        });

        var selector = '#hotel-list .list-group-item[data-id=' + hotelData.id + ']';

        google.maps.event.addListener(marker, 'mouseover', function () {
            return $(selector).addClass('highlight');
        });
        google.maps.event.addListener(marker, 'mouseout', function () {
            return $(selector).removeClass('highlight');
        });
        google.maps.event.addListener(marker, 'click', function () {
            return openBookingForm(hotelData);
        });

        $(selector).hover(function () {
            return map.setCenter(marker.getPosition());
        });
        $(selector).click(function () {
            return openBookingForm(hotelData);
        });
    };

    this.handleAllMarkers = function ($parentNode) {
        $parentNode.each(function (index, node) {
            var lat = $(node).data('latitude');
            var lng = $(node).data('longitude');

            if (lat != null && lng != null) {
                addMarker({
                    coords: {
                        lat: lat,
                        lng: lng
                    },
                    name: $('.name', $(node)).html().trim(),
                    id: $(node).data('id')
                });
            }
        });
    };

    this.initMap = function () {
        var $mapNode = $('#map');

        var coords = {
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

$(function () {
    app.loadGmaps().then(function (googleMaps) {
        gmapsInit({
            maps: googleMaps
        });
    }).catch(function (err) {
        console.error(err);
    });

    var today = new Date();
    var dayMs = 86400 * 1000;

    var getDateTimeSettings = function getDateTimeSettings(selector) {
        var $node = $(selector);

        return {
            minView: 'month',
            autoclose: true,
            format: 'yyyy-mm-dd',
            weekStart: 1,
            initialDate: today,
            startDate: today,
            endDate: new Date(today.getTime() + 60 * dayMs),
            todayBtn: true,
            container: $('.date', $node).parent().attr('id')
        };
    };

    var dateFields = {
        '#booking_dateIn': ['#booking_dateOut', 'setStartDate'],
        '#booking_dateOut': ['#booking_dateIn', 'setEndDate']
    };

    for (var curSelector in dateFields) {
        var _dateFields$curSelect = _slicedToArray(dateFields[curSelector], 2),
            anotherSelector = _dateFields$curSelect[0],
            methodName = _dateFields$curSelect[1];

        $(curSelector).datetimepicker(getDateTimeSettings(curSelector)).on('changeDate', function (ev) {
            $(anotherSelector).datetimepicker(methodName, ev.date);
        });
    }

    var options = {
        valueNames: [{ data: ['id', 'latitude', 'longitude'] }, 'name', 'price', 'address']
    };

    var hotelList = new List('hotel-list', options);
});
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! jquery */ "./node_modules/jquery/src/jquery.js")))

/***/ })

},["./web/assets/js/hotels_list.js"]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvYm9vdHN0cmFwLWRhdGV0aW1lLXBpY2tlci9qcy9ib290c3RyYXAtZGF0ZXRpbWVwaWNrZXIuanMiLCJ3ZWJwYWNrOi8vLy4vd2ViL2Fzc2V0cy9qcy9ob3RlbHNfbGlzdC5qcyJdLCJuYW1lcyI6WyJhcHAiLCJyZXF1aXJlIiwiZ21hcHNJbml0IiwiZ29vZ2xlIiwibWFwIiwib3BlbkJvb2tpbmdGb3JtIiwiaG90ZWxEYXRhIiwiJCIsInZhbCIsImlkIiwiYXR0ciIsImRhdGEiLCJyZXBsYWNlIiwibW9kYWwiLCJhZGRNYXJrZXIiLCJtYXJrZXIiLCJtYXBzIiwiTWFya2VyIiwicG9zaXRpb24iLCJjb29yZHMiLCJhbmltYXRpb24iLCJBbmltYXRpb24iLCJEUk9QIiwidGl0bGUiLCJuYW1lIiwibWV0YWRhdGEiLCJzZWxlY3RvciIsImV2ZW50IiwiYWRkTGlzdGVuZXIiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwiaG92ZXIiLCJzZXRDZW50ZXIiLCJnZXRQb3NpdGlvbiIsImNsaWNrIiwiaGFuZGxlQWxsTWFya2VycyIsIiRwYXJlbnROb2RlIiwiZWFjaCIsImluZGV4Iiwibm9kZSIsImxhdCIsImxuZyIsImh0bWwiLCJ0cmltIiwiaW5pdE1hcCIsIiRtYXBOb2RlIiwiTWFwIiwiZ2V0Iiwiem9vbSIsImNlbnRlciIsImxvYWRHbWFwcyIsInRoZW4iLCJnb29nbGVNYXBzIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiLCJ0b2RheSIsIkRhdGUiLCJkYXlNcyIsImdldERhdGVUaW1lU2V0dGluZ3MiLCIkbm9kZSIsIm1pblZpZXciLCJhdXRvY2xvc2UiLCJmb3JtYXQiLCJ3ZWVrU3RhcnQiLCJpbml0aWFsRGF0ZSIsInN0YXJ0RGF0ZSIsImVuZERhdGUiLCJnZXRUaW1lIiwidG9kYXlCdG4iLCJjb250YWluZXIiLCJwYXJlbnQiLCJkYXRlRmllbGRzIiwiY3VyU2VsZWN0b3IiLCJhbm90aGVyU2VsZWN0b3IiLCJtZXRob2ROYW1lIiwiZGF0ZXRpbWVwaWNrZXIiLCJvbiIsImV2IiwiZGF0ZSIsIm9wdGlvbnMiLCJ2YWx1ZU5hbWVzIiwiaG90ZWxMaXN0IiwiTGlzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsT0FBTztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRCxTQUFTO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlGQUF5RjtBQUN6RjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsU0FBUztBQUN2QyxvQ0FBb0MsU0FBUztBQUM3QztBQUNBLDhCQUE4QixVQUFVO0FBQ3hDLG9DQUFvQyxVQUFVO0FBQzlDO0FBQ0EsOEJBQThCLFdBQVc7QUFDekMsb0NBQW9DLFdBQVc7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0Esd0JBQXdCLDJDQUEyQztBQUNuRSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdELFdBQVcsRUFBRTtBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RCxXQUFXLEVBQUU7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyREFBMkQsV0FBVyxFQUFFO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseURBQXlELFdBQVcsRUFBRTtBQUN0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwREFBMEQsV0FBVyxFQUFFO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsaURBQWlEO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLDZCQUE2Qix5QkFBeUI7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsNkJBQTZCLHlCQUF5QjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSzs7QUFFTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLFFBQVE7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLFFBQVE7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLFFBQVE7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLFFBQVE7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxxQkFBcUI7QUFDaEUsV0FBVztBQUNYLDJDQUEyQyxzQkFBc0I7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxxQkFBcUI7QUFDaEUsV0FBVztBQUNYLDJDQUEyQyxzQkFBc0I7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLHFCQUFxQjtBQUNoRSxXQUFXO0FBQ1gsMkNBQTJDLHNCQUFzQjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxxQkFBcUI7QUFDaEUsV0FBVztBQUNYLDJDQUEyQyxzQkFBc0I7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQyxxQkFBcUI7QUFDaEUsV0FBVztBQUNYLDJDQUEyQyxzQkFBc0I7QUFDakU7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLHFCQUFxQjtBQUNoRSxXQUFXO0FBQ1gsMkNBQTJDLHNCQUFzQjtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkNBQTJDLHFCQUFxQjtBQUNoRSxXQUFXO0FBQ1gsMkNBQTJDLHNCQUFzQjtBQUNqRTtBQUNBO0FBQ0EsMkNBQTJDLHFCQUFxQjtBQUNoRSxXQUFXO0FBQ1gsMkNBQTJDLHNCQUFzQjtBQUNqRTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQSxPQUFPOztBQUVQLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSx1QkFBdUIsU0FBUztBQUNoQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVzs7QUFFWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUZBQWlGO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTCxtQ0FBbUM7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxFQUFFLEtBQUssSUFBSSxLQUFLLElBQUk7QUFDbkM7QUFDQTtBQUNBLGVBQWUsRUFBRSxLQUFLLElBQUksS0FBSyxJQUFJLE9BQU8sSUFBSSxLQUFLLElBQUk7QUFDdkQ7QUFDQTtBQUNBLGVBQWUsRUFBRSxLQUFLLElBQUksS0FBSyxJQUFJLE9BQU8sSUFBSSxLQUFLLElBQUksS0FBSyxJQUFJLElBQUksSUFBSTtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixrQkFBa0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtEQUFrRCxTQUFTO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQiwwQkFBMEI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsU0FBUztBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsNkNBQTZDLFNBQVMsRUFBRSxVQUFVO0FBQ2xFO0FBQ0EsNkNBQTZDLFNBQVMsRUFBRSxXQUFXO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELFNBQVMsRUFBRSxVQUFVO0FBQ3JFO0FBQ0EsZ0RBQWdELFNBQVMsRUFBRSxXQUFXO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7QUM5NkRELElBQUlBLE1BQU0sbUJBQUFDLENBQVEsd0NBQVIsQ0FBVjtBQUNBLG1CQUFBQSxDQUFRLDBHQUFSOztBQUVBLFNBQVNDLFNBQVQsQ0FBbUJDLE1BQW5CLEVBQTJCO0FBQ3ZCLFFBQUlDLEdBQUo7O0FBRUEsU0FBS0MsZUFBTCxHQUF1QixVQUFTQyxTQUFULEVBQW9CO0FBQ3ZDQyxVQUFFLGtCQUFGLEVBQXNCQyxHQUF0QixDQUEwQkYsVUFBVUcsRUFBcEM7QUFDQUYsVUFBRSxhQUFGLEVBQWlCRyxJQUFqQixDQUNJLE1BREosRUFFSUgsRUFBRSxhQUFGLEVBQWlCSSxJQUFqQixDQUFzQixNQUF0QixFQUE4QkMsT0FBOUIsQ0FBc0MsR0FBdEMsRUFBMkNOLFVBQVVHLEVBQXJELENBRko7QUFJQUYsVUFBRSxnQkFBRixFQUFvQk0sS0FBcEIsQ0FBMEIsTUFBMUI7QUFDSCxLQVBEOztBQVNBLFNBQUtDLFNBQUwsR0FBaUIsVUFBU1IsU0FBVCxFQUFvQjtBQUNqQyxZQUFJUyxTQUFTLElBQUlaLE9BQU9hLElBQVAsQ0FBWUMsTUFBaEIsQ0FBdUI7QUFDaENDLHNCQUFVWixVQUFVYSxNQURZO0FBRWhDQyx1QkFBV2pCLE9BQU9hLElBQVAsQ0FBWUssU0FBWixDQUFzQkMsSUFGRDtBQUdoQ2xCLGlCQUFLQSxHQUgyQjtBQUloQ21CLG1CQUFPakIsVUFBVWtCLElBSmU7QUFLaENDLHNCQUFVO0FBQ05oQixvQkFBSUgsVUFBVUc7QUFEUjtBQUxzQixTQUF2QixDQUFiOztBQVVBLFlBQU1pQixXQUFXLDBDQUN1QnBCLFVBQVVHLEVBRGpDLEdBQ3NDLEdBRHZEOztBQUdBTixlQUFPYSxJQUFQLENBQVlXLEtBQVosQ0FBa0JDLFdBQWxCLENBQThCYixNQUE5QixFQUFzQyxXQUF0QyxFQUNJO0FBQUEsbUJBQU1SLEVBQUVtQixRQUFGLEVBQVlHLFFBQVosQ0FBcUIsV0FBckIsQ0FBTjtBQUFBLFNBREo7QUFHQTFCLGVBQU9hLElBQVAsQ0FBWVcsS0FBWixDQUFrQkMsV0FBbEIsQ0FBOEJiLE1BQTlCLEVBQXNDLFVBQXRDLEVBQ0k7QUFBQSxtQkFBTVIsRUFBRW1CLFFBQUYsRUFBWUksV0FBWixDQUF3QixXQUF4QixDQUFOO0FBQUEsU0FESjtBQUdBM0IsZUFBT2EsSUFBUCxDQUFZVyxLQUFaLENBQWtCQyxXQUFsQixDQUE4QmIsTUFBOUIsRUFBc0MsT0FBdEMsRUFDSTtBQUFBLG1CQUFNVixnQkFBZ0JDLFNBQWhCLENBQU47QUFBQSxTQURKOztBQUlBQyxVQUFFbUIsUUFBRixFQUFZSyxLQUFaLENBQWtCO0FBQUEsbUJBQU0zQixJQUFJNEIsU0FBSixDQUFjakIsT0FBT2tCLFdBQVAsRUFBZCxDQUFOO0FBQUEsU0FBbEI7QUFDQTFCLFVBQUVtQixRQUFGLEVBQVlRLEtBQVosQ0FBa0I7QUFBQSxtQkFBTTdCLGdCQUFnQkMsU0FBaEIsQ0FBTjtBQUFBLFNBQWxCO0FBQ0gsS0ExQkQ7O0FBNEJBLFNBQUs2QixnQkFBTCxHQUF3QixVQUFTQyxXQUFULEVBQXNCO0FBQzFDQSxvQkFBWUMsSUFBWixDQUFpQixVQUFTQyxLQUFULEVBQWdCQyxJQUFoQixFQUFzQjtBQUNuQyxnQkFBTUMsTUFBTWpDLEVBQUVnQyxJQUFGLEVBQVE1QixJQUFSLENBQWEsVUFBYixDQUFaO0FBQ0EsZ0JBQU04QixNQUFNbEMsRUFBRWdDLElBQUYsRUFBUTVCLElBQVIsQ0FBYSxXQUFiLENBQVo7O0FBRUEsZ0JBQUc2QixPQUFPLElBQVAsSUFBZUMsT0FBTyxJQUF6QixFQUErQjtBQUMzQjNCLDBCQUFVO0FBQ05LLDRCQUFRO0FBQ0pxQiw2QkFBS0EsR0FERDtBQUVKQyw2QkFBS0E7QUFGRCxxQkFERjtBQUtOakIsMEJBQU1qQixFQUFFLE9BQUYsRUFBV0EsRUFBRWdDLElBQUYsQ0FBWCxFQUFvQkcsSUFBcEIsR0FBMkJDLElBQTNCLEVBTEE7QUFNTmxDLHdCQUFJRixFQUFFZ0MsSUFBRixFQUFRNUIsSUFBUixDQUFhLElBQWI7QUFORSxpQkFBVjtBQVFIO0FBQ0osU0FkRDtBQWVILEtBaEJEOztBQWtCQSxTQUFLaUMsT0FBTCxHQUFlLFlBQVc7QUFDdEIsWUFBSUMsV0FBV3RDLEVBQUUsTUFBRixDQUFmOztBQUVBLFlBQU1ZLFNBQVM7QUFDWHFCLGlCQUFLLEVBRE07QUFFWEMsaUJBQUs7QUFGTSxTQUFmOztBQUtBckMsY0FBTSxJQUFJRCxPQUFPYSxJQUFQLENBQVk4QixHQUFoQixDQUFvQkQsU0FBU0UsR0FBVCxDQUFhLENBQWIsQ0FBcEIsRUFBcUM7QUFDdkNDLGtCQUFNLENBRGlDO0FBRXZDQyxvQkFBUTlCO0FBRitCLFNBQXJDLENBQU47O0FBS0FnQix5QkFBaUI1QixFQUFFLHNCQUFGLENBQWpCO0FBQ0gsS0FkRDs7QUFnQkEsU0FBS3FDLE9BQUw7QUFDSDs7QUFFRHJDLEVBQUUsWUFBVztBQUNUUCxRQUFJa0QsU0FBSixHQUFnQkMsSUFBaEIsQ0FBcUIsVUFBU0MsVUFBVCxFQUFxQjtBQUN0Q2xELGtCQUFVO0FBQ05jLGtCQUFNb0M7QUFEQSxTQUFWO0FBR0gsS0FKRCxFQUlHQyxLQUpILENBSVMsVUFBQ0MsR0FBRCxFQUFTO0FBQ2hCQyxnQkFBUUMsS0FBUixDQUFjRixHQUFkO0FBQ0QsS0FORDs7QUFRQSxRQUFNRyxRQUFRLElBQUlDLElBQUosRUFBZDtBQUNBLFFBQU1DLFFBQVEsUUFBUSxJQUF0Qjs7QUFFQSxRQUFJQyxzQkFBc0IsU0FBdEJBLG1CQUFzQixDQUFTbEMsUUFBVCxFQUFtQjtBQUN6QyxZQUFJbUMsUUFBUXRELEVBQUVtQixRQUFGLENBQVo7O0FBRUEsZUFBTztBQUNIb0MscUJBQVMsT0FETjtBQUVIQyx1QkFBVyxJQUZSO0FBR0hDLG9CQUFRLFlBSEw7QUFJSEMsdUJBQVcsQ0FKUjtBQUtIQyx5QkFBYVQsS0FMVjtBQU1IVSx1QkFBV1YsS0FOUjtBQU9IVyxxQkFBUyxJQUFJVixJQUFKLENBQVNELE1BQU1ZLE9BQU4sS0FBa0IsS0FBS1YsS0FBaEMsQ0FQTjtBQVFIVyxzQkFBVSxJQVJQO0FBU0hDLHVCQUFXaEUsRUFBRSxPQUFGLEVBQVdzRCxLQUFYLEVBQWtCVyxNQUFsQixHQUEyQjlELElBQTNCLENBQWdDLElBQWhDO0FBVFIsU0FBUDtBQVdILEtBZEQ7O0FBZ0JBLFFBQU0rRCxhQUFhO0FBQ2YsMkJBQW1CLENBQUMsa0JBQUQsRUFBcUIsY0FBckIsQ0FESjtBQUVmLDRCQUFvQixDQUFDLGlCQUFELEVBQW9CLFlBQXBCO0FBRkwsS0FBbkI7O0FBS0EsU0FBSSxJQUFJQyxXQUFSLElBQXVCRCxVQUF2QixFQUFtQztBQUFBLG1EQUNLQSxXQUFXQyxXQUFYLENBREw7QUFBQSxZQUMxQkMsZUFEMEI7QUFBQSxZQUNUQyxVQURTOztBQUUvQnJFLFVBQUVtRSxXQUFGLEVBQ0NHLGNBREQsQ0FDZ0JqQixvQkFBb0JjLFdBQXBCLENBRGhCLEVBRUNJLEVBRkQsQ0FFSSxZQUZKLEVBRWtCLFVBQVNDLEVBQVQsRUFBYTtBQUMzQnhFLGNBQUVvRSxlQUFGLEVBQW1CRSxjQUFuQixDQUFrQ0QsVUFBbEMsRUFBOENHLEdBQUdDLElBQWpEO0FBQ0gsU0FKRDtBQUtIOztBQUVELFFBQUlDLFVBQVU7QUFDVkMsb0JBQVksQ0FDUixFQUFFdkUsTUFBTSxDQUFDLElBQUQsRUFBTyxVQUFQLEVBQW1CLFdBQW5CLENBQVIsRUFEUSxFQUVSLE1BRlEsRUFHUixPQUhRLEVBSVIsU0FKUTtBQURGLEtBQWQ7O0FBU0EsUUFBSXdFLFlBQVksSUFBSUMsSUFBSixDQUFTLFlBQVQsRUFBdUJILE9BQXZCLENBQWhCO0FBQ0gsQ0FwREQsRSIsImZpbGUiOiJqcy9ob3RlbHNfbGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIu+7vy8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gKiBib290c3RyYXAtZGF0ZXRpbWVwaWNrZXIuanNcclxuICogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAqIENvcHlyaWdodCAyMDEyIFN0ZWZhbiBQZXRyZVxyXG4gKlxyXG4gKiBJbXByb3ZlbWVudHMgYnkgQW5kcmV3IFJvd2xzXHJcbiAqIEltcHJvdmVtZW50cyBieSBTw6liYXN0aWVuIE1hbG90XHJcbiAqIEltcHJvdmVtZW50cyBieSBZdW4gTGFpXHJcbiAqIEltcHJvdmVtZW50cyBieSBLZW5uZXRoIEhlbmRlcmlja1xyXG4gKiBJbXByb3ZlbWVudHMgYnkgQ3VHQmFieUJlYVJcclxuICogSW1wcm92ZW1lbnRzIGJ5IENocmlzdGlhbiBWYWFzIDxhdXNwZXhAYXVzcGV4LmV1PlxyXG4gKlxyXG4gKiBQcm9qZWN0IFVSTCA6IGh0dHA6Ly93d3cubWFsb3QuZnIvYm9vdHN0cmFwLWRhdGV0aW1lcGlja2VyXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG5cclxuKGZ1bmN0aW9uKGZhY3Rvcnkpe1xyXG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZClcclxuICAgICAgZGVmaW5lKFsnanF1ZXJ5J10sIGZhY3RvcnkpO1xyXG4gICAgZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxyXG4gICAgICBmYWN0b3J5KHJlcXVpcmUoJ2pxdWVyeScpKTtcclxuICAgIGVsc2VcclxuICAgICAgZmFjdG9yeShqUXVlcnkpO1xyXG5cclxufShmdW5jdGlvbigkLCB1bmRlZmluZWQpe1xyXG5cclxuICAvLyBBZGQgRUNNQTI2Mi01IEFycmF5IG1ldGhvZHMgaWYgbm90IHN1cHBvcnRlZCBuYXRpdmVseSAoSUU4KVxyXG4gIGlmICghKCdpbmRleE9mJyBpbiBBcnJheS5wcm90b3R5cGUpKSB7XHJcbiAgICBBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIChmaW5kLCBpKSB7XHJcbiAgICAgIGlmIChpID09PSB1bmRlZmluZWQpIGkgPSAwO1xyXG4gICAgICBpZiAoaSA8IDApIGkgKz0gdGhpcy5sZW5ndGg7XHJcbiAgICAgIGlmIChpIDwgMCkgaSA9IDA7XHJcbiAgICAgIGZvciAodmFyIG4gPSB0aGlzLmxlbmd0aDsgaSA8IG47IGkrKykge1xyXG4gICAgICAgIGlmIChpIGluIHRoaXMgJiYgdGhpc1tpXSA9PT0gZmluZCkge1xyXG4gICAgICAgICAgcmV0dXJuIGk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8vIEFkZCB0aW1lem9uZSBhYmJyZXZpYXRpb24gc3VwcG9ydCBmb3IgaWU2KywgQ2hyb21lLCBGaXJlZm94XHJcbiAgZnVuY3Rpb24gdGltZVpvbmVBYmJyZXZpYXRpb24oKSB7XHJcbiAgICB2YXIgYWJicmV2aWF0aW9uLCBkYXRlLCBmb3JtYXR0ZWRTdHIsIGksIGxlbiwgbWF0Y2hlZFN0cmluZ3MsIHJlZiwgc3RyO1xyXG4gICAgZGF0ZSA9IChuZXcgRGF0ZSgpKS50b1N0cmluZygpO1xyXG4gICAgZm9ybWF0dGVkU3RyID0gKChyZWYgPSBkYXRlLnNwbGl0KCcoJylbMV0pICE9IG51bGwgPyByZWYuc2xpY2UoMCwgLTEpIDogMCkgfHwgZGF0ZS5zcGxpdCgnICcpO1xyXG4gICAgaWYgKGZvcm1hdHRlZFN0ciBpbnN0YW5jZW9mIEFycmF5KSB7XHJcbiAgICAgIG1hdGNoZWRTdHJpbmdzID0gW107XHJcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBmb3JtYXR0ZWRTdHIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuICAgICAgICBzdHIgPSBmb3JtYXR0ZWRTdHJbaV07XHJcbiAgICAgICAgaWYgKChhYmJyZXZpYXRpb24gPSAocmVmID0gc3RyLm1hdGNoKC9cXGJbQS1aXStcXGIvKSkgIT09IG51bGwpID8gcmVmWzBdIDogMCkge1xyXG4gICAgICAgICAgbWF0Y2hlZFN0cmluZ3MucHVzaChhYmJyZXZpYXRpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBmb3JtYXR0ZWRTdHIgPSBtYXRjaGVkU3RyaW5ncy5wb3AoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBmb3JtYXR0ZWRTdHI7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBVVENEYXRlKCkge1xyXG4gICAgcmV0dXJuIG5ldyBEYXRlKERhdGUuVVRDLmFwcGx5KERhdGUsIGFyZ3VtZW50cykpO1xyXG4gIH1cclxuXHJcbiAgLy8gUGlja2VyIG9iamVjdFxyXG4gIHZhciBEYXRldGltZXBpY2tlciA9IGZ1bmN0aW9uIChlbGVtZW50LCBvcHRpb25zKSB7XHJcbiAgICB2YXIgdGhhdCA9IHRoaXM7XHJcblxyXG4gICAgdGhpcy5lbGVtZW50ID0gJChlbGVtZW50KTtcclxuXHJcbiAgICAvLyBhZGQgY29udGFpbmVyIGZvciBzaW5nbGUgcGFnZSBhcHBsaWNhdGlvblxyXG4gICAgLy8gd2hlbiBwYWdlIHN3aXRjaCB0aGUgZGF0ZXRpbWVwaWNrZXIgZGl2IHdpbGwgYmUgcmVtb3ZlZCBhbHNvLlxyXG4gICAgdGhpcy5jb250YWluZXIgPSBvcHRpb25zLmNvbnRhaW5lciB8fCAnYm9keSc7XHJcblxyXG4gICAgdGhpcy5sYW5ndWFnZSA9IG9wdGlvbnMubGFuZ3VhZ2UgfHwgdGhpcy5lbGVtZW50LmRhdGEoJ2RhdGUtbGFuZ3VhZ2UnKSB8fCAnZW4nO1xyXG4gICAgdGhpcy5sYW5ndWFnZSA9IHRoaXMubGFuZ3VhZ2UgaW4gZGF0ZXMgPyB0aGlzLmxhbmd1YWdlIDogdGhpcy5sYW5ndWFnZS5zcGxpdCgnLScpWzBdOyAvLyBmci1DQSBmYWxsYmFjayB0byBmclxyXG4gICAgdGhpcy5sYW5ndWFnZSA9IHRoaXMubGFuZ3VhZ2UgaW4gZGF0ZXMgPyB0aGlzLmxhbmd1YWdlIDogJ2VuJztcclxuICAgIHRoaXMuaXNSVEwgPSBkYXRlc1t0aGlzLmxhbmd1YWdlXS5ydGwgfHwgZmFsc2U7XHJcbiAgICB0aGlzLmZvcm1hdFR5cGUgPSBvcHRpb25zLmZvcm1hdFR5cGUgfHwgdGhpcy5lbGVtZW50LmRhdGEoJ2Zvcm1hdC10eXBlJykgfHwgJ3N0YW5kYXJkJztcclxuICAgIHRoaXMuZm9ybWF0ID0gRFBHbG9iYWwucGFyc2VGb3JtYXQob3B0aW9ucy5mb3JtYXQgfHwgdGhpcy5lbGVtZW50LmRhdGEoJ2RhdGUtZm9ybWF0JykgfHwgZGF0ZXNbdGhpcy5sYW5ndWFnZV0uZm9ybWF0IHx8IERQR2xvYmFsLmdldERlZmF1bHRGb3JtYXQodGhpcy5mb3JtYXRUeXBlLCAnaW5wdXQnKSwgdGhpcy5mb3JtYXRUeXBlKTtcclxuICAgIHRoaXMuaXNJbmxpbmUgPSBmYWxzZTtcclxuICAgIHRoaXMuaXNWaXNpYmxlID0gZmFsc2U7XHJcbiAgICB0aGlzLmlzSW5wdXQgPSB0aGlzLmVsZW1lbnQuaXMoJ2lucHV0Jyk7XHJcbiAgICB0aGlzLmZvbnRBd2Vzb21lID0gb3B0aW9ucy5mb250QXdlc29tZSB8fCB0aGlzLmVsZW1lbnQuZGF0YSgnZm9udC1hd2Vzb21lJykgfHwgZmFsc2U7XHJcblxyXG4gICAgdGhpcy5ib290Y3NzVmVyID0gb3B0aW9ucy5ib290Y3NzVmVyIHx8ICh0aGlzLmlzSW5wdXQgPyAodGhpcy5lbGVtZW50LmlzKCcuZm9ybS1jb250cm9sJykgPyAzIDogMikgOiAoIHRoaXMuYm9vdGNzc1ZlciA9IHRoaXMuZWxlbWVudC5pcygnLmlucHV0LWdyb3VwJykgPyAzIDogMiApKTtcclxuXHJcbiAgICB0aGlzLmNvbXBvbmVudCA9IHRoaXMuZWxlbWVudC5pcygnLmRhdGUnKSA/ICggdGhpcy5ib290Y3NzVmVyID09PSAzID8gdGhpcy5lbGVtZW50LmZpbmQoJy5pbnB1dC1ncm91cC1hZGRvbiAuZ2x5cGhpY29uLXRoLCAuaW5wdXQtZ3JvdXAtYWRkb24gLmdseXBoaWNvbi10aW1lLCAuaW5wdXQtZ3JvdXAtYWRkb24gLmdseXBoaWNvbi1yZW1vdmUsIC5pbnB1dC1ncm91cC1hZGRvbiAuZ2x5cGhpY29uLWNhbGVuZGFyLCAuaW5wdXQtZ3JvdXAtYWRkb24gLmZhLWNhbGVuZGFyLCAuaW5wdXQtZ3JvdXAtYWRkb24gLmZhLWNsb2NrLW8nKS5wYXJlbnQoKSA6IHRoaXMuZWxlbWVudC5maW5kKCcuYWRkLW9uIC5pY29uLXRoLCAuYWRkLW9uIC5pY29uLXRpbWUsIC5hZGQtb24gLmljb24tY2FsZW5kYXIsIC5hZGQtb24gLmZhLWNhbGVuZGFyLCAuYWRkLW9uIC5mYS1jbG9jay1vJykucGFyZW50KCkpIDogZmFsc2U7XHJcbiAgICB0aGlzLmNvbXBvbmVudFJlc2V0ID0gdGhpcy5lbGVtZW50LmlzKCcuZGF0ZScpID8gKCB0aGlzLmJvb3Rjc3NWZXIgPT09IDMgPyB0aGlzLmVsZW1lbnQuZmluZCgnLmlucHV0LWdyb3VwLWFkZG9uIC5nbHlwaGljb24tcmVtb3ZlLCAuaW5wdXQtZ3JvdXAtYWRkb24gLmZhLXRpbWVzJykucGFyZW50KCk6dGhpcy5lbGVtZW50LmZpbmQoJy5hZGQtb24gLmljb24tcmVtb3ZlLCAuYWRkLW9uIC5mYS10aW1lcycpLnBhcmVudCgpKSA6IGZhbHNlO1xyXG4gICAgdGhpcy5oYXNJbnB1dCA9IHRoaXMuY29tcG9uZW50ICYmIHRoaXMuZWxlbWVudC5maW5kKCdpbnB1dCcpLmxlbmd0aDtcclxuICAgIGlmICh0aGlzLmNvbXBvbmVudCAmJiB0aGlzLmNvbXBvbmVudC5sZW5ndGggPT09IDApIHtcclxuICAgICAgdGhpcy5jb21wb25lbnQgPSBmYWxzZTtcclxuICAgIH1cclxuICAgIHRoaXMubGlua0ZpZWxkID0gb3B0aW9ucy5saW5rRmllbGQgfHwgdGhpcy5lbGVtZW50LmRhdGEoJ2xpbmstZmllbGQnKSB8fCBmYWxzZTtcclxuICAgIHRoaXMubGlua0Zvcm1hdCA9IERQR2xvYmFsLnBhcnNlRm9ybWF0KG9wdGlvbnMubGlua0Zvcm1hdCB8fCB0aGlzLmVsZW1lbnQuZGF0YSgnbGluay1mb3JtYXQnKSB8fCBEUEdsb2JhbC5nZXREZWZhdWx0Rm9ybWF0KHRoaXMuZm9ybWF0VHlwZSwgJ2xpbmsnKSwgdGhpcy5mb3JtYXRUeXBlKTtcclxuICAgIHRoaXMubWludXRlU3RlcCA9IG9wdGlvbnMubWludXRlU3RlcCB8fCB0aGlzLmVsZW1lbnQuZGF0YSgnbWludXRlLXN0ZXAnKSB8fCA1O1xyXG4gICAgdGhpcy5waWNrZXJQb3NpdGlvbiA9IG9wdGlvbnMucGlja2VyUG9zaXRpb24gfHwgdGhpcy5lbGVtZW50LmRhdGEoJ3BpY2tlci1wb3NpdGlvbicpIHx8ICdib3R0b20tcmlnaHQnO1xyXG4gICAgdGhpcy5zaG93TWVyaWRpYW4gPSBvcHRpb25zLnNob3dNZXJpZGlhbiB8fCB0aGlzLmVsZW1lbnQuZGF0YSgnc2hvdy1tZXJpZGlhbicpIHx8IGZhbHNlO1xyXG4gICAgdGhpcy5pbml0aWFsRGF0ZSA9IG9wdGlvbnMuaW5pdGlhbERhdGUgfHwgbmV3IERhdGUoKTtcclxuICAgIHRoaXMuekluZGV4ID0gb3B0aW9ucy56SW5kZXggfHwgdGhpcy5lbGVtZW50LmRhdGEoJ3otaW5kZXgnKSB8fCB1bmRlZmluZWQ7XHJcbiAgICB0aGlzLnRpdGxlID0gdHlwZW9mIG9wdGlvbnMudGl0bGUgPT09ICd1bmRlZmluZWQnID8gZmFsc2UgOiBvcHRpb25zLnRpdGxlO1xyXG4gICAgdGhpcy50aW1lem9uZSA9IG9wdGlvbnMudGltZXpvbmUgfHwgdGltZVpvbmVBYmJyZXZpYXRpb24oKTtcclxuXHJcbiAgICB0aGlzLmljb25zID0ge1xyXG4gICAgICBsZWZ0QXJyb3c6IHRoaXMuZm9udEF3ZXNvbWUgPyAnZmEtYXJyb3ctbGVmdCcgOiAodGhpcy5ib290Y3NzVmVyID09PSAzID8gJ2dseXBoaWNvbi1hcnJvdy1sZWZ0JyA6ICdpY29uLWFycm93LWxlZnQnKSxcclxuICAgICAgcmlnaHRBcnJvdzogdGhpcy5mb250QXdlc29tZSA/ICdmYS1hcnJvdy1yaWdodCcgOiAodGhpcy5ib290Y3NzVmVyID09PSAzID8gJ2dseXBoaWNvbi1hcnJvdy1yaWdodCcgOiAnaWNvbi1hcnJvdy1yaWdodCcpXHJcbiAgICB9XHJcbiAgICB0aGlzLmljb250eXBlID0gdGhpcy5mb250QXdlc29tZSA/ICdmYScgOiAnZ2x5cGhpY29uJztcclxuXHJcbiAgICB0aGlzLl9hdHRhY2hFdmVudHMoKTtcclxuXHJcbiAgICB0aGlzLmNsaWNrZWRPdXRzaWRlID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAvLyBDbGlja2VkIG91dHNpZGUgdGhlIGRhdGV0aW1lcGlja2VyLCBoaWRlIGl0XHJcbiAgICAgICAgaWYgKCQoZS50YXJnZXQpLmNsb3Nlc3QoJy5kYXRldGltZXBpY2tlcicpLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICB0aGF0LmhpZGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5mb3JtYXRWaWV3VHlwZSA9ICdkYXRldGltZSc7XHJcbiAgICBpZiAoJ2Zvcm1hdFZpZXdUeXBlJyBpbiBvcHRpb25zKSB7XHJcbiAgICAgIHRoaXMuZm9ybWF0Vmlld1R5cGUgPSBvcHRpb25zLmZvcm1hdFZpZXdUeXBlO1xyXG4gICAgfSBlbHNlIGlmICgnZm9ybWF0Vmlld1R5cGUnIGluIHRoaXMuZWxlbWVudC5kYXRhKCkpIHtcclxuICAgICAgdGhpcy5mb3JtYXRWaWV3VHlwZSA9IHRoaXMuZWxlbWVudC5kYXRhKCdmb3JtYXRWaWV3VHlwZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubWluVmlldyA9IDA7XHJcbiAgICBpZiAoJ21pblZpZXcnIGluIG9wdGlvbnMpIHtcclxuICAgICAgdGhpcy5taW5WaWV3ID0gb3B0aW9ucy5taW5WaWV3O1xyXG4gICAgfSBlbHNlIGlmICgnbWluVmlldycgaW4gdGhpcy5lbGVtZW50LmRhdGEoKSkge1xyXG4gICAgICB0aGlzLm1pblZpZXcgPSB0aGlzLmVsZW1lbnQuZGF0YSgnbWluLXZpZXcnKTtcclxuICAgIH1cclxuICAgIHRoaXMubWluVmlldyA9IERQR2xvYmFsLmNvbnZlcnRWaWV3TW9kZSh0aGlzLm1pblZpZXcpO1xyXG5cclxuICAgIHRoaXMubWF4VmlldyA9IERQR2xvYmFsLm1vZGVzLmxlbmd0aCAtIDE7XHJcbiAgICBpZiAoJ21heFZpZXcnIGluIG9wdGlvbnMpIHtcclxuICAgICAgdGhpcy5tYXhWaWV3ID0gb3B0aW9ucy5tYXhWaWV3O1xyXG4gICAgfSBlbHNlIGlmICgnbWF4VmlldycgaW4gdGhpcy5lbGVtZW50LmRhdGEoKSkge1xyXG4gICAgICB0aGlzLm1heFZpZXcgPSB0aGlzLmVsZW1lbnQuZGF0YSgnbWF4LXZpZXcnKTtcclxuICAgIH1cclxuICAgIHRoaXMubWF4VmlldyA9IERQR2xvYmFsLmNvbnZlcnRWaWV3TW9kZSh0aGlzLm1heFZpZXcpO1xyXG5cclxuICAgIHRoaXMud2hlZWxWaWV3TW9kZU5hdmlnYXRpb24gPSBmYWxzZTtcclxuICAgIGlmICgnd2hlZWxWaWV3TW9kZU5hdmlnYXRpb24nIGluIG9wdGlvbnMpIHtcclxuICAgICAgdGhpcy53aGVlbFZpZXdNb2RlTmF2aWdhdGlvbiA9IG9wdGlvbnMud2hlZWxWaWV3TW9kZU5hdmlnYXRpb247XHJcbiAgICB9IGVsc2UgaWYgKCd3aGVlbFZpZXdNb2RlTmF2aWdhdGlvbicgaW4gdGhpcy5lbGVtZW50LmRhdGEoKSkge1xyXG4gICAgICB0aGlzLndoZWVsVmlld01vZGVOYXZpZ2F0aW9uID0gdGhpcy5lbGVtZW50LmRhdGEoJ3ZpZXctbW9kZS13aGVlbC1uYXZpZ2F0aW9uJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy53aGVlbFZpZXdNb2RlTmF2aWdhdGlvbkludmVyc2VEaXJlY3Rpb24gPSBmYWxzZTtcclxuXHJcbiAgICBpZiAoJ3doZWVsVmlld01vZGVOYXZpZ2F0aW9uSW52ZXJzZURpcmVjdGlvbicgaW4gb3B0aW9ucykge1xyXG4gICAgICB0aGlzLndoZWVsVmlld01vZGVOYXZpZ2F0aW9uSW52ZXJzZURpcmVjdGlvbiA9IG9wdGlvbnMud2hlZWxWaWV3TW9kZU5hdmlnYXRpb25JbnZlcnNlRGlyZWN0aW9uO1xyXG4gICAgfSBlbHNlIGlmICgnd2hlZWxWaWV3TW9kZU5hdmlnYXRpb25JbnZlcnNlRGlyZWN0aW9uJyBpbiB0aGlzLmVsZW1lbnQuZGF0YSgpKSB7XHJcbiAgICAgIHRoaXMud2hlZWxWaWV3TW9kZU5hdmlnYXRpb25JbnZlcnNlRGlyZWN0aW9uID0gdGhpcy5lbGVtZW50LmRhdGEoJ3ZpZXctbW9kZS13aGVlbC1uYXZpZ2F0aW9uLWludmVyc2UtZGlyJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy53aGVlbFZpZXdNb2RlTmF2aWdhdGlvbkRlbGF5ID0gMTAwO1xyXG4gICAgaWYgKCd3aGVlbFZpZXdNb2RlTmF2aWdhdGlvbkRlbGF5JyBpbiBvcHRpb25zKSB7XHJcbiAgICAgIHRoaXMud2hlZWxWaWV3TW9kZU5hdmlnYXRpb25EZWxheSA9IG9wdGlvbnMud2hlZWxWaWV3TW9kZU5hdmlnYXRpb25EZWxheTtcclxuICAgIH0gZWxzZSBpZiAoJ3doZWVsVmlld01vZGVOYXZpZ2F0aW9uRGVsYXknIGluIHRoaXMuZWxlbWVudC5kYXRhKCkpIHtcclxuICAgICAgdGhpcy53aGVlbFZpZXdNb2RlTmF2aWdhdGlvbkRlbGF5ID0gdGhpcy5lbGVtZW50LmRhdGEoJ3ZpZXctbW9kZS13aGVlbC1uYXZpZ2F0aW9uLWRlbGF5Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zdGFydFZpZXdNb2RlID0gMjtcclxuICAgIGlmICgnc3RhcnRWaWV3JyBpbiBvcHRpb25zKSB7XHJcbiAgICAgIHRoaXMuc3RhcnRWaWV3TW9kZSA9IG9wdGlvbnMuc3RhcnRWaWV3O1xyXG4gICAgfSBlbHNlIGlmICgnc3RhcnRWaWV3JyBpbiB0aGlzLmVsZW1lbnQuZGF0YSgpKSB7XHJcbiAgICAgIHRoaXMuc3RhcnRWaWV3TW9kZSA9IHRoaXMuZWxlbWVudC5kYXRhKCdzdGFydC12aWV3Jyk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnN0YXJ0Vmlld01vZGUgPSBEUEdsb2JhbC5jb252ZXJ0Vmlld01vZGUodGhpcy5zdGFydFZpZXdNb2RlKTtcclxuICAgIHRoaXMudmlld01vZGUgPSB0aGlzLnN0YXJ0Vmlld01vZGU7XHJcblxyXG4gICAgdGhpcy52aWV3U2VsZWN0ID0gdGhpcy5taW5WaWV3O1xyXG4gICAgaWYgKCd2aWV3U2VsZWN0JyBpbiBvcHRpb25zKSB7XHJcbiAgICAgIHRoaXMudmlld1NlbGVjdCA9IG9wdGlvbnMudmlld1NlbGVjdDtcclxuICAgIH0gZWxzZSBpZiAoJ3ZpZXdTZWxlY3QnIGluIHRoaXMuZWxlbWVudC5kYXRhKCkpIHtcclxuICAgICAgdGhpcy52aWV3U2VsZWN0ID0gdGhpcy5lbGVtZW50LmRhdGEoJ3ZpZXctc2VsZWN0Jyk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnZpZXdTZWxlY3QgPSBEUEdsb2JhbC5jb252ZXJ0Vmlld01vZGUodGhpcy52aWV3U2VsZWN0KTtcclxuXHJcbiAgICB0aGlzLmZvcmNlUGFyc2UgPSB0cnVlO1xyXG4gICAgaWYgKCdmb3JjZVBhcnNlJyBpbiBvcHRpb25zKSB7XHJcbiAgICAgIHRoaXMuZm9yY2VQYXJzZSA9IG9wdGlvbnMuZm9yY2VQYXJzZTtcclxuICAgIH0gZWxzZSBpZiAoJ2RhdGVGb3JjZVBhcnNlJyBpbiB0aGlzLmVsZW1lbnQuZGF0YSgpKSB7XHJcbiAgICAgIHRoaXMuZm9yY2VQYXJzZSA9IHRoaXMuZWxlbWVudC5kYXRhKCdkYXRlLWZvcmNlLXBhcnNlJyk7XHJcbiAgICB9XHJcbiAgICB2YXIgdGVtcGxhdGUgPSB0aGlzLmJvb3Rjc3NWZXIgPT09IDMgPyBEUEdsb2JhbC50ZW1wbGF0ZVYzIDogRFBHbG9iYWwudGVtcGxhdGU7XHJcbiAgICB3aGlsZSAodGVtcGxhdGUuaW5kZXhPZigne2ljb25UeXBlfScpICE9PSAtMSkge1xyXG4gICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UoJ3tpY29uVHlwZX0nLCB0aGlzLmljb250eXBlKTtcclxuICAgIH1cclxuICAgIHdoaWxlICh0ZW1wbGF0ZS5pbmRleE9mKCd7bGVmdEFycm93fScpICE9PSAtMSkge1xyXG4gICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UoJ3tsZWZ0QXJyb3d9JywgdGhpcy5pY29ucy5sZWZ0QXJyb3cpO1xyXG4gICAgfVxyXG4gICAgd2hpbGUgKHRlbXBsYXRlLmluZGV4T2YoJ3tyaWdodEFycm93fScpICE9PSAtMSkge1xyXG4gICAgICB0ZW1wbGF0ZSA9IHRlbXBsYXRlLnJlcGxhY2UoJ3tyaWdodEFycm93fScsIHRoaXMuaWNvbnMucmlnaHRBcnJvdyk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnBpY2tlciA9ICQodGVtcGxhdGUpXHJcbiAgICAgIC5hcHBlbmRUbyh0aGlzLmlzSW5saW5lID8gdGhpcy5lbGVtZW50IDogdGhpcy5jb250YWluZXIpIC8vICdib2R5JylcclxuICAgICAgLm9uKHtcclxuICAgICAgICBjbGljazogICAgICQucHJveHkodGhpcy5jbGljaywgdGhpcyksXHJcbiAgICAgICAgbW91c2Vkb3duOiAkLnByb3h5KHRoaXMubW91c2Vkb3duLCB0aGlzKVxyXG4gICAgICB9KTtcclxuXHJcbiAgICBpZiAodGhpcy53aGVlbFZpZXdNb2RlTmF2aWdhdGlvbikge1xyXG4gICAgICBpZiAoJC5mbi5tb3VzZXdoZWVsKSB7XHJcbiAgICAgICAgdGhpcy5waWNrZXIub24oe21vdXNld2hlZWw6ICQucHJveHkodGhpcy5tb3VzZXdoZWVsLCB0aGlzKX0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdNb3VzZSBXaGVlbCBldmVudCBpcyBub3Qgc3VwcG9ydGVkLiBQbGVhc2UgaW5jbHVkZSB0aGUgalF1ZXJ5IE1vdXNlIFdoZWVsIHBsdWdpbiBiZWZvcmUgZW5hYmxpbmcgdGhpcyBvcHRpb24nKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzSW5saW5lKSB7XHJcbiAgICAgIHRoaXMucGlja2VyLmFkZENsYXNzKCdkYXRldGltZXBpY2tlci1pbmxpbmUnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMucGlja2VyLmFkZENsYXNzKCdkYXRldGltZXBpY2tlci1kcm9wZG93bi0nICsgdGhpcy5waWNrZXJQb3NpdGlvbiArICcgZHJvcGRvd24tbWVudScpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuaXNSVEwpIHtcclxuICAgICAgdGhpcy5waWNrZXIuYWRkQ2xhc3MoJ2RhdGV0aW1lcGlja2VyLXJ0bCcpO1xyXG4gICAgICB2YXIgc2VsZWN0b3IgPSB0aGlzLmJvb3Rjc3NWZXIgPT09IDMgPyAnLnByZXYgc3BhbiwgLm5leHQgc3BhbicgOiAnLnByZXYgaSwgLm5leHQgaSc7XHJcbiAgICAgIHRoaXMucGlja2VyLmZpbmQoc2VsZWN0b3IpLnRvZ2dsZUNsYXNzKHRoaXMuaWNvbnMubGVmdEFycm93ICsgJyAnICsgdGhpcy5pY29ucy5yaWdodEFycm93KTtcclxuICAgIH1cclxuXHJcbiAgICAkKGRvY3VtZW50KS5vbignbW91c2Vkb3duIHRvdWNoZW5kJywgdGhpcy5jbGlja2VkT3V0c2lkZSk7XHJcblxyXG4gICAgdGhpcy5hdXRvY2xvc2UgPSBmYWxzZTtcclxuICAgIGlmICgnYXV0b2Nsb3NlJyBpbiBvcHRpb25zKSB7XHJcbiAgICAgIHRoaXMuYXV0b2Nsb3NlID0gb3B0aW9ucy5hdXRvY2xvc2U7XHJcbiAgICB9IGVsc2UgaWYgKCdkYXRlQXV0b2Nsb3NlJyBpbiB0aGlzLmVsZW1lbnQuZGF0YSgpKSB7XHJcbiAgICAgIHRoaXMuYXV0b2Nsb3NlID0gdGhpcy5lbGVtZW50LmRhdGEoJ2RhdGUtYXV0b2Nsb3NlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5rZXlib2FyZE5hdmlnYXRpb24gPSB0cnVlO1xyXG4gICAgaWYgKCdrZXlib2FyZE5hdmlnYXRpb24nIGluIG9wdGlvbnMpIHtcclxuICAgICAgdGhpcy5rZXlib2FyZE5hdmlnYXRpb24gPSBvcHRpb25zLmtleWJvYXJkTmF2aWdhdGlvbjtcclxuICAgIH0gZWxzZSBpZiAoJ2RhdGVLZXlib2FyZE5hdmlnYXRpb24nIGluIHRoaXMuZWxlbWVudC5kYXRhKCkpIHtcclxuICAgICAgdGhpcy5rZXlib2FyZE5hdmlnYXRpb24gPSB0aGlzLmVsZW1lbnQuZGF0YSgnZGF0ZS1rZXlib2FyZC1uYXZpZ2F0aW9uJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy50b2RheUJ0biA9IChvcHRpb25zLnRvZGF5QnRuIHx8IHRoaXMuZWxlbWVudC5kYXRhKCdkYXRlLXRvZGF5LWJ0bicpIHx8IGZhbHNlKTtcclxuICAgIHRoaXMuY2xlYXJCdG4gPSAob3B0aW9ucy5jbGVhckJ0biB8fCB0aGlzLmVsZW1lbnQuZGF0YSgnZGF0ZS1jbGVhci1idG4nKSB8fCBmYWxzZSk7XHJcbiAgICB0aGlzLnRvZGF5SGlnaGxpZ2h0ID0gKG9wdGlvbnMudG9kYXlIaWdobGlnaHQgfHwgdGhpcy5lbGVtZW50LmRhdGEoJ2RhdGUtdG9kYXktaGlnaGxpZ2h0JykgfHwgZmFsc2UpO1xyXG5cclxuICAgIHRoaXMud2Vla1N0YXJ0ID0gMDtcclxuICAgIGlmICh0eXBlb2Ygb3B0aW9ucy53ZWVrU3RhcnQgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgIHRoaXMud2Vla1N0YXJ0ID0gb3B0aW9ucy53ZWVrU3RhcnQ7XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiB0aGlzLmVsZW1lbnQuZGF0YSgnZGF0ZS13ZWVrc3RhcnQnKSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgdGhpcy53ZWVrU3RhcnQgPSB0aGlzLmVsZW1lbnQuZGF0YSgnZGF0ZS13ZWVrc3RhcnQnKTtcclxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGRhdGVzW3RoaXMubGFuZ3VhZ2VdLndlZWtTdGFydCAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgdGhpcy53ZWVrU3RhcnQgPSBkYXRlc1t0aGlzLmxhbmd1YWdlXS53ZWVrU3RhcnQ7XHJcbiAgICB9XHJcbiAgICB0aGlzLndlZWtTdGFydCA9IHRoaXMud2Vla1N0YXJ0ICUgNztcclxuICAgIHRoaXMud2Vla0VuZCA9ICgodGhpcy53ZWVrU3RhcnQgKyA2KSAlIDcpO1xyXG4gICAgdGhpcy5vblJlbmRlckRheSA9IGZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgIHZhciByZW5kZXIgPSAob3B0aW9ucy5vblJlbmRlckRheSB8fCBmdW5jdGlvbiAoKSB7IHJldHVybiBbXTsgfSkoZGF0ZSk7XHJcbiAgICAgIGlmICh0eXBlb2YgcmVuZGVyID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHJlbmRlciA9IFtyZW5kZXJdO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciByZXMgPSBbJ2RheSddO1xyXG4gICAgICByZXR1cm4gcmVzLmNvbmNhdCgocmVuZGVyID8gcmVuZGVyIDogW10pKTtcclxuICAgIH07XHJcbiAgICB0aGlzLm9uUmVuZGVySG91ciA9IGZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgIHZhciByZW5kZXIgPSAob3B0aW9ucy5vblJlbmRlckhvdXIgfHwgZnVuY3Rpb24gKCkgeyByZXR1cm4gW107IH0pKGRhdGUpO1xyXG4gICAgICB2YXIgcmVzID0gWydob3VyJ107XHJcbiAgICAgIGlmICh0eXBlb2YgcmVuZGVyID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHJlbmRlciA9IFtyZW5kZXJdO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByZXMuY29uY2F0KChyZW5kZXIgPyByZW5kZXIgOiBbXSkpO1xyXG4gICAgfTtcclxuICAgIHRoaXMub25SZW5kZXJNaW51dGUgPSBmdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgICB2YXIgcmVuZGVyID0gKG9wdGlvbnMub25SZW5kZXJNaW51dGUgfHwgZnVuY3Rpb24gKCkgeyByZXR1cm4gW107IH0pKGRhdGUpO1xyXG4gICAgICB2YXIgcmVzID0gWydtaW51dGUnXTtcclxuICAgICAgaWYgKHR5cGVvZiByZW5kZXIgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgcmVuZGVyID0gW3JlbmRlcl07XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRhdGUgPCB0aGlzLnN0YXJ0RGF0ZSB8fCBkYXRlID4gdGhpcy5lbmREYXRlKSB7XHJcbiAgICAgICAgcmVzLnB1c2goJ2Rpc2FibGVkJyk7XHJcbiAgICAgIH0gZWxzZSBpZiAoTWF0aC5mbG9vcih0aGlzLmRhdGUuZ2V0VVRDTWludXRlcygpIC8gdGhpcy5taW51dGVTdGVwKSA9PT0gTWF0aC5mbG9vcihkYXRlLmdldFVUQ01pbnV0ZXMoKSAvIHRoaXMubWludXRlU3RlcCkpIHtcclxuICAgICAgICByZXMucHVzaCgnYWN0aXZlJyk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJlcy5jb25jYXQoKHJlbmRlciA/IHJlbmRlciA6IFtdKSk7XHJcbiAgICB9O1xyXG4gICAgdGhpcy5vblJlbmRlclllYXIgPSBmdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgICB2YXIgcmVuZGVyID0gKG9wdGlvbnMub25SZW5kZXJZZWFyIHx8IGZ1bmN0aW9uICgpIHsgcmV0dXJuIFtdOyB9KShkYXRlKTtcclxuICAgICAgdmFyIHJlcyA9IFsneWVhciddO1xyXG4gICAgICBpZiAodHlwZW9mIHJlbmRlciA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICByZW5kZXIgPSBbcmVuZGVyXTtcclxuICAgICAgfVxyXG4gICAgICBpZiAodGhpcy5kYXRlLmdldFVUQ0Z1bGxZZWFyKCkgPT09IGRhdGUuZ2V0VVRDRnVsbFllYXIoKSkge1xyXG4gICAgICAgIHJlcy5wdXNoKCdhY3RpdmUnKTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgY3VycmVudFllYXIgPSBkYXRlLmdldFVUQ0Z1bGxZZWFyKCk7XHJcbiAgICAgIHZhciBlbmRZZWFyID0gdGhpcy5lbmREYXRlLmdldFVUQ0Z1bGxZZWFyKCk7XHJcbiAgICAgIGlmIChkYXRlIDwgdGhpcy5zdGFydERhdGUgfHwgY3VycmVudFllYXIgPiBlbmRZZWFyKSB7XHJcbiAgICAgICAgcmVzLnB1c2goJ2Rpc2FibGVkJyk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHJlcy5jb25jYXQoKHJlbmRlciA/IHJlbmRlciA6IFtdKSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLm9uUmVuZGVyTW9udGggPSBmdW5jdGlvbiAoZGF0ZSkge1xyXG4gICAgICB2YXIgcmVuZGVyID0gKG9wdGlvbnMub25SZW5kZXJNb250aCB8fCBmdW5jdGlvbiAoKSB7IHJldHVybiBbXTsgfSkoZGF0ZSk7XHJcbiAgICAgIHZhciByZXMgPSBbJ21vbnRoJ107XHJcbiAgICAgIGlmICh0eXBlb2YgcmVuZGVyID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHJlbmRlciA9IFtyZW5kZXJdO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiByZXMuY29uY2F0KChyZW5kZXIgPyByZW5kZXIgOiBbXSkpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zdGFydERhdGUgPSBuZXcgRGF0ZSgtODYzOTk2ODQ0MzA0ODAwMCk7XHJcbiAgICB0aGlzLmVuZERhdGUgPSBuZXcgRGF0ZSg4NjM5OTY4NDQzMDQ4MDAwKTtcclxuICAgIHRoaXMuZGF0ZXNEaXNhYmxlZCA9IFtdO1xyXG4gICAgdGhpcy5kYXlzT2ZXZWVrRGlzYWJsZWQgPSBbXTtcclxuICAgIHRoaXMuc2V0U3RhcnREYXRlKG9wdGlvbnMuc3RhcnREYXRlIHx8IHRoaXMuZWxlbWVudC5kYXRhKCdkYXRlLXN0YXJ0ZGF0ZScpKTtcclxuICAgIHRoaXMuc2V0RW5kRGF0ZShvcHRpb25zLmVuZERhdGUgfHwgdGhpcy5lbGVtZW50LmRhdGEoJ2RhdGUtZW5kZGF0ZScpKTtcclxuICAgIHRoaXMuc2V0RGF0ZXNEaXNhYmxlZChvcHRpb25zLmRhdGVzRGlzYWJsZWQgfHwgdGhpcy5lbGVtZW50LmRhdGEoJ2RhdGUtZGF0ZXMtZGlzYWJsZWQnKSk7XHJcbiAgICB0aGlzLnNldERheXNPZldlZWtEaXNhYmxlZChvcHRpb25zLmRheXNPZldlZWtEaXNhYmxlZCB8fCB0aGlzLmVsZW1lbnQuZGF0YSgnZGF0ZS1kYXlzLW9mLXdlZWstZGlzYWJsZWQnKSk7XHJcbiAgICB0aGlzLnNldE1pbnV0ZXNEaXNhYmxlZChvcHRpb25zLm1pbnV0ZXNEaXNhYmxlZCB8fCB0aGlzLmVsZW1lbnQuZGF0YSgnZGF0ZS1taW51dGUtZGlzYWJsZWQnKSk7XHJcbiAgICB0aGlzLnNldEhvdXJzRGlzYWJsZWQob3B0aW9ucy5ob3Vyc0Rpc2FibGVkIHx8IHRoaXMuZWxlbWVudC5kYXRhKCdkYXRlLWhvdXItZGlzYWJsZWQnKSk7XHJcbiAgICB0aGlzLmZpbGxEb3coKTtcclxuICAgIHRoaXMuZmlsbE1vbnRocygpO1xyXG4gICAgdGhpcy51cGRhdGUoKTtcclxuICAgIHRoaXMuc2hvd01vZGUoKTtcclxuXHJcbiAgICBpZiAodGhpcy5pc0lubGluZSkge1xyXG4gICAgICB0aGlzLnNob3coKTtcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBEYXRldGltZXBpY2tlci5wcm90b3R5cGUgPSB7XHJcbiAgICBjb25zdHJ1Y3RvcjogRGF0ZXRpbWVwaWNrZXIsXHJcblxyXG4gICAgX2V2ZW50czogICAgICAgW10sXHJcbiAgICBfYXR0YWNoRXZlbnRzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuX2RldGFjaEV2ZW50cygpO1xyXG4gICAgICBpZiAodGhpcy5pc0lucHV0KSB7IC8vIHNpbmdsZSBpbnB1dFxyXG4gICAgICAgIHRoaXMuX2V2ZW50cyA9IFtcclxuICAgICAgICAgIFt0aGlzLmVsZW1lbnQsIHtcclxuICAgICAgICAgICAgZm9jdXM6ICAgJC5wcm94eSh0aGlzLnNob3csIHRoaXMpLFxyXG4gICAgICAgICAgICBrZXl1cDogICAkLnByb3h5KHRoaXMudXBkYXRlLCB0aGlzKSxcclxuICAgICAgICAgICAga2V5ZG93bjogJC5wcm94eSh0aGlzLmtleWRvd24sIHRoaXMpXHJcbiAgICAgICAgICB9XVxyXG4gICAgICAgIF07XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAodGhpcy5jb21wb25lbnQgJiYgdGhpcy5oYXNJbnB1dCkgeyAvLyBjb21wb25lbnQ6IGlucHV0ICsgYnV0dG9uXHJcbiAgICAgICAgdGhpcy5fZXZlbnRzID0gW1xyXG4gICAgICAgICAgLy8gRm9yIGNvbXBvbmVudHMgdGhhdCBhcmUgbm90IHJlYWRvbmx5LCBhbGxvdyBrZXlib2FyZCBuYXZcclxuICAgICAgICAgIFt0aGlzLmVsZW1lbnQuZmluZCgnaW5wdXQnKSwge1xyXG4gICAgICAgICAgICBmb2N1czogICAkLnByb3h5KHRoaXMuc2hvdywgdGhpcyksXHJcbiAgICAgICAgICAgIGtleXVwOiAgICQucHJveHkodGhpcy51cGRhdGUsIHRoaXMpLFxyXG4gICAgICAgICAgICBrZXlkb3duOiAkLnByb3h5KHRoaXMua2V5ZG93biwgdGhpcylcclxuICAgICAgICAgIH1dLFxyXG4gICAgICAgICAgW3RoaXMuY29tcG9uZW50LCB7XHJcbiAgICAgICAgICAgIGNsaWNrOiAkLnByb3h5KHRoaXMuc2hvdywgdGhpcylcclxuICAgICAgICAgIH1dXHJcbiAgICAgICAgXTtcclxuICAgICAgICBpZiAodGhpcy5jb21wb25lbnRSZXNldCkge1xyXG4gICAgICAgICAgdGhpcy5fZXZlbnRzLnB1c2goW1xyXG4gICAgICAgICAgICB0aGlzLmNvbXBvbmVudFJlc2V0LFxyXG4gICAgICAgICAgICB7Y2xpY2s6ICQucHJveHkodGhpcy5yZXNldCwgdGhpcyl9XHJcbiAgICAgICAgICBdKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSBpZiAodGhpcy5lbGVtZW50LmlzKCdkaXYnKSkgeyAgLy8gaW5saW5lIGRhdGV0aW1lcGlja2VyXHJcbiAgICAgICAgdGhpcy5pc0lubGluZSA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgICAgZWxzZSB7XHJcbiAgICAgICAgdGhpcy5fZXZlbnRzID0gW1xyXG4gICAgICAgICAgW3RoaXMuZWxlbWVudCwge1xyXG4gICAgICAgICAgICBjbGljazogJC5wcm94eSh0aGlzLnNob3csIHRoaXMpXHJcbiAgICAgICAgICB9XVxyXG4gICAgICAgIF07XHJcbiAgICAgIH1cclxuICAgICAgZm9yICh2YXIgaSA9IDAsIGVsLCBldjsgaSA8IHRoaXMuX2V2ZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGVsID0gdGhpcy5fZXZlbnRzW2ldWzBdO1xyXG4gICAgICAgIGV2ID0gdGhpcy5fZXZlbnRzW2ldWzFdO1xyXG4gICAgICAgIGVsLm9uKGV2KTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfZGV0YWNoRXZlbnRzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwLCBlbCwgZXY7IGkgPCB0aGlzLl9ldmVudHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBlbCA9IHRoaXMuX2V2ZW50c1tpXVswXTtcclxuICAgICAgICBldiA9IHRoaXMuX2V2ZW50c1tpXVsxXTtcclxuICAgICAgICBlbC5vZmYoZXYpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuX2V2ZW50cyA9IFtdO1xyXG4gICAgfSxcclxuXHJcbiAgICBzaG93OiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICB0aGlzLnBpY2tlci5zaG93KCk7XHJcbiAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5jb21wb25lbnQgPyB0aGlzLmNvbXBvbmVudC5vdXRlckhlaWdodCgpIDogdGhpcy5lbGVtZW50Lm91dGVySGVpZ2h0KCk7XHJcbiAgICAgIGlmICh0aGlzLmZvcmNlUGFyc2UpIHtcclxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMucGxhY2UoKTtcclxuICAgICAgJCh3aW5kb3cpLm9uKCdyZXNpemUnLCAkLnByb3h5KHRoaXMucGxhY2UsIHRoaXMpKTtcclxuICAgICAgaWYgKGUpIHtcclxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmlzVmlzaWJsZSA9IHRydWU7XHJcbiAgICAgIHRoaXMuZWxlbWVudC50cmlnZ2VyKHtcclxuICAgICAgICB0eXBlOiAnc2hvdycsXHJcbiAgICAgICAgZGF0ZTogdGhpcy5kYXRlXHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBoaWRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5pc1Zpc2libGUpIHJldHVybjtcclxuICAgICAgaWYgKHRoaXMuaXNJbmxpbmUpIHJldHVybjtcclxuICAgICAgdGhpcy5waWNrZXIuaGlkZSgpO1xyXG4gICAgICAkKHdpbmRvdykub2ZmKCdyZXNpemUnLCB0aGlzLnBsYWNlKTtcclxuICAgICAgdGhpcy52aWV3TW9kZSA9IHRoaXMuc3RhcnRWaWV3TW9kZTtcclxuICAgICAgdGhpcy5zaG93TW9kZSgpO1xyXG4gICAgICBpZiAoIXRoaXMuaXNJbnB1dCkge1xyXG4gICAgICAgICQoZG9jdW1lbnQpLm9mZignbW91c2Vkb3duJywgdGhpcy5oaWRlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKFxyXG4gICAgICAgIHRoaXMuZm9yY2VQYXJzZSAmJlxyXG4gICAgICAgICAgKFxyXG4gICAgICAgICAgICB0aGlzLmlzSW5wdXQgJiYgdGhpcy5lbGVtZW50LnZhbCgpIHx8XHJcbiAgICAgICAgICAgICAgdGhpcy5oYXNJbnB1dCAmJiB0aGlzLmVsZW1lbnQuZmluZCgnaW5wdXQnKS52YWwoKVxyXG4gICAgICAgICAgICApXHJcbiAgICAgICAgKVxyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUoKTtcclxuICAgICAgdGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcclxuICAgICAgdGhpcy5lbGVtZW50LnRyaWdnZXIoe1xyXG4gICAgICAgIHR5cGU6ICdoaWRlJyxcclxuICAgICAgICBkYXRlOiB0aGlzLmRhdGVcclxuICAgICAgfSk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlbW92ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICB0aGlzLl9kZXRhY2hFdmVudHMoKTtcclxuICAgICAgJChkb2N1bWVudCkub2ZmKCdtb3VzZWRvd24nLCB0aGlzLmNsaWNrZWRPdXRzaWRlKTtcclxuICAgICAgdGhpcy5waWNrZXIucmVtb3ZlKCk7XHJcbiAgICAgIGRlbGV0ZSB0aGlzLnBpY2tlcjtcclxuICAgICAgZGVsZXRlIHRoaXMuZWxlbWVudC5kYXRhKCkuZGF0ZXRpbWVwaWNrZXI7XHJcbiAgICB9LFxyXG5cclxuICAgIGdldERhdGU6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGQgPSB0aGlzLmdldFVUQ0RhdGUoKTtcclxuICAgICAgaWYgKGQgPT09IG51bGwpIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbmV3IERhdGUoZC5nZXRUaW1lKCkgKyAoZC5nZXRUaW1lem9uZU9mZnNldCgpICogNjAwMDApKTtcclxuICAgIH0sXHJcblxyXG4gICAgZ2V0VVRDRGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5kYXRlO1xyXG4gICAgfSxcclxuXHJcbiAgICBnZXRJbml0aWFsRGF0ZTogZnVuY3Rpb24gKCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5pbml0aWFsRGF0ZVxyXG4gICAgfSxcclxuXHJcbiAgICBzZXRJbml0aWFsRGF0ZTogZnVuY3Rpb24gKGluaXRpYWxEYXRlKSB7XHJcbiAgICAgIHRoaXMuaW5pdGlhbERhdGUgPSBpbml0aWFsRGF0ZTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0RGF0ZTogZnVuY3Rpb24gKGQpIHtcclxuICAgICAgdGhpcy5zZXRVVENEYXRlKG5ldyBEYXRlKGQuZ2V0VGltZSgpIC0gKGQuZ2V0VGltZXpvbmVPZmZzZXQoKSAqIDYwMDAwKSkpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRVVENEYXRlOiBmdW5jdGlvbiAoZCkge1xyXG4gICAgICBpZiAoZCA+PSB0aGlzLnN0YXJ0RGF0ZSAmJiBkIDw9IHRoaXMuZW5kRGF0ZSkge1xyXG4gICAgICAgIHRoaXMuZGF0ZSA9IGQ7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSgpO1xyXG4gICAgICAgIHRoaXMudmlld0RhdGUgPSB0aGlzLmRhdGU7XHJcbiAgICAgICAgdGhpcy5maWxsKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnRyaWdnZXIoe1xyXG4gICAgICAgICAgdHlwZTogICAgICAnb3V0T2ZSYW5nZScsXHJcbiAgICAgICAgICBkYXRlOiAgICAgIGQsXHJcbiAgICAgICAgICBzdGFydERhdGU6IHRoaXMuc3RhcnREYXRlLFxyXG4gICAgICAgICAgZW5kRGF0ZTogICB0aGlzLmVuZERhdGVcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBzZXRGb3JtYXQ6IGZ1bmN0aW9uIChmb3JtYXQpIHtcclxuICAgICAgdGhpcy5mb3JtYXQgPSBEUEdsb2JhbC5wYXJzZUZvcm1hdChmb3JtYXQsIHRoaXMuZm9ybWF0VHlwZSk7XHJcbiAgICAgIHZhciBlbGVtZW50O1xyXG4gICAgICBpZiAodGhpcy5pc0lucHV0KSB7XHJcbiAgICAgICAgZWxlbWVudCA9IHRoaXMuZWxlbWVudDtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbXBvbmVudCkge1xyXG4gICAgICAgIGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQuZmluZCgnaW5wdXQnKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZWxlbWVudCAmJiBlbGVtZW50LnZhbCgpKSB7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHNldFZhbHVlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBmb3JtYXR0ZWQgPSB0aGlzLmdldEZvcm1hdHRlZERhdGUoKTtcclxuICAgICAgaWYgKCF0aGlzLmlzSW5wdXQpIHtcclxuICAgICAgICBpZiAodGhpcy5jb21wb25lbnQpIHtcclxuICAgICAgICAgIHRoaXMuZWxlbWVudC5maW5kKCdpbnB1dCcpLnZhbChmb3JtYXR0ZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmVsZW1lbnQuZGF0YSgnZGF0ZScsIGZvcm1hdHRlZCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnZhbChmb3JtYXR0ZWQpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLmxpbmtGaWVsZCkge1xyXG4gICAgICAgICQoJyMnICsgdGhpcy5saW5rRmllbGQpLnZhbCh0aGlzLmdldEZvcm1hdHRlZERhdGUodGhpcy5saW5rRm9ybWF0KSk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgZ2V0Rm9ybWF0dGVkRGF0ZTogZnVuY3Rpb24gKGZvcm1hdCkge1xyXG4gICAgICBmb3JtYXQgPSBmb3JtYXQgfHwgdGhpcy5mb3JtYXQ7XHJcbiAgICAgIHJldHVybiBEUEdsb2JhbC5mb3JtYXREYXRlKHRoaXMuZGF0ZSwgZm9ybWF0LCB0aGlzLmxhbmd1YWdlLCB0aGlzLmZvcm1hdFR5cGUsIHRoaXMudGltZXpvbmUpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRTdGFydERhdGU6IGZ1bmN0aW9uIChzdGFydERhdGUpIHtcclxuICAgICAgdGhpcy5zdGFydERhdGUgPSBzdGFydERhdGUgfHwgdGhpcy5zdGFydERhdGU7XHJcbiAgICAgIGlmICh0aGlzLnN0YXJ0RGF0ZS52YWx1ZU9mKCkgIT09IDg2Mzk5Njg0NDMwNDgwMDApIHtcclxuICAgICAgICB0aGlzLnN0YXJ0RGF0ZSA9IERQR2xvYmFsLnBhcnNlRGF0ZSh0aGlzLnN0YXJ0RGF0ZSwgdGhpcy5mb3JtYXQsIHRoaXMubGFuZ3VhZ2UsIHRoaXMuZm9ybWF0VHlwZSwgdGhpcy50aW1lem9uZSk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgdGhpcy51cGRhdGVOYXZBcnJvd3MoKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0RW5kRGF0ZTogZnVuY3Rpb24gKGVuZERhdGUpIHtcclxuICAgICAgdGhpcy5lbmREYXRlID0gZW5kRGF0ZSB8fCB0aGlzLmVuZERhdGU7XHJcbiAgICAgIGlmICh0aGlzLmVuZERhdGUudmFsdWVPZigpICE9PSA4NjM5OTY4NDQzMDQ4MDAwKSB7XHJcbiAgICAgICAgdGhpcy5lbmREYXRlID0gRFBHbG9iYWwucGFyc2VEYXRlKHRoaXMuZW5kRGF0ZSwgdGhpcy5mb3JtYXQsIHRoaXMubGFuZ3VhZ2UsIHRoaXMuZm9ybWF0VHlwZSwgdGhpcy50aW1lem9uZSk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgdGhpcy51cGRhdGVOYXZBcnJvd3MoKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0RGF0ZXNEaXNhYmxlZDogZnVuY3Rpb24gKGRhdGVzRGlzYWJsZWQpIHtcclxuICAgICAgdGhpcy5kYXRlc0Rpc2FibGVkID0gZGF0ZXNEaXNhYmxlZCB8fCBbXTtcclxuICAgICAgaWYgKCEkLmlzQXJyYXkodGhpcy5kYXRlc0Rpc2FibGVkKSkge1xyXG4gICAgICAgIHRoaXMuZGF0ZXNEaXNhYmxlZCA9IHRoaXMuZGF0ZXNEaXNhYmxlZC5zcGxpdCgvLFxccyovKTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgbVRoaXMgPSB0aGlzO1xyXG4gICAgICB0aGlzLmRhdGVzRGlzYWJsZWQgPSAkLm1hcCh0aGlzLmRhdGVzRGlzYWJsZWQsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgcmV0dXJuIERQR2xvYmFsLnBhcnNlRGF0ZShkLCBtVGhpcy5mb3JtYXQsIG1UaGlzLmxhbmd1YWdlLCBtVGhpcy5mb3JtYXRUeXBlLCBtVGhpcy50aW1lem9uZSkudG9EYXRlU3RyaW5nKCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICB0aGlzLnVwZGF0ZU5hdkFycm93cygpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRUaXRsZTogZnVuY3Rpb24gKHNlbGVjdG9yLCB2YWx1ZSkge1xyXG4gICAgICByZXR1cm4gdGhpcy5waWNrZXIuZmluZChzZWxlY3RvcilcclxuICAgICAgICAuZmluZCgndGg6ZXEoMSknKVxyXG4gICAgICAgIC50ZXh0KHRoaXMudGl0bGUgPT09IGZhbHNlID8gdmFsdWUgOiB0aGlzLnRpdGxlKTtcclxuICAgIH0sXHJcblxyXG4gICAgc2V0RGF5c09mV2Vla0Rpc2FibGVkOiBmdW5jdGlvbiAoZGF5c09mV2Vla0Rpc2FibGVkKSB7XHJcbiAgICAgIHRoaXMuZGF5c09mV2Vla0Rpc2FibGVkID0gZGF5c09mV2Vla0Rpc2FibGVkIHx8IFtdO1xyXG4gICAgICBpZiAoISQuaXNBcnJheSh0aGlzLmRheXNPZldlZWtEaXNhYmxlZCkpIHtcclxuICAgICAgICB0aGlzLmRheXNPZldlZWtEaXNhYmxlZCA9IHRoaXMuZGF5c09mV2Vla0Rpc2FibGVkLnNwbGl0KC8sXFxzKi8pO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuZGF5c09mV2Vla0Rpc2FibGVkID0gJC5tYXAodGhpcy5kYXlzT2ZXZWVrRGlzYWJsZWQsIGZ1bmN0aW9uIChkKSB7XHJcbiAgICAgICAgcmV0dXJuIHBhcnNlSW50KGQsIDEwKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICAgIHRoaXMudXBkYXRlTmF2QXJyb3dzKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHNldE1pbnV0ZXNEaXNhYmxlZDogZnVuY3Rpb24gKG1pbnV0ZXNEaXNhYmxlZCkge1xyXG4gICAgICB0aGlzLm1pbnV0ZXNEaXNhYmxlZCA9IG1pbnV0ZXNEaXNhYmxlZCB8fCBbXTtcclxuICAgICAgaWYgKCEkLmlzQXJyYXkodGhpcy5taW51dGVzRGlzYWJsZWQpKSB7XHJcbiAgICAgICAgdGhpcy5taW51dGVzRGlzYWJsZWQgPSB0aGlzLm1pbnV0ZXNEaXNhYmxlZC5zcGxpdCgvLFxccyovKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLm1pbnV0ZXNEaXNhYmxlZCA9ICQubWFwKHRoaXMubWludXRlc0Rpc2FibGVkLCBmdW5jdGlvbiAoZCkge1xyXG4gICAgICAgIHJldHVybiBwYXJzZUludChkLCAxMCk7XHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICB0aGlzLnVwZGF0ZU5hdkFycm93cygpO1xyXG4gICAgfSxcclxuXHJcbiAgICBzZXRIb3Vyc0Rpc2FibGVkOiBmdW5jdGlvbiAoaG91cnNEaXNhYmxlZCkge1xyXG4gICAgICB0aGlzLmhvdXJzRGlzYWJsZWQgPSBob3Vyc0Rpc2FibGVkIHx8IFtdO1xyXG4gICAgICBpZiAoISQuaXNBcnJheSh0aGlzLmhvdXJzRGlzYWJsZWQpKSB7XHJcbiAgICAgICAgdGhpcy5ob3Vyc0Rpc2FibGVkID0gdGhpcy5ob3Vyc0Rpc2FibGVkLnNwbGl0KC8sXFxzKi8pO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuaG91cnNEaXNhYmxlZCA9ICQubWFwKHRoaXMuaG91cnNEaXNhYmxlZCwgZnVuY3Rpb24gKGQpIHtcclxuICAgICAgICByZXR1cm4gcGFyc2VJbnQoZCwgMTApO1xyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgdGhpcy51cGRhdGVOYXZBcnJvd3MoKTtcclxuICAgIH0sXHJcblxyXG4gICAgcGxhY2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgaWYgKHRoaXMuaXNJbmxpbmUpIHJldHVybjtcclxuXHJcbiAgICAgIGlmICghdGhpcy56SW5kZXgpIHtcclxuICAgICAgICB2YXIgaW5kZXhfaGlnaGVzdCA9IDA7XHJcbiAgICAgICAgJCgnZGl2JykuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB2YXIgaW5kZXhfY3VycmVudCA9IHBhcnNlSW50KCQodGhpcykuY3NzKCd6SW5kZXgnKSwgMTApO1xyXG4gICAgICAgICAgaWYgKGluZGV4X2N1cnJlbnQgPiBpbmRleF9oaWdoZXN0KSB7XHJcbiAgICAgICAgICAgIGluZGV4X2hpZ2hlc3QgPSBpbmRleF9jdXJyZW50O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuekluZGV4ID0gaW5kZXhfaGlnaGVzdCArIDEwO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgb2Zmc2V0LCB0b3AsIGxlZnQsIGNvbnRhaW5lck9mZnNldDtcclxuICAgICAgaWYgKHRoaXMuY29udGFpbmVyIGluc3RhbmNlb2YgJCkge1xyXG4gICAgICAgIGNvbnRhaW5lck9mZnNldCA9IHRoaXMuY29udGFpbmVyLm9mZnNldCgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGNvbnRhaW5lck9mZnNldCA9ICQodGhpcy5jb250YWluZXIpLm9mZnNldCgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5jb21wb25lbnQpIHtcclxuICAgICAgICBvZmZzZXQgPSB0aGlzLmNvbXBvbmVudC5vZmZzZXQoKTtcclxuICAgICAgICBsZWZ0ID0gb2Zmc2V0LmxlZnQ7XHJcbiAgICAgICAgaWYgKHRoaXMucGlja2VyUG9zaXRpb24gPT09ICdib3R0b20tbGVmdCcgfHwgdGhpcy5waWNrZXJQb3NpdGlvbiA9PT0gJ3RvcC1sZWZ0Jykge1xyXG4gICAgICAgICAgbGVmdCArPSB0aGlzLmNvbXBvbmVudC5vdXRlcldpZHRoKCkgLSB0aGlzLnBpY2tlci5vdXRlcldpZHRoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG9mZnNldCA9IHRoaXMuZWxlbWVudC5vZmZzZXQoKTtcclxuICAgICAgICBsZWZ0ID0gb2Zmc2V0LmxlZnQ7XHJcbiAgICAgICAgaWYgKHRoaXMucGlja2VyUG9zaXRpb24gPT09ICdib3R0b20tbGVmdCcgfHwgdGhpcy5waWNrZXJQb3NpdGlvbiA9PT0gJ3RvcC1sZWZ0Jykge1xyXG4gICAgICAgICAgbGVmdCArPSB0aGlzLmVsZW1lbnQub3V0ZXJXaWR0aCgpIC0gdGhpcy5waWNrZXIub3V0ZXJXaWR0aCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdmFyIGJvZHlXaWR0aCA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGggfHwgd2luZG93LmlubmVyV2lkdGg7XHJcbiAgICAgIGlmIChsZWZ0ICsgMjIwID4gYm9keVdpZHRoKSB7XHJcbiAgICAgICAgbGVmdCA9IGJvZHlXaWR0aCAtIDIyMDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMucGlja2VyUG9zaXRpb24gPT09ICd0b3AtbGVmdCcgfHwgdGhpcy5waWNrZXJQb3NpdGlvbiA9PT0gJ3RvcC1yaWdodCcpIHtcclxuICAgICAgICB0b3AgPSBvZmZzZXQudG9wIC0gdGhpcy5waWNrZXIub3V0ZXJIZWlnaHQoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0b3AgPSBvZmZzZXQudG9wICsgdGhpcy5oZWlnaHQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRvcCA9IHRvcCAtIGNvbnRhaW5lck9mZnNldC50b3A7XHJcbiAgICAgIGxlZnQgPSBsZWZ0IC0gY29udGFpbmVyT2Zmc2V0LmxlZnQ7XHJcblxyXG4gICAgICB0aGlzLnBpY2tlci5jc3Moe1xyXG4gICAgICAgIHRvcDogICAgdG9wLFxyXG4gICAgICAgIGxlZnQ6ICAgbGVmdCxcclxuICAgICAgICB6SW5kZXg6IHRoaXMuekluZGV4XHJcbiAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICBob3VyX21pbnV0ZTogXCJeKFswLTldfDBbMC05XXwxWzAtOV18MlswLTNdKTpbMC01XVswLTldXCIsXHJcblxyXG4gICAgdXBkYXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBkYXRlLCBmcm9tQXJncyA9IGZhbHNlO1xyXG4gICAgICBpZiAoYXJndW1lbnRzICYmIGFyZ3VtZW50cy5sZW5ndGggJiYgKHR5cGVvZiBhcmd1bWVudHNbMF0gPT09ICdzdHJpbmcnIHx8IGFyZ3VtZW50c1swXSBpbnN0YW5jZW9mIERhdGUpKSB7XHJcbiAgICAgICAgZGF0ZSA9IGFyZ3VtZW50c1swXTtcclxuICAgICAgICBmcm9tQXJncyA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGF0ZSA9ICh0aGlzLmlzSW5wdXQgPyB0aGlzLmVsZW1lbnQudmFsKCkgOiB0aGlzLmVsZW1lbnQuZmluZCgnaW5wdXQnKS52YWwoKSkgfHwgdGhpcy5lbGVtZW50LmRhdGEoJ2RhdGUnKSB8fCB0aGlzLmluaXRpYWxEYXRlO1xyXG4gICAgICAgIGlmICh0eXBlb2YgZGF0ZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgIGRhdGUgPSBkYXRlLnJlcGxhY2UoL15cXHMrfFxccyskL2csJycpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFkYXRlKSB7XHJcbiAgICAgICAgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgZnJvbUFyZ3MgPSBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHR5cGVvZiBkYXRlID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgaWYgKG5ldyBSZWdFeHAodGhpcy5ob3VyX21pbnV0ZSkudGVzdChkYXRlKSB8fCBuZXcgUmVnRXhwKHRoaXMuaG91cl9taW51dGUgKyBcIjpbMC01XVswLTldXCIpLnRlc3QoZGF0ZSkpIHtcclxuICAgICAgICAgIGRhdGUgPSB0aGlzLmdldERhdGUoKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5kYXRlID0gRFBHbG9iYWwucGFyc2VEYXRlKGRhdGUsIHRoaXMuZm9ybWF0LCB0aGlzLmxhbmd1YWdlLCB0aGlzLmZvcm1hdFR5cGUsIHRoaXMudGltZXpvbmUpO1xyXG5cclxuICAgICAgaWYgKGZyb21BcmdzKSB0aGlzLnNldFZhbHVlKCk7XHJcblxyXG4gICAgICBpZiAodGhpcy5kYXRlIDwgdGhpcy5zdGFydERhdGUpIHtcclxuICAgICAgICB0aGlzLnZpZXdEYXRlID0gbmV3IERhdGUodGhpcy5zdGFydERhdGUpO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuZGF0ZSA+IHRoaXMuZW5kRGF0ZSkge1xyXG4gICAgICAgIHRoaXMudmlld0RhdGUgPSBuZXcgRGF0ZSh0aGlzLmVuZERhdGUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMudmlld0RhdGUgPSBuZXcgRGF0ZSh0aGlzLmRhdGUpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMuZmlsbCgpO1xyXG4gICAgfSxcclxuXHJcbiAgICBmaWxsRG93OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBkb3dDbnQgPSB0aGlzLndlZWtTdGFydCxcclxuICAgICAgICBodG1sID0gJzx0cj4nO1xyXG4gICAgICB3aGlsZSAoZG93Q250IDwgdGhpcy53ZWVrU3RhcnQgKyA3KSB7XHJcbiAgICAgICAgaHRtbCArPSAnPHRoIGNsYXNzPVwiZG93XCI+JyArIGRhdGVzW3RoaXMubGFuZ3VhZ2VdLmRheXNNaW5bKGRvd0NudCsrKSAlIDddICsgJzwvdGg+JztcclxuICAgICAgfVxyXG4gICAgICBodG1sICs9ICc8L3RyPic7XHJcbiAgICAgIHRoaXMucGlja2VyLmZpbmQoJy5kYXRldGltZXBpY2tlci1kYXlzIHRoZWFkJykuYXBwZW5kKGh0bWwpO1xyXG4gICAgfSxcclxuXHJcbiAgICBmaWxsTW9udGhzOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciBodG1sID0gJyc7XHJcbiAgICAgIHZhciBkID0gbmV3IERhdGUodGhpcy52aWV3RGF0ZSk7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgMTI7IGkrKykge1xyXG4gICAgICAgIGQuc2V0VVRDTW9udGgoaSk7XHJcbiAgICAgICAgdmFyIGNsYXNzZXMgPSB0aGlzLm9uUmVuZGVyTW9udGgoZCk7XHJcbiAgICAgICAgaHRtbCArPSAnPHNwYW4gY2xhc3M9XCInICsgY2xhc3Nlcy5qb2luKCcgJykgKyAnXCI+JyArIGRhdGVzW3RoaXMubGFuZ3VhZ2VdLm1vbnRoc1Nob3J0W2ldICsgJzwvc3Bhbj4nO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMucGlja2VyLmZpbmQoJy5kYXRldGltZXBpY2tlci1tb250aHMgdGQnKS5odG1sKGh0bWwpO1xyXG4gICAgfSxcclxuXHJcbiAgICBmaWxsOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5kYXRlIHx8ICF0aGlzLnZpZXdEYXRlKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciBkID0gbmV3IERhdGUodGhpcy52aWV3RGF0ZSksXHJcbiAgICAgICAgeWVhciA9IGQuZ2V0VVRDRnVsbFllYXIoKSxcclxuICAgICAgICBtb250aCA9IGQuZ2V0VVRDTW9udGgoKSxcclxuICAgICAgICBkYXlNb250aCA9IGQuZ2V0VVRDRGF0ZSgpLFxyXG4gICAgICAgIGhvdXJzID0gZC5nZXRVVENIb3VycygpLFxyXG4gICAgICAgIHN0YXJ0WWVhciA9IHRoaXMuc3RhcnREYXRlLmdldFVUQ0Z1bGxZZWFyKCksXHJcbiAgICAgICAgc3RhcnRNb250aCA9IHRoaXMuc3RhcnREYXRlLmdldFVUQ01vbnRoKCksXHJcbiAgICAgICAgZW5kWWVhciA9IHRoaXMuZW5kRGF0ZS5nZXRVVENGdWxsWWVhcigpLFxyXG4gICAgICAgIGVuZE1vbnRoID0gdGhpcy5lbmREYXRlLmdldFVUQ01vbnRoKCkgKyAxLFxyXG4gICAgICAgIGN1cnJlbnREYXRlID0gKG5ldyBVVENEYXRlKHRoaXMuZGF0ZS5nZXRVVENGdWxsWWVhcigpLCB0aGlzLmRhdGUuZ2V0VVRDTW9udGgoKSwgdGhpcy5kYXRlLmdldFVUQ0RhdGUoKSkpLnZhbHVlT2YoKSxcclxuICAgICAgICB0b2RheSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgIHRoaXMuc2V0VGl0bGUoJy5kYXRldGltZXBpY2tlci1kYXlzJywgZGF0ZXNbdGhpcy5sYW5ndWFnZV0ubW9udGhzW21vbnRoXSArICcgJyArIHllYXIpXHJcbiAgICAgIGlmICh0aGlzLmZvcm1hdFZpZXdUeXBlID09PSAndGltZScpIHtcclxuICAgICAgICB2YXIgZm9ybWF0dGVkID0gdGhpcy5nZXRGb3JtYXR0ZWREYXRlKCk7XHJcbiAgICAgICAgdGhpcy5zZXRUaXRsZSgnLmRhdGV0aW1lcGlja2VyLWhvdXJzJywgZm9ybWF0dGVkKTtcclxuICAgICAgICB0aGlzLnNldFRpdGxlKCcuZGF0ZXRpbWVwaWNrZXItbWludXRlcycsIGZvcm1hdHRlZCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5zZXRUaXRsZSgnLmRhdGV0aW1lcGlja2VyLWhvdXJzJywgZGF5TW9udGggKyAnICcgKyBkYXRlc1t0aGlzLmxhbmd1YWdlXS5tb250aHNbbW9udGhdICsgJyAnICsgeWVhcik7XHJcbiAgICAgICAgdGhpcy5zZXRUaXRsZSgnLmRhdGV0aW1lcGlja2VyLW1pbnV0ZXMnLCBkYXlNb250aCArICcgJyArIGRhdGVzW3RoaXMubGFuZ3VhZ2VdLm1vbnRoc1ttb250aF0gKyAnICcgKyB5ZWFyKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnBpY2tlci5maW5kKCd0Zm9vdCB0aC50b2RheScpXHJcbiAgICAgICAgLnRleHQoZGF0ZXNbdGhpcy5sYW5ndWFnZV0udG9kYXkgfHwgZGF0ZXNbJ2VuJ10udG9kYXkpXHJcbiAgICAgICAgLnRvZ2dsZSh0aGlzLnRvZGF5QnRuICE9PSBmYWxzZSk7XHJcbiAgICAgIHRoaXMucGlja2VyLmZpbmQoJ3Rmb290IHRoLmNsZWFyJylcclxuICAgICAgICAudGV4dChkYXRlc1t0aGlzLmxhbmd1YWdlXS5jbGVhciB8fCBkYXRlc1snZW4nXS5jbGVhcilcclxuICAgICAgICAudG9nZ2xlKHRoaXMuY2xlYXJCdG4gIT09IGZhbHNlKTtcclxuICAgICAgdGhpcy51cGRhdGVOYXZBcnJvd3MoKTtcclxuICAgICAgdGhpcy5maWxsTW9udGhzKCk7XHJcbiAgICAgIHZhciBwcmV2TW9udGggPSBVVENEYXRlKHllYXIsIG1vbnRoIC0gMSwgMjgsIDAsIDAsIDAsIDApLFxyXG4gICAgICAgIGRheSA9IERQR2xvYmFsLmdldERheXNJbk1vbnRoKHByZXZNb250aC5nZXRVVENGdWxsWWVhcigpLCBwcmV2TW9udGguZ2V0VVRDTW9udGgoKSk7XHJcbiAgICAgIHByZXZNb250aC5zZXRVVENEYXRlKGRheSk7XHJcbiAgICAgIHByZXZNb250aC5zZXRVVENEYXRlKGRheSAtIChwcmV2TW9udGguZ2V0VVRDRGF5KCkgLSB0aGlzLndlZWtTdGFydCArIDcpICUgNyk7XHJcbiAgICAgIHZhciBuZXh0TW9udGggPSBuZXcgRGF0ZShwcmV2TW9udGgpO1xyXG4gICAgICBuZXh0TW9udGguc2V0VVRDRGF0ZShuZXh0TW9udGguZ2V0VVRDRGF0ZSgpICsgNDIpO1xyXG4gICAgICBuZXh0TW9udGggPSBuZXh0TW9udGgudmFsdWVPZigpO1xyXG4gICAgICB2YXIgaHRtbCA9IFtdO1xyXG4gICAgICB2YXIgY2xhc3NlcztcclxuICAgICAgd2hpbGUgKHByZXZNb250aC52YWx1ZU9mKCkgPCBuZXh0TW9udGgpIHtcclxuICAgICAgICBpZiAocHJldk1vbnRoLmdldFVUQ0RheSgpID09PSB0aGlzLndlZWtTdGFydCkge1xyXG4gICAgICAgICAgaHRtbC5wdXNoKCc8dHI+Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNsYXNzZXMgPSB0aGlzLm9uUmVuZGVyRGF5KHByZXZNb250aCk7XHJcbiAgICAgICAgaWYgKHByZXZNb250aC5nZXRVVENGdWxsWWVhcigpIDwgeWVhciB8fCAocHJldk1vbnRoLmdldFVUQ0Z1bGxZZWFyKCkgPT09IHllYXIgJiYgcHJldk1vbnRoLmdldFVUQ01vbnRoKCkgPCBtb250aCkpIHtcclxuICAgICAgICAgIGNsYXNzZXMucHVzaCgnb2xkJyk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChwcmV2TW9udGguZ2V0VVRDRnVsbFllYXIoKSA+IHllYXIgfHwgKHByZXZNb250aC5nZXRVVENGdWxsWWVhcigpID09PSB5ZWFyICYmIHByZXZNb250aC5nZXRVVENNb250aCgpID4gbW9udGgpKSB7XHJcbiAgICAgICAgICBjbGFzc2VzLnB1c2goJ25ldycpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBDb21wYXJlIGludGVybmFsIFVUQyBkYXRlIHdpdGggbG9jYWwgdG9kYXksIG5vdCBVVEMgdG9kYXlcclxuICAgICAgICBpZiAodGhpcy50b2RheUhpZ2hsaWdodCAmJlxyXG4gICAgICAgICAgcHJldk1vbnRoLmdldFVUQ0Z1bGxZZWFyKCkgPT09IHRvZGF5LmdldEZ1bGxZZWFyKCkgJiZcclxuICAgICAgICAgIHByZXZNb250aC5nZXRVVENNb250aCgpID09PSB0b2RheS5nZXRNb250aCgpICYmXHJcbiAgICAgICAgICBwcmV2TW9udGguZ2V0VVRDRGF0ZSgpID09PSB0b2RheS5nZXREYXRlKCkpIHtcclxuICAgICAgICAgIGNsYXNzZXMucHVzaCgndG9kYXknKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHByZXZNb250aC52YWx1ZU9mKCkgPT09IGN1cnJlbnREYXRlKSB7XHJcbiAgICAgICAgICBjbGFzc2VzLnB1c2goJ2FjdGl2ZScpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoKHByZXZNb250aC52YWx1ZU9mKCkgKyA4NjQwMDAwMCkgPD0gdGhpcy5zdGFydERhdGUgfHwgcHJldk1vbnRoLnZhbHVlT2YoKSA+IHRoaXMuZW5kRGF0ZSB8fFxyXG4gICAgICAgICAgJC5pbkFycmF5KHByZXZNb250aC5nZXRVVENEYXkoKSwgdGhpcy5kYXlzT2ZXZWVrRGlzYWJsZWQpICE9PSAtMSB8fFxyXG4gICAgICAgICAgJC5pbkFycmF5KHByZXZNb250aC50b0RhdGVTdHJpbmcoKSwgdGhpcy5kYXRlc0Rpc2FibGVkKSAhPT0gLTEpIHtcclxuICAgICAgICAgIGNsYXNzZXMucHVzaCgnZGlzYWJsZWQnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaHRtbC5wdXNoKCc8dGQgY2xhc3M9XCInICsgY2xhc3Nlcy5qb2luKCcgJykgKyAnXCI+JyArIHByZXZNb250aC5nZXRVVENEYXRlKCkgKyAnPC90ZD4nKTtcclxuICAgICAgICBpZiAocHJldk1vbnRoLmdldFVUQ0RheSgpID09PSB0aGlzLndlZWtFbmQpIHtcclxuICAgICAgICAgIGh0bWwucHVzaCgnPC90cj4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJldk1vbnRoLnNldFVUQ0RhdGUocHJldk1vbnRoLmdldFVUQ0RhdGUoKSArIDEpO1xyXG4gICAgICB9XHJcbiAgICAgIHRoaXMucGlja2VyLmZpbmQoJy5kYXRldGltZXBpY2tlci1kYXlzIHRib2R5JykuZW1wdHkoKS5hcHBlbmQoaHRtbC5qb2luKCcnKSk7XHJcblxyXG4gICAgICBodG1sID0gW107XHJcbiAgICAgIHZhciB0eHQgPSAnJywgbWVyaWRpYW4gPSAnJywgbWVyaWRpYW5PbGQgPSAnJztcclxuICAgICAgdmFyIGhvdXJzRGlzYWJsZWQgPSB0aGlzLmhvdXJzRGlzYWJsZWQgfHwgW107XHJcbiAgICAgIGQgPSBuZXcgRGF0ZSh0aGlzLnZpZXdEYXRlKVxyXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI0OyBpKyspIHtcclxuICAgICAgICBkLnNldFVUQ0hvdXJzKGkpO1xyXG4gICAgICAgIGNsYXNzZXMgPSB0aGlzLm9uUmVuZGVySG91cihkKTtcclxuICAgICAgICBpZiAoaG91cnNEaXNhYmxlZC5pbmRleE9mKGkpICE9PSAtMSkge1xyXG4gICAgICAgICAgY2xhc3Nlcy5wdXNoKCdkaXNhYmxlZCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgYWN0dWFsID0gVVRDRGF0ZSh5ZWFyLCBtb250aCwgZGF5TW9udGgsIGkpO1xyXG4gICAgICAgIC8vIFdlIHdhbnQgdGhlIHByZXZpb3VzIGhvdXIgZm9yIHRoZSBzdGFydERhdGVcclxuICAgICAgICBpZiAoKGFjdHVhbC52YWx1ZU9mKCkgKyAzNjAwMDAwKSA8PSB0aGlzLnN0YXJ0RGF0ZSB8fCBhY3R1YWwudmFsdWVPZigpID4gdGhpcy5lbmREYXRlKSB7XHJcbiAgICAgICAgICBjbGFzc2VzLnB1c2goJ2Rpc2FibGVkJyk7XHJcbiAgICAgICAgfSBlbHNlIGlmIChob3VycyA9PT0gaSkge1xyXG4gICAgICAgICAgY2xhc3Nlcy5wdXNoKCdhY3RpdmUnKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuc2hvd01lcmlkaWFuICYmIGRhdGVzW3RoaXMubGFuZ3VhZ2VdLm1lcmlkaWVtLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICAgICAgbWVyaWRpYW4gPSAoaSA8IDEyID8gZGF0ZXNbdGhpcy5sYW5ndWFnZV0ubWVyaWRpZW1bMF0gOiBkYXRlc1t0aGlzLmxhbmd1YWdlXS5tZXJpZGllbVsxXSk7XHJcbiAgICAgICAgICBpZiAobWVyaWRpYW4gIT09IG1lcmlkaWFuT2xkKSB7XHJcbiAgICAgICAgICAgIGlmIChtZXJpZGlhbk9sZCAhPT0gJycpIHtcclxuICAgICAgICAgICAgICBodG1sLnB1c2goJzwvZmllbGRzZXQ+Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaHRtbC5wdXNoKCc8ZmllbGRzZXQgY2xhc3M9XCJob3VyXCI+PGxlZ2VuZD4nICsgbWVyaWRpYW4udG9VcHBlckNhc2UoKSArICc8L2xlZ2VuZD4nKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIG1lcmlkaWFuT2xkID0gbWVyaWRpYW47XHJcbiAgICAgICAgICB0eHQgPSAoaSAlIDEyID8gaSAlIDEyIDogMTIpO1xyXG4gICAgICAgICAgaWYgKGkgPCAxMikge1xyXG4gICAgICAgICAgICBjbGFzc2VzLnB1c2goJ2hvdXJfYW0nKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNsYXNzZXMucHVzaCgnaG91cl9wbScpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaHRtbC5wdXNoKCc8c3BhbiBjbGFzcz1cIicgKyBjbGFzc2VzLmpvaW4oJyAnKSArICdcIj4nICsgdHh0ICsgJzwvc3Bhbj4nKTtcclxuICAgICAgICAgIGlmIChpID09PSAyMykge1xyXG4gICAgICAgICAgICBodG1sLnB1c2goJzwvZmllbGRzZXQ+Jyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHR4dCA9IGkgKyAnOjAwJztcclxuICAgICAgICAgIGh0bWwucHVzaCgnPHNwYW4gY2xhc3M9XCInICsgY2xhc3Nlcy5qb2luKCcgJykgKyAnXCI+JyArIHR4dCArICc8L3NwYW4+Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHRoaXMucGlja2VyLmZpbmQoJy5kYXRldGltZXBpY2tlci1ob3VycyB0ZCcpLmh0bWwoaHRtbC5qb2luKCcnKSk7XHJcblxyXG4gICAgICBodG1sID0gW107XHJcbiAgICAgIHR4dCA9ICcnO1xyXG4gICAgICBtZXJpZGlhbiA9ICcnO1xyXG4gICAgICBtZXJpZGlhbk9sZCA9ICcnO1xyXG4gICAgICB2YXIgbWludXRlc0Rpc2FibGVkID0gdGhpcy5taW51dGVzRGlzYWJsZWQgfHwgW107XHJcbiAgICAgIGQgPSBuZXcgRGF0ZSh0aGlzLnZpZXdEYXRlKTtcclxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA2MDsgaSArPSB0aGlzLm1pbnV0ZVN0ZXApIHtcclxuICAgICAgICBpZiAobWludXRlc0Rpc2FibGVkLmluZGV4T2YoaSkgIT09IC0xKSBjb250aW51ZTtcclxuICAgICAgICBkLnNldFVUQ01pbnV0ZXMoaSk7XHJcbiAgICAgICAgZC5zZXRVVENTZWNvbmRzKDApO1xyXG4gICAgICAgIGNsYXNzZXMgPSB0aGlzLm9uUmVuZGVyTWludXRlKGQpO1xyXG4gICAgICAgIGlmICh0aGlzLnNob3dNZXJpZGlhbiAmJiBkYXRlc1t0aGlzLmxhbmd1YWdlXS5tZXJpZGllbS5sZW5ndGggPT09IDIpIHtcclxuICAgICAgICAgIG1lcmlkaWFuID0gKGhvdXJzIDwgMTIgPyBkYXRlc1t0aGlzLmxhbmd1YWdlXS5tZXJpZGllbVswXSA6IGRhdGVzW3RoaXMubGFuZ3VhZ2VdLm1lcmlkaWVtWzFdKTtcclxuICAgICAgICAgIGlmIChtZXJpZGlhbiAhPT0gbWVyaWRpYW5PbGQpIHtcclxuICAgICAgICAgICAgaWYgKG1lcmlkaWFuT2xkICE9PSAnJykge1xyXG4gICAgICAgICAgICAgIGh0bWwucHVzaCgnPC9maWVsZHNldD4nKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBodG1sLnB1c2goJzxmaWVsZHNldCBjbGFzcz1cIm1pbnV0ZVwiPjxsZWdlbmQ+JyArIG1lcmlkaWFuLnRvVXBwZXJDYXNlKCkgKyAnPC9sZWdlbmQ+Jyk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBtZXJpZGlhbk9sZCA9IG1lcmlkaWFuO1xyXG4gICAgICAgICAgdHh0ID0gKGhvdXJzICUgMTIgPyBob3VycyAlIDEyIDogMTIpO1xyXG4gICAgICAgICAgaHRtbC5wdXNoKCc8c3BhbiBjbGFzcz1cIicgKyBjbGFzc2VzLmpvaW4oJyAnKSArICdcIj4nICsgdHh0ICsgJzonICsgKGkgPCAxMCA/ICcwJyArIGkgOiBpKSArICc8L3NwYW4+Jyk7XHJcbiAgICAgICAgICBpZiAoaSA9PT0gNTkpIHtcclxuICAgICAgICAgICAgaHRtbC5wdXNoKCc8L2ZpZWxkc2V0PicpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0eHQgPSBpICsgJzowMCc7XHJcbiAgICAgICAgICBodG1sLnB1c2goJzxzcGFuIGNsYXNzPVwiJyArIGNsYXNzZXMuam9pbignICcpICsgJ1wiPicgKyBob3VycyArICc6JyArIChpIDwgMTAgPyAnMCcgKyBpIDogaSkgKyAnPC9zcGFuPicpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICB0aGlzLnBpY2tlci5maW5kKCcuZGF0ZXRpbWVwaWNrZXItbWludXRlcyB0ZCcpLmh0bWwoaHRtbC5qb2luKCcnKSk7XHJcblxyXG4gICAgICB2YXIgY3VycmVudFllYXIgPSB0aGlzLmRhdGUuZ2V0VVRDRnVsbFllYXIoKTtcclxuICAgICAgdmFyIG1vbnRocyA9IHRoaXMuc2V0VGl0bGUoJy5kYXRldGltZXBpY2tlci1tb250aHMnLCB5ZWFyKVxyXG4gICAgICAgIC5lbmQoKVxyXG4gICAgICAgIC5maW5kKCcubW9udGgnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XHJcbiAgICAgIGlmIChjdXJyZW50WWVhciA9PT0geWVhcikge1xyXG4gICAgICAgIC8vIGdldFVUQ01vbnRocygpIHJldHVybnMgMCBiYXNlZCwgYW5kIHdlIG5lZWQgdG8gc2VsZWN0IHRoZSBuZXh0IG9uZVxyXG4gICAgICAgIC8vIFRvIGNhdGVyIGJvb3RzdHJhcCAyIHdlIGRvbid0IG5lZWQgdG8gc2VsZWN0IHRoZSBuZXh0IG9uZVxyXG4gICAgICAgIG1vbnRocy5lcSh0aGlzLmRhdGUuZ2V0VVRDTW9udGgoKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh5ZWFyIDwgc3RhcnRZZWFyIHx8IHllYXIgPiBlbmRZZWFyKSB7XHJcbiAgICAgICAgbW9udGhzLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh5ZWFyID09PSBzdGFydFllYXIpIHtcclxuICAgICAgICBtb250aHMuc2xpY2UoMCwgc3RhcnRNb250aCkuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHllYXIgPT09IGVuZFllYXIpIHtcclxuICAgICAgICBtb250aHMuc2xpY2UoZW5kTW9udGgpLmFkZENsYXNzKCdkaXNhYmxlZCcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBodG1sID0gJyc7XHJcbiAgICAgIHllYXIgPSBwYXJzZUludCh5ZWFyIC8gMTAsIDEwKSAqIDEwO1xyXG4gICAgICB2YXIgeWVhckNvbnQgPSB0aGlzLnNldFRpdGxlKCcuZGF0ZXRpbWVwaWNrZXIteWVhcnMnLCB5ZWFyICsgJy0nICsgKHllYXIgKyA5KSlcclxuICAgICAgICAuZW5kKClcclxuICAgICAgICAuZmluZCgndGQnKTtcclxuICAgICAgeWVhciAtPSAxO1xyXG4gICAgICBkID0gbmV3IERhdGUodGhpcy52aWV3RGF0ZSk7XHJcbiAgICAgIGZvciAodmFyIGkgPSAtMTsgaSA8IDExOyBpKyspIHtcclxuICAgICAgICBkLnNldFVUQ0Z1bGxZZWFyKHllYXIpO1xyXG4gICAgICAgIGNsYXNzZXMgPSB0aGlzLm9uUmVuZGVyWWVhcihkKTtcclxuICAgICAgICBpZiAoaSA9PT0gLTEgfHwgaSA9PT0gMTApIHtcclxuICAgICAgICAgIGNsYXNzZXMucHVzaChvbGQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBodG1sICs9ICc8c3BhbiBjbGFzcz1cIicgKyBjbGFzc2VzLmpvaW4oJyAnKSArICdcIj4nICsgeWVhciArICc8L3NwYW4+JztcclxuICAgICAgICB5ZWFyICs9IDE7XHJcbiAgICAgIH1cclxuICAgICAgeWVhckNvbnQuaHRtbChodG1sKTtcclxuICAgICAgdGhpcy5wbGFjZSgpO1xyXG4gICAgfSxcclxuXHJcbiAgICB1cGRhdGVOYXZBcnJvd3M6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGQgPSBuZXcgRGF0ZSh0aGlzLnZpZXdEYXRlKSxcclxuICAgICAgICB5ZWFyID0gZC5nZXRVVENGdWxsWWVhcigpLFxyXG4gICAgICAgIG1vbnRoID0gZC5nZXRVVENNb250aCgpLFxyXG4gICAgICAgIGRheSA9IGQuZ2V0VVRDRGF0ZSgpLFxyXG4gICAgICAgIGhvdXIgPSBkLmdldFVUQ0hvdXJzKCk7XHJcbiAgICAgIHN3aXRjaCAodGhpcy52aWV3TW9kZSkge1xyXG4gICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgIGlmICh5ZWFyIDw9IHRoaXMuc3RhcnREYXRlLmdldFVUQ0Z1bGxZZWFyKClcclxuICAgICAgICAgICAgJiYgbW9udGggPD0gdGhpcy5zdGFydERhdGUuZ2V0VVRDTW9udGgoKVxyXG4gICAgICAgICAgICAmJiBkYXkgPD0gdGhpcy5zdGFydERhdGUuZ2V0VVRDRGF0ZSgpXHJcbiAgICAgICAgICAgICYmIGhvdXIgPD0gdGhpcy5zdGFydERhdGUuZ2V0VVRDSG91cnMoKSkge1xyXG4gICAgICAgICAgICB0aGlzLnBpY2tlci5maW5kKCcucHJldicpLmNzcyh7dmlzaWJpbGl0eTogJ2hpZGRlbid9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucGlja2VyLmZpbmQoJy5wcmV2JykuY3NzKHt2aXNpYmlsaXR5OiAndmlzaWJsZSd9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh5ZWFyID49IHRoaXMuZW5kRGF0ZS5nZXRVVENGdWxsWWVhcigpXHJcbiAgICAgICAgICAgICYmIG1vbnRoID49IHRoaXMuZW5kRGF0ZS5nZXRVVENNb250aCgpXHJcbiAgICAgICAgICAgICYmIGRheSA+PSB0aGlzLmVuZERhdGUuZ2V0VVRDRGF0ZSgpXHJcbiAgICAgICAgICAgICYmIGhvdXIgPj0gdGhpcy5lbmREYXRlLmdldFVUQ0hvdXJzKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5waWNrZXIuZmluZCgnLm5leHQnKS5jc3Moe3Zpc2liaWxpdHk6ICdoaWRkZW4nfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBpY2tlci5maW5kKCcubmV4dCcpLmNzcyh7dmlzaWJpbGl0eTogJ3Zpc2libGUnfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICBpZiAoeWVhciA8PSB0aGlzLnN0YXJ0RGF0ZS5nZXRVVENGdWxsWWVhcigpXHJcbiAgICAgICAgICAgICYmIG1vbnRoIDw9IHRoaXMuc3RhcnREYXRlLmdldFVUQ01vbnRoKClcclxuICAgICAgICAgICAgJiYgZGF5IDw9IHRoaXMuc3RhcnREYXRlLmdldFVUQ0RhdGUoKSkge1xyXG4gICAgICAgICAgICB0aGlzLnBpY2tlci5maW5kKCcucHJldicpLmNzcyh7dmlzaWJpbGl0eTogJ2hpZGRlbid9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucGlja2VyLmZpbmQoJy5wcmV2JykuY3NzKHt2aXNpYmlsaXR5OiAndmlzaWJsZSd9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh5ZWFyID49IHRoaXMuZW5kRGF0ZS5nZXRVVENGdWxsWWVhcigpXHJcbiAgICAgICAgICAgICYmIG1vbnRoID49IHRoaXMuZW5kRGF0ZS5nZXRVVENNb250aCgpXHJcbiAgICAgICAgICAgICYmIGRheSA+PSB0aGlzLmVuZERhdGUuZ2V0VVRDRGF0ZSgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGlja2VyLmZpbmQoJy5uZXh0JykuY3NzKHt2aXNpYmlsaXR5OiAnaGlkZGVuJ30pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5waWNrZXIuZmluZCgnLm5leHQnKS5jc3Moe3Zpc2liaWxpdHk6ICd2aXNpYmxlJ30pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgaWYgKHllYXIgPD0gdGhpcy5zdGFydERhdGUuZ2V0VVRDRnVsbFllYXIoKVxyXG4gICAgICAgICAgICAmJiBtb250aCA8PSB0aGlzLnN0YXJ0RGF0ZS5nZXRVVENNb250aCgpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGlja2VyLmZpbmQoJy5wcmV2JykuY3NzKHt2aXNpYmlsaXR5OiAnaGlkZGVuJ30pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5waWNrZXIuZmluZCgnLnByZXYnKS5jc3Moe3Zpc2liaWxpdHk6ICd2aXNpYmxlJ30pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHllYXIgPj0gdGhpcy5lbmREYXRlLmdldFVUQ0Z1bGxZZWFyKClcclxuICAgICAgICAgICAgJiYgbW9udGggPj0gdGhpcy5lbmREYXRlLmdldFVUQ01vbnRoKCkpIHtcclxuICAgICAgICAgICAgdGhpcy5waWNrZXIuZmluZCgnLm5leHQnKS5jc3Moe3Zpc2liaWxpdHk6ICdoaWRkZW4nfSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnBpY2tlci5maW5kKCcubmV4dCcpLmNzcyh7dmlzaWJpbGl0eTogJ3Zpc2libGUnfSk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgaWYgKHllYXIgPD0gdGhpcy5zdGFydERhdGUuZ2V0VVRDRnVsbFllYXIoKSkge1xyXG4gICAgICAgICAgICB0aGlzLnBpY2tlci5maW5kKCcucHJldicpLmNzcyh7dmlzaWJpbGl0eTogJ2hpZGRlbid9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMucGlja2VyLmZpbmQoJy5wcmV2JykuY3NzKHt2aXNpYmlsaXR5OiAndmlzaWJsZSd9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh5ZWFyID49IHRoaXMuZW5kRGF0ZS5nZXRVVENGdWxsWWVhcigpKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGlja2VyLmZpbmQoJy5uZXh0JykuY3NzKHt2aXNpYmlsaXR5OiAnaGlkZGVuJ30pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5waWNrZXIuZmluZCgnLm5leHQnKS5jc3Moe3Zpc2liaWxpdHk6ICd2aXNpYmxlJ30pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgbW91c2V3aGVlbDogZnVuY3Rpb24gKGUpIHtcclxuXHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLndoZWVsUGF1c2UpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMud2hlZWxQYXVzZSA9IHRydWU7XHJcblxyXG4gICAgICB2YXIgb3JpZ2luYWxFdmVudCA9IGUub3JpZ2luYWxFdmVudDtcclxuXHJcbiAgICAgIHZhciBkZWx0YSA9IG9yaWdpbmFsRXZlbnQud2hlZWxEZWx0YTtcclxuXHJcbiAgICAgIHZhciBtb2RlID0gZGVsdGEgPiAwID8gMSA6IChkZWx0YSA9PT0gMCkgPyAwIDogLTE7XHJcblxyXG4gICAgICBpZiAodGhpcy53aGVlbFZpZXdNb2RlTmF2aWdhdGlvbkludmVyc2VEaXJlY3Rpb24pIHtcclxuICAgICAgICBtb2RlID0gLW1vZGU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc2hvd01vZGUobW9kZSk7XHJcblxyXG4gICAgICBzZXRUaW1lb3V0KCQucHJveHkoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgICAgICB0aGlzLndoZWVsUGF1c2UgPSBmYWxzZVxyXG5cclxuICAgICAgfSwgdGhpcyksIHRoaXMud2hlZWxWaWV3TW9kZU5hdmlnYXRpb25EZWxheSk7XHJcblxyXG4gICAgfSxcclxuXHJcbiAgICBjbGljazogZnVuY3Rpb24gKGUpIHtcclxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICB2YXIgdGFyZ2V0ID0gJChlLnRhcmdldCkuY2xvc2VzdCgnc3BhbiwgdGQsIHRoLCBsZWdlbmQnKTtcclxuICAgICAgaWYgKHRhcmdldC5pcygnLicgKyB0aGlzLmljb250eXBlKSkge1xyXG4gICAgICAgIHRhcmdldCA9ICQodGFyZ2V0KS5wYXJlbnQoKS5jbG9zZXN0KCdzcGFuLCB0ZCwgdGgsIGxlZ2VuZCcpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0YXJnZXQubGVuZ3RoID09PSAxKSB7XHJcbiAgICAgICAgaWYgKHRhcmdldC5pcygnLmRpc2FibGVkJykpIHtcclxuICAgICAgICAgIHRoaXMuZWxlbWVudC50cmlnZ2VyKHtcclxuICAgICAgICAgICAgdHlwZTogICAgICAnb3V0T2ZSYW5nZScsXHJcbiAgICAgICAgICAgIGRhdGU6ICAgICAgdGhpcy52aWV3RGF0ZSxcclxuICAgICAgICAgICAgc3RhcnREYXRlOiB0aGlzLnN0YXJ0RGF0ZSxcclxuICAgICAgICAgICAgZW5kRGF0ZTogICB0aGlzLmVuZERhdGVcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKHRhcmdldFswXS5ub2RlTmFtZS50b0xvd2VyQ2FzZSgpKSB7XHJcbiAgICAgICAgICBjYXNlICd0aCc6XHJcbiAgICAgICAgICAgIHN3aXRjaCAodGFyZ2V0WzBdLmNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgIGNhc2UgJ3N3aXRjaCc6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNob3dNb2RlKDEpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgY2FzZSAncHJldic6XHJcbiAgICAgICAgICAgICAgY2FzZSAnbmV4dCc6XHJcbiAgICAgICAgICAgICAgICB2YXIgZGlyID0gRFBHbG9iYWwubW9kZXNbdGhpcy52aWV3TW9kZV0ubmF2U3RlcCAqICh0YXJnZXRbMF0uY2xhc3NOYW1lID09PSAncHJldicgPyAtMSA6IDEpO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoICh0aGlzLnZpZXdNb2RlKSB7XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXdEYXRlID0gdGhpcy5tb3ZlSG91cih0aGlzLnZpZXdEYXRlLCBkaXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52aWV3RGF0ZSA9IHRoaXMubW92ZURhdGUodGhpcy52aWV3RGF0ZSwgZGlyKTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmlld0RhdGUgPSB0aGlzLm1vdmVNb250aCh0aGlzLnZpZXdEYXRlLCBkaXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZpZXdEYXRlID0gdGhpcy5tb3ZlWWVhcih0aGlzLnZpZXdEYXRlLCBkaXIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQudHJpZ2dlcih7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICAgICAgdGFyZ2V0WzBdLmNsYXNzTmFtZSArICc6JyArIHRoaXMuY29udmVydFZpZXdNb2RlVGV4dCh0aGlzLnZpZXdNb2RlKSxcclxuICAgICAgICAgICAgICAgICAgZGF0ZTogICAgICB0aGlzLnZpZXdEYXRlLFxyXG4gICAgICAgICAgICAgICAgICBzdGFydERhdGU6IHRoaXMuc3RhcnREYXRlLFxyXG4gICAgICAgICAgICAgICAgICBlbmREYXRlOiAgIHRoaXMuZW5kRGF0ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlICdjbGVhcic6XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2V0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdXRvY2xvc2UpIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICBjYXNlICd0b2RheSc6XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBkYXRlID0gVVRDRGF0ZShkYXRlLmdldEZ1bGxZZWFyKCksIGRhdGUuZ2V0TW9udGgoKSwgZGF0ZS5nZXREYXRlKCksIGRhdGUuZ2V0SG91cnMoKSwgZGF0ZS5nZXRNaW51dGVzKCksIGRhdGUuZ2V0U2Vjb25kcygpLCAwKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBSZXNwZWN0IHN0YXJ0RGF0ZSBhbmQgZW5kRGF0ZS5cclxuICAgICAgICAgICAgICAgIGlmIChkYXRlIDwgdGhpcy5zdGFydERhdGUpIGRhdGUgPSB0aGlzLnN0YXJ0RGF0ZTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGRhdGUgPiB0aGlzLmVuZERhdGUpIGRhdGUgPSB0aGlzLmVuZERhdGU7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3TW9kZSA9IHRoaXMuc3RhcnRWaWV3TW9kZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd01vZGUoMCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLl9zZXREYXRlKGRhdGUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdXRvY2xvc2UpIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgIGNhc2UgJ3NwYW4nOlxyXG4gICAgICAgICAgICBpZiAoIXRhcmdldC5pcygnLmRpc2FibGVkJykpIHtcclxuICAgICAgICAgICAgICB2YXIgeWVhciA9IHRoaXMudmlld0RhdGUuZ2V0VVRDRnVsbFllYXIoKSxcclxuICAgICAgICAgICAgICAgIG1vbnRoID0gdGhpcy52aWV3RGF0ZS5nZXRVVENNb250aCgpLFxyXG4gICAgICAgICAgICAgICAgZGF5ID0gdGhpcy52aWV3RGF0ZS5nZXRVVENEYXRlKCksXHJcbiAgICAgICAgICAgICAgICBob3VycyA9IHRoaXMudmlld0RhdGUuZ2V0VVRDSG91cnMoKSxcclxuICAgICAgICAgICAgICAgIG1pbnV0ZXMgPSB0aGlzLnZpZXdEYXRlLmdldFVUQ01pbnV0ZXMoKSxcclxuICAgICAgICAgICAgICAgIHNlY29uZHMgPSB0aGlzLnZpZXdEYXRlLmdldFVUQ1NlY29uZHMoKTtcclxuXHJcbiAgICAgICAgICAgICAgaWYgKHRhcmdldC5pcygnLm1vbnRoJykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlld0RhdGUuc2V0VVRDRGF0ZSgxKTtcclxuICAgICAgICAgICAgICAgIG1vbnRoID0gdGFyZ2V0LnBhcmVudCgpLmZpbmQoJ3NwYW4nKS5pbmRleCh0YXJnZXQpO1xyXG4gICAgICAgICAgICAgICAgZGF5ID0gdGhpcy52aWV3RGF0ZS5nZXRVVENEYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZpZXdEYXRlLnNldFVUQ01vbnRoKG1vbnRoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudC50cmlnZ2VyKHtcclxuICAgICAgICAgICAgICAgICAgdHlwZTogJ2NoYW5nZU1vbnRoJyxcclxuICAgICAgICAgICAgICAgICAgZGF0ZTogdGhpcy52aWV3RGF0ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy52aWV3U2VsZWN0ID49IDMpIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0RGF0ZShVVENEYXRlKHllYXIsIG1vbnRoLCBkYXksIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzLCAwKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YXJnZXQuaXMoJy55ZWFyJykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlld0RhdGUuc2V0VVRDRGF0ZSgxKTtcclxuICAgICAgICAgICAgICAgIHllYXIgPSBwYXJzZUludCh0YXJnZXQudGV4dCgpLCAxMCkgfHwgMDtcclxuICAgICAgICAgICAgICAgIHRoaXMudmlld0RhdGUuc2V0VVRDRnVsbFllYXIoeWVhcik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQudHJpZ2dlcih7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdjaGFuZ2VZZWFyJyxcclxuICAgICAgICAgICAgICAgICAgZGF0ZTogdGhpcy52aWV3RGF0ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy52aWV3U2VsZWN0ID49IDQpIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0RGF0ZShVVENEYXRlKHllYXIsIG1vbnRoLCBkYXksIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzLCAwKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YXJnZXQuaXMoJy5ob3VyJykpIHtcclxuICAgICAgICAgICAgICAgIGhvdXJzID0gcGFyc2VJbnQodGFyZ2V0LnRleHQoKSwgMTApIHx8IDA7XHJcbiAgICAgICAgICAgICAgICBpZiAodGFyZ2V0Lmhhc0NsYXNzKCdob3VyX2FtJykgfHwgdGFyZ2V0Lmhhc0NsYXNzKCdob3VyX3BtJykpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKGhvdXJzID09PSAxMiAmJiB0YXJnZXQuaGFzQ2xhc3MoJ2hvdXJfYW0nKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhvdXJzID0gMDtcclxuICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChob3VycyAhPT0gMTIgJiYgdGFyZ2V0Lmhhc0NsYXNzKCdob3VyX3BtJykpIHtcclxuICAgICAgICAgICAgICAgICAgICBob3VycyArPSAxMjtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3RGF0ZS5zZXRVVENIb3Vycyhob3Vycyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQudHJpZ2dlcih7XHJcbiAgICAgICAgICAgICAgICAgIHR5cGU6ICdjaGFuZ2VIb3VyJyxcclxuICAgICAgICAgICAgICAgICAgZGF0ZTogdGhpcy52aWV3RGF0ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy52aWV3U2VsZWN0ID49IDEpIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0RGF0ZShVVENEYXRlKHllYXIsIG1vbnRoLCBkYXksIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzLCAwKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YXJnZXQuaXMoJy5taW51dGUnKSkge1xyXG4gICAgICAgICAgICAgICAgbWludXRlcyA9IHBhcnNlSW50KHRhcmdldC50ZXh0KCkuc3Vic3RyKHRhcmdldC50ZXh0KCkuaW5kZXhPZignOicpICsgMSksIDEwKSB8fCAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52aWV3RGF0ZS5zZXRVVENNaW51dGVzKG1pbnV0ZXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lbGVtZW50LnRyaWdnZXIoe1xyXG4gICAgICAgICAgICAgICAgICB0eXBlOiAnY2hhbmdlTWludXRlJyxcclxuICAgICAgICAgICAgICAgICAgZGF0ZTogdGhpcy52aWV3RGF0ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy52aWV3U2VsZWN0ID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5fc2V0RGF0ZShVVENEYXRlKHllYXIsIG1vbnRoLCBkYXksIGhvdXJzLCBtaW51dGVzLCBzZWNvbmRzLCAwKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIGlmICh0aGlzLnZpZXdNb2RlICE9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2xkVmlld01vZGUgPSB0aGlzLnZpZXdNb2RlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaG93TW9kZSgtMSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGwoKTtcclxuICAgICAgICAgICAgICAgIGlmIChvbGRWaWV3TW9kZSA9PT0gdGhpcy52aWV3TW9kZSAmJiB0aGlzLmF1dG9jbG9zZSkge1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdXRvY2xvc2UpIHtcclxuICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgY2FzZSAndGQnOlxyXG4gICAgICAgICAgICBpZiAodGFyZ2V0LmlzKCcuZGF5JykgJiYgIXRhcmdldC5pcygnLmRpc2FibGVkJykpIHtcclxuICAgICAgICAgICAgICB2YXIgZGF5ID0gcGFyc2VJbnQodGFyZ2V0LnRleHQoKSwgMTApIHx8IDE7XHJcbiAgICAgICAgICAgICAgdmFyIHllYXIgPSB0aGlzLnZpZXdEYXRlLmdldFVUQ0Z1bGxZZWFyKCksXHJcbiAgICAgICAgICAgICAgICBtb250aCA9IHRoaXMudmlld0RhdGUuZ2V0VVRDTW9udGgoKSxcclxuICAgICAgICAgICAgICAgIGhvdXJzID0gdGhpcy52aWV3RGF0ZS5nZXRVVENIb3VycygpLFxyXG4gICAgICAgICAgICAgICAgbWludXRlcyA9IHRoaXMudmlld0RhdGUuZ2V0VVRDTWludXRlcygpLFxyXG4gICAgICAgICAgICAgICAgc2Vjb25kcyA9IHRoaXMudmlld0RhdGUuZ2V0VVRDU2Vjb25kcygpO1xyXG4gICAgICAgICAgICAgIGlmICh0YXJnZXQuaXMoJy5vbGQnKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1vbnRoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgIG1vbnRoID0gMTE7XHJcbiAgICAgICAgICAgICAgICAgIHllYXIgLT0gMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIG1vbnRoIC09IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSBlbHNlIGlmICh0YXJnZXQuaXMoJy5uZXcnKSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG1vbnRoID09PSAxMSkge1xyXG4gICAgICAgICAgICAgICAgICBtb250aCA9IDA7XHJcbiAgICAgICAgICAgICAgICAgIHllYXIgKz0gMTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIG1vbnRoICs9IDE7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIHRoaXMudmlld0RhdGUuc2V0VVRDRnVsbFllYXIoeWVhcik7XHJcbiAgICAgICAgICAgICAgdGhpcy52aWV3RGF0ZS5zZXRVVENNb250aChtb250aCwgZGF5KTtcclxuICAgICAgICAgICAgICB0aGlzLmVsZW1lbnQudHJpZ2dlcih7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnY2hhbmdlRGF5JyxcclxuICAgICAgICAgICAgICAgIGRhdGU6IHRoaXMudmlld0RhdGVcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICBpZiAodGhpcy52aWV3U2VsZWN0ID49IDIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuX3NldERhdGUoVVRDRGF0ZSh5ZWFyLCBtb250aCwgZGF5LCBob3VycywgbWludXRlcywgc2Vjb25kcywgMCkpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgb2xkVmlld01vZGUgPSB0aGlzLnZpZXdNb2RlO1xyXG4gICAgICAgICAgICB0aGlzLnNob3dNb2RlKC0xKTtcclxuICAgICAgICAgICAgdGhpcy5maWxsKCk7XHJcbiAgICAgICAgICAgIGlmIChvbGRWaWV3TW9kZSA9PT0gdGhpcy52aWV3TW9kZSAmJiB0aGlzLmF1dG9jbG9zZSkge1xyXG4gICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfc2V0RGF0ZTogZnVuY3Rpb24gKGRhdGUsIHdoaWNoKSB7XHJcbiAgICAgIGlmICghd2hpY2ggfHwgd2hpY2ggPT09ICdkYXRlJylcclxuICAgICAgICB0aGlzLmRhdGUgPSBkYXRlO1xyXG4gICAgICBpZiAoIXdoaWNoIHx8IHdoaWNoID09PSAndmlldycpXHJcbiAgICAgICAgdGhpcy52aWV3RGF0ZSA9IGRhdGU7XHJcbiAgICAgIHRoaXMuZmlsbCgpO1xyXG4gICAgICB0aGlzLnNldFZhbHVlKCk7XHJcbiAgICAgIHZhciBlbGVtZW50O1xyXG4gICAgICBpZiAodGhpcy5pc0lucHV0KSB7XHJcbiAgICAgICAgZWxlbWVudCA9IHRoaXMuZWxlbWVudDtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbXBvbmVudCkge1xyXG4gICAgICAgIGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQuZmluZCgnaW5wdXQnKTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgIGVsZW1lbnQuY2hhbmdlKCk7XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5lbGVtZW50LnRyaWdnZXIoe1xyXG4gICAgICAgIHR5cGU6ICdjaGFuZ2VEYXRlJyxcclxuICAgICAgICBkYXRlOiB0aGlzLmdldERhdGUoKVxyXG4gICAgICB9KTtcclxuICAgICAgaWYoZGF0ZSA9PT0gbnVsbClcclxuICAgICAgICB0aGlzLmRhdGUgPSB0aGlzLnZpZXdEYXRlO1xyXG4gICAgfSxcclxuXHJcbiAgICBtb3ZlTWludXRlOiBmdW5jdGlvbiAoZGF0ZSwgZGlyKSB7XHJcbiAgICAgIGlmICghZGlyKSByZXR1cm4gZGF0ZTtcclxuICAgICAgdmFyIG5ld19kYXRlID0gbmV3IERhdGUoZGF0ZS52YWx1ZU9mKCkpO1xyXG4gICAgICAvL2RpciA9IGRpciA+IDAgPyAxIDogLTE7XHJcbiAgICAgIG5ld19kYXRlLnNldFVUQ01pbnV0ZXMobmV3X2RhdGUuZ2V0VVRDTWludXRlcygpICsgKGRpciAqIHRoaXMubWludXRlU3RlcCkpO1xyXG4gICAgICByZXR1cm4gbmV3X2RhdGU7XHJcbiAgICB9LFxyXG5cclxuICAgIG1vdmVIb3VyOiBmdW5jdGlvbiAoZGF0ZSwgZGlyKSB7XHJcbiAgICAgIGlmICghZGlyKSByZXR1cm4gZGF0ZTtcclxuICAgICAgdmFyIG5ld19kYXRlID0gbmV3IERhdGUoZGF0ZS52YWx1ZU9mKCkpO1xyXG4gICAgICAvL2RpciA9IGRpciA+IDAgPyAxIDogLTE7XHJcbiAgICAgIG5ld19kYXRlLnNldFVUQ0hvdXJzKG5ld19kYXRlLmdldFVUQ0hvdXJzKCkgKyBkaXIpO1xyXG4gICAgICByZXR1cm4gbmV3X2RhdGU7XHJcbiAgICB9LFxyXG5cclxuICAgIG1vdmVEYXRlOiBmdW5jdGlvbiAoZGF0ZSwgZGlyKSB7XHJcbiAgICAgIGlmICghZGlyKSByZXR1cm4gZGF0ZTtcclxuICAgICAgdmFyIG5ld19kYXRlID0gbmV3IERhdGUoZGF0ZS52YWx1ZU9mKCkpO1xyXG4gICAgICAvL2RpciA9IGRpciA+IDAgPyAxIDogLTE7XHJcbiAgICAgIG5ld19kYXRlLnNldFVUQ0RhdGUobmV3X2RhdGUuZ2V0VVRDRGF0ZSgpICsgZGlyKTtcclxuICAgICAgcmV0dXJuIG5ld19kYXRlO1xyXG4gICAgfSxcclxuXHJcbiAgICBtb3ZlTW9udGg6IGZ1bmN0aW9uIChkYXRlLCBkaXIpIHtcclxuICAgICAgaWYgKCFkaXIpIHJldHVybiBkYXRlO1xyXG4gICAgICB2YXIgbmV3X2RhdGUgPSBuZXcgRGF0ZShkYXRlLnZhbHVlT2YoKSksXHJcbiAgICAgICAgZGF5ID0gbmV3X2RhdGUuZ2V0VVRDRGF0ZSgpLFxyXG4gICAgICAgIG1vbnRoID0gbmV3X2RhdGUuZ2V0VVRDTW9udGgoKSxcclxuICAgICAgICBtYWcgPSBNYXRoLmFicyhkaXIpLFxyXG4gICAgICAgIG5ld19tb250aCwgdGVzdDtcclxuICAgICAgZGlyID0gZGlyID4gMCA/IDEgOiAtMTtcclxuICAgICAgaWYgKG1hZyA9PT0gMSkge1xyXG4gICAgICAgIHRlc3QgPSBkaXIgPT09IC0xXHJcbiAgICAgICAgICAvLyBJZiBnb2luZyBiYWNrIG9uZSBtb250aCwgbWFrZSBzdXJlIG1vbnRoIGlzIG5vdCBjdXJyZW50IG1vbnRoXHJcbiAgICAgICAgICAvLyAoZWcsIE1hciAzMSAtPiBGZWIgMzEgPT09IEZlYiAyOCwgbm90IE1hciAwMilcclxuICAgICAgICAgID8gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgcmV0dXJuIG5ld19kYXRlLmdldFVUQ01vbnRoKCkgPT09IG1vbnRoO1xyXG4gICAgICAgIH1cclxuICAgICAgICAgIC8vIElmIGdvaW5nIGZvcndhcmQgb25lIG1vbnRoLCBtYWtlIHN1cmUgbW9udGggaXMgYXMgZXhwZWN0ZWRcclxuICAgICAgICAgIC8vIChlZywgSmFuIDMxIC0+IEZlYiAzMSA9PT0gRmViIDI4LCBub3QgTWFyIDAyKVxyXG4gICAgICAgICAgOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICByZXR1cm4gbmV3X2RhdGUuZ2V0VVRDTW9udGgoKSAhPT0gbmV3X21vbnRoO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgbmV3X21vbnRoID0gbW9udGggKyBkaXI7XHJcbiAgICAgICAgbmV3X2RhdGUuc2V0VVRDTW9udGgobmV3X21vbnRoKTtcclxuICAgICAgICAvLyBEZWMgLT4gSmFuICgxMikgb3IgSmFuIC0+IERlYyAoLTEpIC0tIGxpbWl0IGV4cGVjdGVkIGRhdGUgdG8gMC0xMVxyXG4gICAgICAgIGlmIChuZXdfbW9udGggPCAwIHx8IG5ld19tb250aCA+IDExKVxyXG4gICAgICAgICAgbmV3X21vbnRoID0gKG5ld19tb250aCArIDEyKSAlIDEyO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEZvciBtYWduaXR1ZGVzID4xLCBtb3ZlIG9uZSBtb250aCBhdCBhIHRpbWUuLi5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1hZzsgaSsrKVxyXG4gICAgICAgICAgLy8gLi4ud2hpY2ggbWlnaHQgZGVjcmVhc2UgdGhlIGRheSAoZWcsIEphbiAzMSB0byBGZWIgMjgsIGV0YykuLi5cclxuICAgICAgICAgIG5ld19kYXRlID0gdGhpcy5tb3ZlTW9udGgobmV3X2RhdGUsIGRpcik7XHJcbiAgICAgICAgLy8gLi4udGhlbiByZXNldCB0aGUgZGF5LCBrZWVwaW5nIGl0IGluIHRoZSBuZXcgbW9udGhcclxuICAgICAgICBuZXdfbW9udGggPSBuZXdfZGF0ZS5nZXRVVENNb250aCgpO1xyXG4gICAgICAgIG5ld19kYXRlLnNldFVUQ0RhdGUoZGF5KTtcclxuICAgICAgICB0ZXN0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgcmV0dXJuIG5ld19tb250aCAhPT0gbmV3X2RhdGUuZ2V0VVRDTW9udGgoKTtcclxuICAgICAgICB9O1xyXG4gICAgICB9XHJcbiAgICAgIC8vIENvbW1vbiBkYXRlLXJlc2V0dGluZyBsb29wIC0tIGlmIGRhdGUgaXMgYmV5b25kIGVuZCBvZiBtb250aCwgbWFrZSBpdFxyXG4gICAgICAvLyBlbmQgb2YgbW9udGhcclxuICAgICAgd2hpbGUgKHRlc3QoKSkge1xyXG4gICAgICAgIG5ld19kYXRlLnNldFVUQ0RhdGUoLS1kYXkpO1xyXG4gICAgICAgIG5ld19kYXRlLnNldFVUQ01vbnRoKG5ld19tb250aCk7XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIG5ld19kYXRlO1xyXG4gICAgfSxcclxuXHJcbiAgICBtb3ZlWWVhcjogZnVuY3Rpb24gKGRhdGUsIGRpcikge1xyXG4gICAgICByZXR1cm4gdGhpcy5tb3ZlTW9udGgoZGF0ZSwgZGlyICogMTIpO1xyXG4gICAgfSxcclxuXHJcbiAgICBkYXRlV2l0aGluUmFuZ2U6IGZ1bmN0aW9uIChkYXRlKSB7XHJcbiAgICAgIHJldHVybiBkYXRlID49IHRoaXMuc3RhcnREYXRlICYmIGRhdGUgPD0gdGhpcy5lbmREYXRlO1xyXG4gICAgfSxcclxuXHJcbiAgICBrZXlkb3duOiBmdW5jdGlvbiAoZSkge1xyXG4gICAgICBpZiAodGhpcy5waWNrZXIuaXMoJzpub3QoOnZpc2libGUpJykpIHtcclxuICAgICAgICBpZiAoZS5rZXlDb2RlID09PSAyNykgLy8gYWxsb3cgZXNjYXBlIHRvIGhpZGUgYW5kIHJlLXNob3cgcGlja2VyXHJcbiAgICAgICAgICB0aGlzLnNob3coKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdmFyIGRhdGVDaGFuZ2VkID0gZmFsc2UsXHJcbiAgICAgICAgZGlyLCBuZXdEYXRlLCBuZXdWaWV3RGF0ZTtcclxuICAgICAgc3dpdGNoIChlLmtleUNvZGUpIHtcclxuICAgICAgICBjYXNlIDI3OiAvLyBlc2NhcGVcclxuICAgICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAzNzogLy8gbGVmdFxyXG4gICAgICAgIGNhc2UgMzk6IC8vIHJpZ2h0XHJcbiAgICAgICAgICBpZiAoIXRoaXMua2V5Ym9hcmROYXZpZ2F0aW9uKSBicmVhaztcclxuICAgICAgICAgIGRpciA9IGUua2V5Q29kZSA9PT0gMzcgPyAtMSA6IDE7XHJcbiAgICAgICAgICB2YXIgdmlld01vZGUgPSB0aGlzLnZpZXdNb2RlO1xyXG4gICAgICAgICAgaWYgKGUuY3RybEtleSkge1xyXG4gICAgICAgICAgICB2aWV3TW9kZSArPSAyO1xyXG4gICAgICAgICAgfSBlbHNlIGlmIChlLnNoaWZ0S2V5KSB7XHJcbiAgICAgICAgICAgIHZpZXdNb2RlICs9IDE7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAodmlld01vZGUgPT09IDQpIHtcclxuICAgICAgICAgICAgbmV3RGF0ZSA9IHRoaXMubW92ZVllYXIodGhpcy5kYXRlLCBkaXIpO1xyXG4gICAgICAgICAgICBuZXdWaWV3RGF0ZSA9IHRoaXMubW92ZVllYXIodGhpcy52aWV3RGF0ZSwgZGlyKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAodmlld01vZGUgPT09IDMpIHtcclxuICAgICAgICAgICAgbmV3RGF0ZSA9IHRoaXMubW92ZU1vbnRoKHRoaXMuZGF0ZSwgZGlyKTtcclxuICAgICAgICAgICAgbmV3Vmlld0RhdGUgPSB0aGlzLm1vdmVNb250aCh0aGlzLnZpZXdEYXRlLCBkaXIpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh2aWV3TW9kZSA9PT0gMikge1xyXG4gICAgICAgICAgICBuZXdEYXRlID0gdGhpcy5tb3ZlRGF0ZSh0aGlzLmRhdGUsIGRpcik7XHJcbiAgICAgICAgICAgIG5ld1ZpZXdEYXRlID0gdGhpcy5tb3ZlRGF0ZSh0aGlzLnZpZXdEYXRlLCBkaXIpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh2aWV3TW9kZSA9PT0gMSkge1xyXG4gICAgICAgICAgICBuZXdEYXRlID0gdGhpcy5tb3ZlSG91cih0aGlzLmRhdGUsIGRpcik7XHJcbiAgICAgICAgICAgIG5ld1ZpZXdEYXRlID0gdGhpcy5tb3ZlSG91cih0aGlzLnZpZXdEYXRlLCBkaXIpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh2aWV3TW9kZSA9PT0gMCkge1xyXG4gICAgICAgICAgICBuZXdEYXRlID0gdGhpcy5tb3ZlTWludXRlKHRoaXMuZGF0ZSwgZGlyKTtcclxuICAgICAgICAgICAgbmV3Vmlld0RhdGUgPSB0aGlzLm1vdmVNaW51dGUodGhpcy52aWV3RGF0ZSwgZGlyKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGlmICh0aGlzLmRhdGVXaXRoaW5SYW5nZShuZXdEYXRlKSkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGUgPSBuZXdEYXRlO1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdEYXRlID0gbmV3Vmlld0RhdGU7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VmFsdWUoKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBkYXRlQ2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDM4OiAvLyB1cFxyXG4gICAgICAgIGNhc2UgNDA6IC8vIGRvd25cclxuICAgICAgICAgIGlmICghdGhpcy5rZXlib2FyZE5hdmlnYXRpb24pIGJyZWFrO1xyXG4gICAgICAgICAgZGlyID0gZS5rZXlDb2RlID09PSAzOCA/IC0xIDogMTtcclxuICAgICAgICAgIHZpZXdNb2RlID0gdGhpcy52aWV3TW9kZTtcclxuICAgICAgICAgIGlmIChlLmN0cmxLZXkpIHtcclxuICAgICAgICAgICAgdmlld01vZGUgKz0gMjtcclxuICAgICAgICAgIH0gZWxzZSBpZiAoZS5zaGlmdEtleSkge1xyXG4gICAgICAgICAgICB2aWV3TW9kZSArPSAxO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHZpZXdNb2RlID09PSA0KSB7XHJcbiAgICAgICAgICAgIG5ld0RhdGUgPSB0aGlzLm1vdmVZZWFyKHRoaXMuZGF0ZSwgZGlyKTtcclxuICAgICAgICAgICAgbmV3Vmlld0RhdGUgPSB0aGlzLm1vdmVZZWFyKHRoaXMudmlld0RhdGUsIGRpcik7XHJcbiAgICAgICAgICB9IGVsc2UgaWYgKHZpZXdNb2RlID09PSAzKSB7XHJcbiAgICAgICAgICAgIG5ld0RhdGUgPSB0aGlzLm1vdmVNb250aCh0aGlzLmRhdGUsIGRpcik7XHJcbiAgICAgICAgICAgIG5ld1ZpZXdEYXRlID0gdGhpcy5tb3ZlTW9udGgodGhpcy52aWV3RGF0ZSwgZGlyKTtcclxuICAgICAgICAgIH0gZWxzZSBpZiAodmlld01vZGUgPT09IDIpIHtcclxuICAgICAgICAgICAgbmV3RGF0ZSA9IHRoaXMubW92ZURhdGUodGhpcy5kYXRlLCBkaXIgKiA3KTtcclxuICAgICAgICAgICAgbmV3Vmlld0RhdGUgPSB0aGlzLm1vdmVEYXRlKHRoaXMudmlld0RhdGUsIGRpciAqIDcpO1xyXG4gICAgICAgICAgfSBlbHNlIGlmICh2aWV3TW9kZSA9PT0gMSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zaG93TWVyaWRpYW4pIHtcclxuICAgICAgICAgICAgICBuZXdEYXRlID0gdGhpcy5tb3ZlSG91cih0aGlzLmRhdGUsIGRpciAqIDYpO1xyXG4gICAgICAgICAgICAgIG5ld1ZpZXdEYXRlID0gdGhpcy5tb3ZlSG91cih0aGlzLnZpZXdEYXRlLCBkaXIgKiA2KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBuZXdEYXRlID0gdGhpcy5tb3ZlSG91cih0aGlzLmRhdGUsIGRpciAqIDQpO1xyXG4gICAgICAgICAgICAgIG5ld1ZpZXdEYXRlID0gdGhpcy5tb3ZlSG91cih0aGlzLnZpZXdEYXRlLCBkaXIgKiA0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIGlmICh2aWV3TW9kZSA9PT0gMCkge1xyXG4gICAgICAgICAgICBuZXdEYXRlID0gdGhpcy5tb3ZlTWludXRlKHRoaXMuZGF0ZSwgZGlyICogNCk7XHJcbiAgICAgICAgICAgIG5ld1ZpZXdEYXRlID0gdGhpcy5tb3ZlTWludXRlKHRoaXMudmlld0RhdGUsIGRpciAqIDQpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHRoaXMuZGF0ZVdpdGhpblJhbmdlKG5ld0RhdGUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0ZSA9IG5ld0RhdGU7XHJcbiAgICAgICAgICAgIHRoaXMudmlld0RhdGUgPSBuZXdWaWV3RGF0ZTtcclxuICAgICAgICAgICAgdGhpcy5zZXRWYWx1ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGRhdGVDaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgMTM6IC8vIGVudGVyXHJcbiAgICAgICAgICBpZiAodGhpcy52aWV3TW9kZSAhPT0gMCkge1xyXG4gICAgICAgICAgICB2YXIgb2xkVmlld01vZGUgPSB0aGlzLnZpZXdNb2RlO1xyXG4gICAgICAgICAgICB0aGlzLnNob3dNb2RlKC0xKTtcclxuICAgICAgICAgICAgdGhpcy5maWxsKCk7XHJcbiAgICAgICAgICAgIGlmIChvbGRWaWV3TW9kZSA9PT0gdGhpcy52aWV3TW9kZSAmJiB0aGlzLmF1dG9jbG9zZSkge1xyXG4gICAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmZpbGwoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuYXV0b2Nsb3NlKSB7XHJcbiAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGNhc2UgOTogLy8gdGFiXHJcbiAgICAgICAgICB0aGlzLmhpZGUoKTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChkYXRlQ2hhbmdlZCkge1xyXG4gICAgICAgIHZhciBlbGVtZW50O1xyXG4gICAgICAgIGlmICh0aGlzLmlzSW5wdXQpIHtcclxuICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLmVsZW1lbnQ7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNvbXBvbmVudCkge1xyXG4gICAgICAgICAgZWxlbWVudCA9IHRoaXMuZWxlbWVudC5maW5kKCdpbnB1dCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgZWxlbWVudC5jaGFuZ2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5lbGVtZW50LnRyaWdnZXIoe1xyXG4gICAgICAgICAgdHlwZTogJ2NoYW5nZURhdGUnLFxyXG4gICAgICAgICAgZGF0ZTogdGhpcy5nZXREYXRlKClcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBzaG93TW9kZTogZnVuY3Rpb24gKGRpcikge1xyXG4gICAgICBpZiAoZGlyKSB7XHJcbiAgICAgICAgdmFyIG5ld1ZpZXdNb2RlID0gTWF0aC5tYXgoMCwgTWF0aC5taW4oRFBHbG9iYWwubW9kZXMubGVuZ3RoIC0gMSwgdGhpcy52aWV3TW9kZSArIGRpcikpO1xyXG4gICAgICAgIGlmIChuZXdWaWV3TW9kZSA+PSB0aGlzLm1pblZpZXcgJiYgbmV3Vmlld01vZGUgPD0gdGhpcy5tYXhWaWV3KSB7XHJcbiAgICAgICAgICB0aGlzLmVsZW1lbnQudHJpZ2dlcih7XHJcbiAgICAgICAgICAgIHR5cGU6ICAgICAgICAnY2hhbmdlTW9kZScsXHJcbiAgICAgICAgICAgIGRhdGU6ICAgICAgICB0aGlzLnZpZXdEYXRlLFxyXG4gICAgICAgICAgICBvbGRWaWV3TW9kZTogdGhpcy52aWV3TW9kZSxcclxuICAgICAgICAgICAgbmV3Vmlld01vZGU6IG5ld1ZpZXdNb2RlXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICB0aGlzLnZpZXdNb2RlID0gbmV3Vmlld01vZGU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8qXHJcbiAgICAgICB2aXRhbGV0czogZml4aW5nIGJ1ZyBvZiB2ZXJ5IHNwZWNpYWwgY29uZGl0aW9uczpcclxuICAgICAgIGpxdWVyeSAxLjcuMSArIHdlYmtpdCArIHNob3cgaW5saW5lIGRhdGV0aW1lcGlja2VyIGluIGJvb3RzdHJhcCBwb3BvdmVyLlxyXG4gICAgICAgTWV0aG9kIHNob3coKSBkb2VzIG5vdCBzZXQgZGlzcGxheSBjc3MgY29ycmVjdGx5IGFuZCBkYXRldGltZXBpY2tlciBpcyBub3Qgc2hvd24uXHJcbiAgICAgICBDaGFuZ2VkIHRvIC5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKSBzb2x2ZSB0aGUgcHJvYmxlbS5cclxuICAgICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20vdml0YWxldHMveC1lZGl0YWJsZS9pc3N1ZXMvMzdcclxuXHJcbiAgICAgICBJbiBqcXVlcnkgMS43LjIrIGV2ZXJ5dGhpbmcgd29ya3MgZmluZS5cclxuICAgICAgICovXHJcbiAgICAgIC8vdGhpcy5waWNrZXIuZmluZCgnPmRpdicpLmhpZGUoKS5maWx0ZXIoJy5kYXRldGltZXBpY2tlci0nK0RQR2xvYmFsLm1vZGVzW3RoaXMudmlld01vZGVdLmNsc05hbWUpLnNob3coKTtcclxuICAgICAgdGhpcy5waWNrZXIuZmluZCgnPmRpdicpLmhpZGUoKS5maWx0ZXIoJy5kYXRldGltZXBpY2tlci0nICsgRFBHbG9iYWwubW9kZXNbdGhpcy52aWV3TW9kZV0uY2xzTmFtZSkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XHJcbiAgICAgIHRoaXMudXBkYXRlTmF2QXJyb3dzKCk7XHJcbiAgICB9LFxyXG5cclxuICAgIHJlc2V0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHRoaXMuX3NldERhdGUobnVsbCwgJ2RhdGUnKTtcclxuICAgIH0sXHJcblxyXG4gICAgY29udmVydFZpZXdNb2RlVGV4dDogIGZ1bmN0aW9uICh2aWV3TW9kZSkge1xyXG4gICAgICBzd2l0Y2ggKHZpZXdNb2RlKSB7XHJcbiAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgcmV0dXJuICdkZWNhZGUnO1xyXG4gICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgIHJldHVybiAneWVhcic7XHJcbiAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgcmV0dXJuICdtb250aCc7XHJcbiAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgcmV0dXJuICdkYXknO1xyXG4gICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgIHJldHVybiAnaG91cic7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9O1xyXG5cclxuICB2YXIgb2xkID0gJC5mbi5kYXRldGltZXBpY2tlcjtcclxuICAkLmZuLmRhdGV0aW1lcGlja2VyID0gZnVuY3Rpb24gKG9wdGlvbikge1xyXG4gICAgdmFyIGFyZ3MgPSBBcnJheS5hcHBseShudWxsLCBhcmd1bWVudHMpO1xyXG4gICAgYXJncy5zaGlmdCgpO1xyXG4gICAgdmFyIGludGVybmFsX3JldHVybjtcclxuICAgIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXHJcbiAgICAgICAgZGF0YSA9ICR0aGlzLmRhdGEoJ2RhdGV0aW1lcGlja2VyJyksXHJcbiAgICAgICAgb3B0aW9ucyA9IHR5cGVvZiBvcHRpb24gPT09ICdvYmplY3QnICYmIG9wdGlvbjtcclxuICAgICAgaWYgKCFkYXRhKSB7XHJcbiAgICAgICAgJHRoaXMuZGF0YSgnZGF0ZXRpbWVwaWNrZXInLCAoZGF0YSA9IG5ldyBEYXRldGltZXBpY2tlcih0aGlzLCAkLmV4dGVuZCh7fSwgJC5mbi5kYXRldGltZXBpY2tlci5kZWZhdWx0cywgb3B0aW9ucykpKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT09ICdzdHJpbmcnICYmIHR5cGVvZiBkYXRhW29wdGlvbl0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBpbnRlcm5hbF9yZXR1cm4gPSBkYXRhW29wdGlvbl0uYXBwbHkoZGF0YSwgYXJncyk7XHJcbiAgICAgICAgaWYgKGludGVybmFsX3JldHVybiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIGlmIChpbnRlcm5hbF9yZXR1cm4gIT09IHVuZGVmaW5lZClcclxuICAgICAgcmV0dXJuIGludGVybmFsX3JldHVybjtcclxuICAgIGVsc2VcclxuICAgICAgcmV0dXJuIHRoaXM7XHJcbiAgfTtcclxuXHJcbiAgJC5mbi5kYXRldGltZXBpY2tlci5kZWZhdWx0cyA9IHtcclxuICB9O1xyXG4gICQuZm4uZGF0ZXRpbWVwaWNrZXIuQ29uc3RydWN0b3IgPSBEYXRldGltZXBpY2tlcjtcclxuICB2YXIgZGF0ZXMgPSAkLmZuLmRhdGV0aW1lcGlja2VyLmRhdGVzID0ge1xyXG4gICAgZW46IHtcclxuICAgICAgZGF5czogICAgICAgIFsnU3VuZGF5JywgJ01vbmRheScsICdUdWVzZGF5JywgJ1dlZG5lc2RheScsICdUaHVyc2RheScsICdGcmlkYXknLCAnU2F0dXJkYXknLCAnU3VuZGF5J10sXHJcbiAgICAgIGRheXNTaG9ydDogICBbJ1N1bicsICdNb24nLCAnVHVlJywgJ1dlZCcsICdUaHUnLCAnRnJpJywgJ1NhdCcsICdTdW4nXSxcclxuICAgICAgZGF5c01pbjogICAgIFsnU3UnLCAnTW8nLCAnVHUnLCAnV2UnLCAnVGgnLCAnRnInLCAnU2EnLCAnU3UnXSxcclxuICAgICAgbW9udGhzOiAgICAgIFsnSmFudWFyeScsICdGZWJydWFyeScsICdNYXJjaCcsICdBcHJpbCcsICdNYXknLCAnSnVuZScsICdKdWx5JywgJ0F1Z3VzdCcsICdTZXB0ZW1iZXInLCAnT2N0b2JlcicsICdOb3ZlbWJlcicsICdEZWNlbWJlciddLFxyXG4gICAgICBtb250aHNTaG9ydDogWydKYW4nLCAnRmViJywgJ01hcicsICdBcHInLCAnTWF5JywgJ0p1bicsICdKdWwnLCAnQXVnJywgJ1NlcCcsICdPY3QnLCAnTm92JywgJ0RlYyddLFxyXG4gICAgICBtZXJpZGllbTogICAgWydhbScsICdwbSddLFxyXG4gICAgICBzdWZmaXg6ICAgICAgWydzdCcsICduZCcsICdyZCcsICd0aCddLFxyXG4gICAgICB0b2RheTogICAgICAgJ1RvZGF5JyxcclxuICAgICAgY2xlYXI6ICAgICAgICdDbGVhcidcclxuICAgIH1cclxuICB9O1xyXG5cclxuICB2YXIgRFBHbG9iYWwgPSB7XHJcbiAgICBtb2RlczogICAgICAgICAgICBbXHJcbiAgICAgIHtcclxuICAgICAgICBjbHNOYW1lOiAnbWludXRlcycsXHJcbiAgICAgICAgbmF2Rm5jOiAgJ0hvdXJzJyxcclxuICAgICAgICBuYXZTdGVwOiAxXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBjbHNOYW1lOiAnaG91cnMnLFxyXG4gICAgICAgIG5hdkZuYzogICdEYXRlJyxcclxuICAgICAgICBuYXZTdGVwOiAxXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBjbHNOYW1lOiAnZGF5cycsXHJcbiAgICAgICAgbmF2Rm5jOiAgJ01vbnRoJyxcclxuICAgICAgICBuYXZTdGVwOiAxXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICBjbHNOYW1lOiAnbW9udGhzJyxcclxuICAgICAgICBuYXZGbmM6ICAnRnVsbFllYXInLFxyXG4gICAgICAgIG5hdlN0ZXA6IDFcclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIGNsc05hbWU6ICd5ZWFycycsXHJcbiAgICAgICAgbmF2Rm5jOiAgJ0Z1bGxZZWFyJyxcclxuICAgICAgICBuYXZTdGVwOiAxMFxyXG4gICAgICB9XHJcbiAgICBdLFxyXG4gICAgaXNMZWFwWWVhcjogICAgICAgZnVuY3Rpb24gKHllYXIpIHtcclxuICAgICAgcmV0dXJuICgoKHllYXIgJSA0ID09PSAwKSAmJiAoeWVhciAlIDEwMCAhPT0gMCkpIHx8ICh5ZWFyICUgNDAwID09PSAwKSlcclxuICAgIH0sXHJcbiAgICBnZXREYXlzSW5Nb250aDogICBmdW5jdGlvbiAoeWVhciwgbW9udGgpIHtcclxuICAgICAgcmV0dXJuIFszMSwgKERQR2xvYmFsLmlzTGVhcFllYXIoeWVhcikgPyAyOSA6IDI4KSwgMzEsIDMwLCAzMSwgMzAsIDMxLCAzMSwgMzAsIDMxLCAzMCwgMzFdW21vbnRoXVxyXG4gICAgfSxcclxuICAgIGdldERlZmF1bHRGb3JtYXQ6IGZ1bmN0aW9uICh0eXBlLCBmaWVsZCkge1xyXG4gICAgICBpZiAodHlwZSA9PT0gJ3N0YW5kYXJkJykge1xyXG4gICAgICAgIGlmIChmaWVsZCA9PT0gJ2lucHV0JylcclxuICAgICAgICAgIHJldHVybiAneXl5eS1tbS1kZCBoaDppaSc7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgcmV0dXJuICd5eXl5LW1tLWRkIGhoOmlpOnNzJztcclxuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAncGhwJykge1xyXG4gICAgICAgIGlmIChmaWVsZCA9PT0gJ2lucHV0JylcclxuICAgICAgICAgIHJldHVybiAnWS1tLWQgSDppJztcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICByZXR1cm4gJ1ktbS1kIEg6aTpzJztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZm9ybWF0IHR5cGUuJyk7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgICB2YWxpZFBhcnRzOiBmdW5jdGlvbiAodHlwZSkge1xyXG4gICAgICBpZiAodHlwZSA9PT0gJ3N0YW5kYXJkJykge1xyXG4gICAgICAgIHJldHVybiAvdHxoaD98SEg/fHB8UHx6fFp8aWk/fHNzP3xkZD98REQ/fG1tP3xNTT98eXkoPzp5eSk/L2c7XHJcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3BocCcpIHtcclxuICAgICAgICByZXR1cm4gL1tkRGpsTnd6Rm1NblN0eVlhQUJnR2hIaXNdL2c7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGZvcm1hdCB0eXBlLicpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgbm9ucHVuY3R1YXRpb246IC9bXiAtXFwvOi1AXFxbLWB7LX5cXHRcXG5cXHJUWl0rL2csXHJcbiAgICBwYXJzZUZvcm1hdDogZnVuY3Rpb24gKGZvcm1hdCwgdHlwZSkge1xyXG4gICAgICAvLyBJRSB0cmVhdHMgXFwwIGFzIGEgc3RyaW5nIGVuZCBpbiBpbnB1dHMgKHRydW5jYXRpbmcgdGhlIHZhbHVlKSxcclxuICAgICAgLy8gc28gaXQncyBhIGJhZCBmb3JtYXQgZGVsaW1pdGVyLCBhbnl3YXlcclxuICAgICAgdmFyIHNlcGFyYXRvcnMgPSBmb3JtYXQucmVwbGFjZSh0aGlzLnZhbGlkUGFydHModHlwZSksICdcXDAnKS5zcGxpdCgnXFwwJyksXHJcbiAgICAgICAgcGFydHMgPSBmb3JtYXQubWF0Y2godGhpcy52YWxpZFBhcnRzKHR5cGUpKTtcclxuICAgICAgaWYgKCFzZXBhcmF0b3JzIHx8ICFzZXBhcmF0b3JzLmxlbmd0aCB8fCAhcGFydHMgfHwgcGFydHMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGRhdGUgZm9ybWF0LicpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiB7c2VwYXJhdG9yczogc2VwYXJhdG9ycywgcGFydHM6IHBhcnRzfTtcclxuICAgIH0sXHJcbiAgICBwYXJzZURhdGU6IGZ1bmN0aW9uIChkYXRlLCBmb3JtYXQsIGxhbmd1YWdlLCB0eXBlLCB0aW1lem9uZSkge1xyXG4gICAgICBpZiAoZGF0ZSBpbnN0YW5jZW9mIERhdGUpIHtcclxuICAgICAgICB2YXIgZGF0ZVVUQyA9IG5ldyBEYXRlKGRhdGUudmFsdWVPZigpIC0gZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpICogNjAwMDApO1xyXG4gICAgICAgIGRhdGVVVEMuc2V0TWlsbGlzZWNvbmRzKDApO1xyXG4gICAgICAgIHJldHVybiBkYXRlVVRDO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICgvXlxcZHs0fVxcLVxcZHsxLDJ9XFwtXFxkezEsMn0kLy50ZXN0KGRhdGUpKSB7XHJcbiAgICAgICAgZm9ybWF0ID0gdGhpcy5wYXJzZUZvcm1hdCgneXl5eS1tbS1kZCcsIHR5cGUpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICgvXlxcZHs0fVxcLVxcZHsxLDJ9XFwtXFxkezEsMn1bVCBdXFxkezEsMn1cXDpcXGR7MSwyfSQvLnRlc3QoZGF0ZSkpIHtcclxuICAgICAgICBmb3JtYXQgPSB0aGlzLnBhcnNlRm9ybWF0KCd5eXl5LW1tLWRkIGhoOmlpJywgdHlwZSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKC9eXFxkezR9XFwtXFxkezEsMn1cXC1cXGR7MSwyfVtUIF1cXGR7MSwyfVxcOlxcZHsxLDJ9XFw6XFxkezEsMn1bWl17MCwxfSQvLnRlc3QoZGF0ZSkpIHtcclxuICAgICAgICBmb3JtYXQgPSB0aGlzLnBhcnNlRm9ybWF0KCd5eXl5LW1tLWRkIGhoOmlpOnNzJywgdHlwZSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKC9eWy0rXVxcZCtbZG13eV0oW1xccyxdK1stK11cXGQrW2Rtd3ldKSokLy50ZXN0KGRhdGUpKSB7XHJcbiAgICAgICAgdmFyIHBhcnRfcmUgPSAvKFstK11cXGQrKShbZG13eV0pLyxcclxuICAgICAgICAgIHBhcnRzID0gZGF0ZS5tYXRjaCgvKFstK11cXGQrKShbZG13eV0pL2cpLFxyXG4gICAgICAgICAgcGFydCwgZGlyO1xyXG4gICAgICAgIGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFydHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIHBhcnQgPSBwYXJ0X3JlLmV4ZWMocGFydHNbaV0pO1xyXG4gICAgICAgICAgZGlyID0gcGFyc2VJbnQocGFydFsxXSk7XHJcbiAgICAgICAgICBzd2l0Y2ggKHBhcnRbMl0pIHtcclxuICAgICAgICAgICAgY2FzZSAnZCc6XHJcbiAgICAgICAgICAgICAgZGF0ZS5zZXRVVENEYXRlKGRhdGUuZ2V0VVRDRGF0ZSgpICsgZGlyKTtcclxuICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnbSc6XHJcbiAgICAgICAgICAgICAgZGF0ZSA9IERhdGV0aW1lcGlja2VyLnByb3RvdHlwZS5tb3ZlTW9udGguY2FsbChEYXRldGltZXBpY2tlci5wcm90b3R5cGUsIGRhdGUsIGRpcik7XHJcbiAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ3cnOlxyXG4gICAgICAgICAgICAgIGRhdGUuc2V0VVRDRGF0ZShkYXRlLmdldFVUQ0RhdGUoKSArIGRpciAqIDcpO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICd5JzpcclxuICAgICAgICAgICAgICBkYXRlID0gRGF0ZXRpbWVwaWNrZXIucHJvdG90eXBlLm1vdmVZZWFyLmNhbGwoRGF0ZXRpbWVwaWNrZXIucHJvdG90eXBlLCBkYXRlLCBkaXIpO1xyXG4gICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gVVRDRGF0ZShkYXRlLmdldFVUQ0Z1bGxZZWFyKCksIGRhdGUuZ2V0VVRDTW9udGgoKSwgZGF0ZS5nZXRVVENEYXRlKCksIGRhdGUuZ2V0VVRDSG91cnMoKSwgZGF0ZS5nZXRVVENNaW51dGVzKCksIGRhdGUuZ2V0VVRDU2Vjb25kcygpLCAwKTtcclxuICAgICAgfVxyXG4gICAgICB2YXIgcGFydHMgPSBkYXRlICYmIGRhdGUudG9TdHJpbmcoKS5tYXRjaCh0aGlzLm5vbnB1bmN0dWF0aW9uKSB8fCBbXSxcclxuICAgICAgICBkYXRlID0gbmV3IERhdGUoMCwgMCwgMCwgMCwgMCwgMCwgMCksXHJcbiAgICAgICAgcGFyc2VkID0ge30sXHJcbiAgICAgICAgc2V0dGVyc19vcmRlciA9IFsnaGgnLCAnaCcsICdpaScsICdpJywgJ3NzJywgJ3MnLCAneXl5eScsICd5eScsICdNJywgJ01NJywgJ20nLCAnbW0nLCAnRCcsICdERCcsICdkJywgJ2RkJywgJ0gnLCAnSEgnLCAncCcsICdQJywgJ3onLCAnWiddLFxyXG4gICAgICAgIHNldHRlcnNfbWFwID0ge1xyXG4gICAgICAgICAgaGg6ICAgZnVuY3Rpb24gKGQsIHYpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGQuc2V0VVRDSG91cnModik7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgaDogICAgZnVuY3Rpb24gKGQsIHYpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGQuc2V0VVRDSG91cnModik7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgSEg6ICAgZnVuY3Rpb24gKGQsIHYpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGQuc2V0VVRDSG91cnModiA9PT0gMTIgPyAwIDogdik7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgSDogICAgZnVuY3Rpb24gKGQsIHYpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGQuc2V0VVRDSG91cnModiA9PT0gMTIgPyAwIDogdik7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgaWk6ICAgZnVuY3Rpb24gKGQsIHYpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGQuc2V0VVRDTWludXRlcyh2KTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBpOiAgICBmdW5jdGlvbiAoZCwgdikge1xyXG4gICAgICAgICAgICByZXR1cm4gZC5zZXRVVENNaW51dGVzKHYpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHNzOiAgIGZ1bmN0aW9uIChkLCB2KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBkLnNldFVUQ1NlY29uZHModik7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgczogICAgZnVuY3Rpb24gKGQsIHYpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGQuc2V0VVRDU2Vjb25kcyh2KTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB5eXl5OiBmdW5jdGlvbiAoZCwgdikge1xyXG4gICAgICAgICAgICByZXR1cm4gZC5zZXRVVENGdWxsWWVhcih2KTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICB5eTogICBmdW5jdGlvbiAoZCwgdikge1xyXG4gICAgICAgICAgICByZXR1cm4gZC5zZXRVVENGdWxsWWVhcigyMDAwICsgdik7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbTogICAgZnVuY3Rpb24gKGQsIHYpIHtcclxuICAgICAgICAgICAgdiAtPSAxO1xyXG4gICAgICAgICAgICB3aGlsZSAodiA8IDApIHYgKz0gMTI7XHJcbiAgICAgICAgICAgIHYgJT0gMTI7XHJcbiAgICAgICAgICAgIGQuc2V0VVRDTW9udGgodik7XHJcbiAgICAgICAgICAgIHdoaWxlIChkLmdldFVUQ01vbnRoKCkgIT09IHYpXHJcbiAgICAgICAgICAgICAgaWYgKGlzTmFOKGQuZ2V0VVRDTW9udGgoKSkpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZDtcclxuICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBkLnNldFVUQ0RhdGUoZC5nZXRVVENEYXRlKCkgLSAxKTtcclxuICAgICAgICAgICAgcmV0dXJuIGQ7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgZDogICAgZnVuY3Rpb24gKGQsIHYpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGQuc2V0VVRDRGF0ZSh2KTtcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBwOiAgICBmdW5jdGlvbiAoZCwgdikge1xyXG4gICAgICAgICAgICByZXR1cm4gZC5zZXRVVENIb3Vycyh2ID09PSAxID8gZC5nZXRVVENIb3VycygpICsgMTIgOiBkLmdldFVUQ0hvdXJzKCkpO1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIHo6ICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRpbWV6b25lXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICB2YWwsIGZpbHRlcmVkLCBwYXJ0O1xyXG4gICAgICBzZXR0ZXJzX21hcFsnTSddID0gc2V0dGVyc19tYXBbJ01NJ10gPSBzZXR0ZXJzX21hcFsnbW0nXSA9IHNldHRlcnNfbWFwWydtJ107XHJcbiAgICAgIHNldHRlcnNfbWFwWydkZCddID0gc2V0dGVyc19tYXBbJ2QnXTtcclxuICAgICAgc2V0dGVyc19tYXBbJ1AnXSA9IHNldHRlcnNfbWFwWydwJ107XHJcbiAgICAgIHNldHRlcnNfbWFwWydaJ10gPSBzZXR0ZXJzX21hcFsneiddO1xyXG4gICAgICBkYXRlID0gVVRDRGF0ZShkYXRlLmdldEZ1bGxZZWFyKCksIGRhdGUuZ2V0TW9udGgoKSwgZGF0ZS5nZXREYXRlKCksIGRhdGUuZ2V0SG91cnMoKSwgZGF0ZS5nZXRNaW51dGVzKCksIGRhdGUuZ2V0U2Vjb25kcygpKTtcclxuICAgICAgaWYgKHBhcnRzLmxlbmd0aCA9PT0gZm9ybWF0LnBhcnRzLmxlbmd0aCkge1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBjbnQgPSBmb3JtYXQucGFydHMubGVuZ3RoOyBpIDwgY250OyBpKyspIHtcclxuICAgICAgICAgIHZhbCA9IHBhcnNlSW50KHBhcnRzW2ldLCAxMCk7XHJcbiAgICAgICAgICBwYXJ0ID0gZm9ybWF0LnBhcnRzW2ldO1xyXG4gICAgICAgICAgaWYgKGlzTmFOKHZhbCkpIHtcclxuICAgICAgICAgICAgc3dpdGNoIChwYXJ0KSB7XHJcbiAgICAgICAgICAgICAgY2FzZSAnTU0nOlxyXG4gICAgICAgICAgICAgICAgZmlsdGVyZWQgPSAkKGRhdGVzW2xhbmd1YWdlXS5tb250aHMpLmZpbHRlcihmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBtID0gdGhpcy5zbGljZSgwLCBwYXJ0c1tpXS5sZW5ndGgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHAgPSBwYXJ0c1tpXS5zbGljZSgwLCBtLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgIHJldHVybiBtID09PSBwO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB2YWwgPSAkLmluQXJyYXkoZmlsdGVyZWRbMF0sIGRhdGVzW2xhbmd1YWdlXS5tb250aHMpICsgMTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIGNhc2UgJ00nOlxyXG4gICAgICAgICAgICAgICAgZmlsdGVyZWQgPSAkKGRhdGVzW2xhbmd1YWdlXS5tb250aHNTaG9ydCkuZmlsdGVyKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgdmFyIG0gPSB0aGlzLnNsaWNlKDAsIHBhcnRzW2ldLmxlbmd0aCksXHJcbiAgICAgICAgICAgICAgICAgICAgcCA9IHBhcnRzW2ldLnNsaWNlKDAsIG0ubGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgcmV0dXJuIG0udG9Mb3dlckNhc2UoKSA9PT0gcC50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB2YWwgPSAkLmluQXJyYXkoZmlsdGVyZWRbMF0sIGRhdGVzW2xhbmd1YWdlXS5tb250aHNTaG9ydCkgKyAxO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgY2FzZSAncCc6XHJcbiAgICAgICAgICAgICAgY2FzZSAnUCc6XHJcbiAgICAgICAgICAgICAgICB2YWwgPSAkLmluQXJyYXkocGFydHNbaV0udG9Mb3dlckNhc2UoKSwgZGF0ZXNbbGFuZ3VhZ2VdLm1lcmlkaWVtKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgIGNhc2UgJ3onOlxyXG4gICAgICAgICAgICAgIGNhc2UgJ1onOlxyXG4gICAgICAgICAgICAgICAgdGltZXpvbmU7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHBhcnNlZFtwYXJ0XSA9IHZhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHM7IGkgPCBzZXR0ZXJzX29yZGVyLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBzID0gc2V0dGVyc19vcmRlcltpXTtcclxuICAgICAgICAgIGlmIChzIGluIHBhcnNlZCAmJiAhaXNOYU4ocGFyc2VkW3NdKSlcclxuICAgICAgICAgICAgc2V0dGVyc19tYXBbc10oZGF0ZSwgcGFyc2VkW3NdKVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gZGF0ZTtcclxuICAgIH0sXHJcbiAgICBmb3JtYXREYXRlOiAgICAgICBmdW5jdGlvbiAoZGF0ZSwgZm9ybWF0LCBsYW5ndWFnZSwgdHlwZSwgdGltZXpvbmUpIHtcclxuICAgICAgaWYgKGRhdGUgPT09IG51bGwpIHtcclxuICAgICAgICByZXR1cm4gJyc7XHJcbiAgICAgIH1cclxuICAgICAgdmFyIHZhbDtcclxuICAgICAgaWYgKHR5cGUgPT09ICdzdGFuZGFyZCcpIHtcclxuICAgICAgICB2YWwgPSB7XHJcbiAgICAgICAgICB0OiAgICBkYXRlLmdldFRpbWUoKSxcclxuICAgICAgICAgIC8vIHllYXJcclxuICAgICAgICAgIHl5OiAgIGRhdGUuZ2V0VVRDRnVsbFllYXIoKS50b1N0cmluZygpLnN1YnN0cmluZygyKSxcclxuICAgICAgICAgIHl5eXk6IGRhdGUuZ2V0VVRDRnVsbFllYXIoKSxcclxuICAgICAgICAgIC8vIG1vbnRoXHJcbiAgICAgICAgICBtOiAgICBkYXRlLmdldFVUQ01vbnRoKCkgKyAxLFxyXG4gICAgICAgICAgTTogICAgZGF0ZXNbbGFuZ3VhZ2VdLm1vbnRoc1Nob3J0W2RhdGUuZ2V0VVRDTW9udGgoKV0sXHJcbiAgICAgICAgICBNTTogICBkYXRlc1tsYW5ndWFnZV0ubW9udGhzW2RhdGUuZ2V0VVRDTW9udGgoKV0sXHJcbiAgICAgICAgICAvLyBkYXlcclxuICAgICAgICAgIGQ6ICAgIGRhdGUuZ2V0VVRDRGF0ZSgpLFxyXG4gICAgICAgICAgRDogICAgZGF0ZXNbbGFuZ3VhZ2VdLmRheXNTaG9ydFtkYXRlLmdldFVUQ0RheSgpXSxcclxuICAgICAgICAgIEREOiAgIGRhdGVzW2xhbmd1YWdlXS5kYXlzW2RhdGUuZ2V0VVRDRGF5KCldLFxyXG4gICAgICAgICAgcDogICAgKGRhdGVzW2xhbmd1YWdlXS5tZXJpZGllbS5sZW5ndGggPT09IDIgPyBkYXRlc1tsYW5ndWFnZV0ubWVyaWRpZW1bZGF0ZS5nZXRVVENIb3VycygpIDwgMTIgPyAwIDogMV0gOiAnJyksXHJcbiAgICAgICAgICAvLyBob3VyXHJcbiAgICAgICAgICBoOiAgICBkYXRlLmdldFVUQ0hvdXJzKCksXHJcbiAgICAgICAgICAvLyBtaW51dGVcclxuICAgICAgICAgIGk6ICAgIGRhdGUuZ2V0VVRDTWludXRlcygpLFxyXG4gICAgICAgICAgLy8gc2Vjb25kXHJcbiAgICAgICAgICBzOiAgICBkYXRlLmdldFVUQ1NlY29uZHMoKSxcclxuICAgICAgICAgIC8vIHRpbWV6b25lXHJcbiAgICAgICAgICB6OiAgICB0aW1lem9uZVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChkYXRlc1tsYW5ndWFnZV0ubWVyaWRpZW0ubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgICAgICB2YWwuSCA9ICh2YWwuaCAlIDEyID09PSAwID8gMTIgOiB2YWwuaCAlIDEyKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICB2YWwuSCA9IHZhbC5oO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YWwuSEggPSAodmFsLkggPCAxMCA/ICcwJyA6ICcnKSArIHZhbC5IO1xyXG4gICAgICAgIHZhbC5QID0gdmFsLnAudG9VcHBlckNhc2UoKTtcclxuICAgICAgICB2YWwuWiA9IHZhbC56O1xyXG4gICAgICAgIHZhbC5oaCA9ICh2YWwuaCA8IDEwID8gJzAnIDogJycpICsgdmFsLmg7XHJcbiAgICAgICAgdmFsLmlpID0gKHZhbC5pIDwgMTAgPyAnMCcgOiAnJykgKyB2YWwuaTtcclxuICAgICAgICB2YWwuc3MgPSAodmFsLnMgPCAxMCA/ICcwJyA6ICcnKSArIHZhbC5zO1xyXG4gICAgICAgIHZhbC5kZCA9ICh2YWwuZCA8IDEwID8gJzAnIDogJycpICsgdmFsLmQ7XHJcbiAgICAgICAgdmFsLm1tID0gKHZhbC5tIDwgMTAgPyAnMCcgOiAnJykgKyB2YWwubTtcclxuICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAncGhwJykge1xyXG4gICAgICAgIC8vIHBocCBmb3JtYXRcclxuICAgICAgICB2YWwgPSB7XHJcbiAgICAgICAgICAvLyB5ZWFyXHJcbiAgICAgICAgICB5OiBkYXRlLmdldFVUQ0Z1bGxZZWFyKCkudG9TdHJpbmcoKS5zdWJzdHJpbmcoMiksXHJcbiAgICAgICAgICBZOiBkYXRlLmdldFVUQ0Z1bGxZZWFyKCksXHJcbiAgICAgICAgICAvLyBtb250aFxyXG4gICAgICAgICAgRjogZGF0ZXNbbGFuZ3VhZ2VdLm1vbnRoc1tkYXRlLmdldFVUQ01vbnRoKCldLFxyXG4gICAgICAgICAgTTogZGF0ZXNbbGFuZ3VhZ2VdLm1vbnRoc1Nob3J0W2RhdGUuZ2V0VVRDTW9udGgoKV0sXHJcbiAgICAgICAgICBuOiBkYXRlLmdldFVUQ01vbnRoKCkgKyAxLFxyXG4gICAgICAgICAgdDogRFBHbG9iYWwuZ2V0RGF5c0luTW9udGgoZGF0ZS5nZXRVVENGdWxsWWVhcigpLCBkYXRlLmdldFVUQ01vbnRoKCkpLFxyXG4gICAgICAgICAgLy8gZGF5XHJcbiAgICAgICAgICBqOiBkYXRlLmdldFVUQ0RhdGUoKSxcclxuICAgICAgICAgIGw6IGRhdGVzW2xhbmd1YWdlXS5kYXlzW2RhdGUuZ2V0VVRDRGF5KCldLFxyXG4gICAgICAgICAgRDogZGF0ZXNbbGFuZ3VhZ2VdLmRheXNTaG9ydFtkYXRlLmdldFVUQ0RheSgpXSxcclxuICAgICAgICAgIHc6IGRhdGUuZ2V0VVRDRGF5KCksIC8vIDAgLT4gNlxyXG4gICAgICAgICAgTjogKGRhdGUuZ2V0VVRDRGF5KCkgPT09IDAgPyA3IDogZGF0ZS5nZXRVVENEYXkoKSksICAgICAgIC8vIDEgLT4gN1xyXG4gICAgICAgICAgUzogKGRhdGUuZ2V0VVRDRGF0ZSgpICUgMTAgPD0gZGF0ZXNbbGFuZ3VhZ2VdLnN1ZmZpeC5sZW5ndGggPyBkYXRlc1tsYW5ndWFnZV0uc3VmZml4W2RhdGUuZ2V0VVRDRGF0ZSgpICUgMTAgLSAxXSA6ICcnKSxcclxuICAgICAgICAgIC8vIGhvdXJcclxuICAgICAgICAgIGE6IChkYXRlc1tsYW5ndWFnZV0ubWVyaWRpZW0ubGVuZ3RoID09PSAyID8gZGF0ZXNbbGFuZ3VhZ2VdLm1lcmlkaWVtW2RhdGUuZ2V0VVRDSG91cnMoKSA8IDEyID8gMCA6IDFdIDogJycpLFxyXG4gICAgICAgICAgZzogKGRhdGUuZ2V0VVRDSG91cnMoKSAlIDEyID09PSAwID8gMTIgOiBkYXRlLmdldFVUQ0hvdXJzKCkgJSAxMiksXHJcbiAgICAgICAgICBHOiBkYXRlLmdldFVUQ0hvdXJzKCksXHJcbiAgICAgICAgICAvLyBtaW51dGVcclxuICAgICAgICAgIGk6IGRhdGUuZ2V0VVRDTWludXRlcygpLFxyXG4gICAgICAgICAgLy8gc2Vjb25kXHJcbiAgICAgICAgICBzOiBkYXRlLmdldFVUQ1NlY29uZHMoKVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdmFsLm0gPSAodmFsLm4gPCAxMCA/ICcwJyA6ICcnKSArIHZhbC5uO1xyXG4gICAgICAgIHZhbC5kID0gKHZhbC5qIDwgMTAgPyAnMCcgOiAnJykgKyB2YWwuajtcclxuICAgICAgICB2YWwuQSA9IHZhbC5hLnRvU3RyaW5nKCkudG9VcHBlckNhc2UoKTtcclxuICAgICAgICB2YWwuaCA9ICh2YWwuZyA8IDEwID8gJzAnIDogJycpICsgdmFsLmc7XHJcbiAgICAgICAgdmFsLkggPSAodmFsLkcgPCAxMCA/ICcwJyA6ICcnKSArIHZhbC5HO1xyXG4gICAgICAgIHZhbC5pID0gKHZhbC5pIDwgMTAgPyAnMCcgOiAnJykgKyB2YWwuaTtcclxuICAgICAgICB2YWwucyA9ICh2YWwucyA8IDEwID8gJzAnIDogJycpICsgdmFsLnM7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGZvcm1hdCB0eXBlLicpO1xyXG4gICAgICB9XHJcbiAgICAgIHZhciBkYXRlID0gW10sXHJcbiAgICAgICAgc2VwcyA9ICQuZXh0ZW5kKFtdLCBmb3JtYXQuc2VwYXJhdG9ycyk7XHJcbiAgICAgIGZvciAodmFyIGkgPSAwLCBjbnQgPSBmb3JtYXQucGFydHMubGVuZ3RoOyBpIDwgY250OyBpKyspIHtcclxuICAgICAgICBpZiAoc2Vwcy5sZW5ndGgpIHtcclxuICAgICAgICAgIGRhdGUucHVzaChzZXBzLnNoaWZ0KCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBkYXRlLnB1c2godmFsW2Zvcm1hdC5wYXJ0c1tpXV0pO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChzZXBzLmxlbmd0aCkge1xyXG4gICAgICAgIGRhdGUucHVzaChzZXBzLnNoaWZ0KCkpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBkYXRlLmpvaW4oJycpO1xyXG4gICAgfSxcclxuICAgIGNvbnZlcnRWaWV3TW9kZTogIGZ1bmN0aW9uICh2aWV3TW9kZSkge1xyXG4gICAgICBzd2l0Y2ggKHZpZXdNb2RlKSB7XHJcbiAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgIGNhc2UgJ2RlY2FkZSc6XHJcbiAgICAgICAgICB2aWV3TW9kZSA9IDQ7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgY2FzZSAneWVhcic6XHJcbiAgICAgICAgICB2aWV3TW9kZSA9IDM7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgY2FzZSAnbW9udGgnOlxyXG4gICAgICAgICAgdmlld01vZGUgPSAyO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgIGNhc2UgJ2RheSc6XHJcbiAgICAgICAgICB2aWV3TW9kZSA9IDE7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICBjYXNlIDA6XHJcbiAgICAgICAgY2FzZSAnaG91cic6XHJcbiAgICAgICAgICB2aWV3TW9kZSA9IDA7XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHZpZXdNb2RlO1xyXG4gICAgfSxcclxuICAgIGhlYWRUZW1wbGF0ZTogJzx0aGVhZD4nICtcclxuICAgICAgICAgICAgICAgICc8dHI+JyArXHJcbiAgICAgICAgICAgICAgICAnPHRoIGNsYXNzPVwicHJldlwiPjxpIGNsYXNzPVwie2ljb25UeXBlfSB7bGVmdEFycm93fVwiLz48L3RoPicgK1xyXG4gICAgICAgICAgICAgICAgJzx0aCBjb2xzcGFuPVwiNVwiIGNsYXNzPVwic3dpdGNoXCI+PC90aD4nICtcclxuICAgICAgICAgICAgICAgICc8dGggY2xhc3M9XCJuZXh0XCI+PGkgY2xhc3M9XCJ7aWNvblR5cGV9IHtyaWdodEFycm93fVwiLz48L3RoPicgK1xyXG4gICAgICAgICAgICAgICAgJzwvdHI+JyArXHJcbiAgICAgICc8L3RoZWFkPicsXHJcbiAgICBoZWFkVGVtcGxhdGVWMzogJzx0aGVhZD4nICtcclxuICAgICAgICAgICAgICAgICc8dHI+JyArXHJcbiAgICAgICAgICAgICAgICAnPHRoIGNsYXNzPVwicHJldlwiPjxzcGFuIGNsYXNzPVwie2ljb25UeXBlfSB7bGVmdEFycm93fVwiPjwvc3Bhbj4gPC90aD4nICtcclxuICAgICAgICAgICAgICAgICc8dGggY29sc3Bhbj1cIjVcIiBjbGFzcz1cInN3aXRjaFwiPjwvdGg+JyArXHJcbiAgICAgICAgICAgICAgICAnPHRoIGNsYXNzPVwibmV4dFwiPjxzcGFuIGNsYXNzPVwie2ljb25UeXBlfSB7cmlnaHRBcnJvd31cIj48L3NwYW4+IDwvdGg+JyArXHJcbiAgICAgICAgICAgICAgICAnPC90cj4nICtcclxuICAgICAgJzwvdGhlYWQ+JyxcclxuICAgIGNvbnRUZW1wbGF0ZTogJzx0Ym9keT48dHI+PHRkIGNvbHNwYW49XCI3XCI+PC90ZD48L3RyPjwvdGJvZHk+JyxcclxuICAgIGZvb3RUZW1wbGF0ZTogJzx0Zm9vdD4nICsgXHJcbiAgICAgICAgICAgICAgICAgICAgJzx0cj48dGggY29sc3Bhbj1cIjdcIiBjbGFzcz1cInRvZGF5XCI+PC90aD48L3RyPicgK1xyXG4gICAgICAgICAgICAgICAgICAgICc8dHI+PHRoIGNvbHNwYW49XCI3XCIgY2xhc3M9XCJjbGVhclwiPjwvdGg+PC90cj4nICtcclxuICAgICAgICAgICAgICAgICAgJzwvdGZvb3Q+J1xyXG4gIH07XHJcbiAgRFBHbG9iYWwudGVtcGxhdGUgPSAnPGRpdiBjbGFzcz1cImRhdGV0aW1lcGlja2VyXCI+JyArXHJcbiAgICAnPGRpdiBjbGFzcz1cImRhdGV0aW1lcGlja2VyLW1pbnV0ZXNcIj4nICtcclxuICAgICc8dGFibGUgY2xhc3M9XCIgdGFibGUtY29uZGVuc2VkXCI+JyArXHJcbiAgICBEUEdsb2JhbC5oZWFkVGVtcGxhdGUgK1xyXG4gICAgRFBHbG9iYWwuY29udFRlbXBsYXRlICtcclxuICAgIERQR2xvYmFsLmZvb3RUZW1wbGF0ZSArXHJcbiAgICAnPC90YWJsZT4nICtcclxuICAgICc8L2Rpdj4nICtcclxuICAgICc8ZGl2IGNsYXNzPVwiZGF0ZXRpbWVwaWNrZXItaG91cnNcIj4nICtcclxuICAgICc8dGFibGUgY2xhc3M9XCIgdGFibGUtY29uZGVuc2VkXCI+JyArXHJcbiAgICBEUEdsb2JhbC5oZWFkVGVtcGxhdGUgK1xyXG4gICAgRFBHbG9iYWwuY29udFRlbXBsYXRlICtcclxuICAgIERQR2xvYmFsLmZvb3RUZW1wbGF0ZSArXHJcbiAgICAnPC90YWJsZT4nICtcclxuICAgICc8L2Rpdj4nICtcclxuICAgICc8ZGl2IGNsYXNzPVwiZGF0ZXRpbWVwaWNrZXItZGF5c1wiPicgK1xyXG4gICAgJzx0YWJsZSBjbGFzcz1cIiB0YWJsZS1jb25kZW5zZWRcIj4nICtcclxuICAgIERQR2xvYmFsLmhlYWRUZW1wbGF0ZSArXHJcbiAgICAnPHRib2R5PjwvdGJvZHk+JyArXHJcbiAgICBEUEdsb2JhbC5mb290VGVtcGxhdGUgK1xyXG4gICAgJzwvdGFibGU+JyArXHJcbiAgICAnPC9kaXY+JyArXHJcbiAgICAnPGRpdiBjbGFzcz1cImRhdGV0aW1lcGlja2VyLW1vbnRoc1wiPicgK1xyXG4gICAgJzx0YWJsZSBjbGFzcz1cInRhYmxlLWNvbmRlbnNlZFwiPicgK1xyXG4gICAgRFBHbG9iYWwuaGVhZFRlbXBsYXRlICtcclxuICAgIERQR2xvYmFsLmNvbnRUZW1wbGF0ZSArXHJcbiAgICBEUEdsb2JhbC5mb290VGVtcGxhdGUgK1xyXG4gICAgJzwvdGFibGU+JyArXHJcbiAgICAnPC9kaXY+JyArXHJcbiAgICAnPGRpdiBjbGFzcz1cImRhdGV0aW1lcGlja2VyLXllYXJzXCI+JyArXHJcbiAgICAnPHRhYmxlIGNsYXNzPVwidGFibGUtY29uZGVuc2VkXCI+JyArXHJcbiAgICBEUEdsb2JhbC5oZWFkVGVtcGxhdGUgK1xyXG4gICAgRFBHbG9iYWwuY29udFRlbXBsYXRlICtcclxuICAgIERQR2xvYmFsLmZvb3RUZW1wbGF0ZSArXHJcbiAgICAnPC90YWJsZT4nICtcclxuICAgICc8L2Rpdj4nICtcclxuICAgICc8L2Rpdj4nO1xyXG4gIERQR2xvYmFsLnRlbXBsYXRlVjMgPSAnPGRpdiBjbGFzcz1cImRhdGV0aW1lcGlja2VyXCI+JyArXHJcbiAgICAnPGRpdiBjbGFzcz1cImRhdGV0aW1lcGlja2VyLW1pbnV0ZXNcIj4nICtcclxuICAgICc8dGFibGUgY2xhc3M9XCIgdGFibGUtY29uZGVuc2VkXCI+JyArXHJcbiAgICBEUEdsb2JhbC5oZWFkVGVtcGxhdGVWMyArXHJcbiAgICBEUEdsb2JhbC5jb250VGVtcGxhdGUgK1xyXG4gICAgRFBHbG9iYWwuZm9vdFRlbXBsYXRlICtcclxuICAgICc8L3RhYmxlPicgK1xyXG4gICAgJzwvZGl2PicgK1xyXG4gICAgJzxkaXYgY2xhc3M9XCJkYXRldGltZXBpY2tlci1ob3Vyc1wiPicgK1xyXG4gICAgJzx0YWJsZSBjbGFzcz1cIiB0YWJsZS1jb25kZW5zZWRcIj4nICtcclxuICAgIERQR2xvYmFsLmhlYWRUZW1wbGF0ZVYzICtcclxuICAgIERQR2xvYmFsLmNvbnRUZW1wbGF0ZSArXHJcbiAgICBEUEdsb2JhbC5mb290VGVtcGxhdGUgK1xyXG4gICAgJzwvdGFibGU+JyArXHJcbiAgICAnPC9kaXY+JyArXHJcbiAgICAnPGRpdiBjbGFzcz1cImRhdGV0aW1lcGlja2VyLWRheXNcIj4nICtcclxuICAgICc8dGFibGUgY2xhc3M9XCIgdGFibGUtY29uZGVuc2VkXCI+JyArXHJcbiAgICBEUEdsb2JhbC5oZWFkVGVtcGxhdGVWMyArXHJcbiAgICAnPHRib2R5PjwvdGJvZHk+JyArXHJcbiAgICBEUEdsb2JhbC5mb290VGVtcGxhdGUgK1xyXG4gICAgJzwvdGFibGU+JyArXHJcbiAgICAnPC9kaXY+JyArXHJcbiAgICAnPGRpdiBjbGFzcz1cImRhdGV0aW1lcGlja2VyLW1vbnRoc1wiPicgK1xyXG4gICAgJzx0YWJsZSBjbGFzcz1cInRhYmxlLWNvbmRlbnNlZFwiPicgK1xyXG4gICAgRFBHbG9iYWwuaGVhZFRlbXBsYXRlVjMgK1xyXG4gICAgRFBHbG9iYWwuY29udFRlbXBsYXRlICtcclxuICAgIERQR2xvYmFsLmZvb3RUZW1wbGF0ZSArXHJcbiAgICAnPC90YWJsZT4nICtcclxuICAgICc8L2Rpdj4nICtcclxuICAgICc8ZGl2IGNsYXNzPVwiZGF0ZXRpbWVwaWNrZXIteWVhcnNcIj4nICtcclxuICAgICc8dGFibGUgY2xhc3M9XCJ0YWJsZS1jb25kZW5zZWRcIj4nICtcclxuICAgIERQR2xvYmFsLmhlYWRUZW1wbGF0ZVYzICtcclxuICAgIERQR2xvYmFsLmNvbnRUZW1wbGF0ZSArXHJcbiAgICBEUEdsb2JhbC5mb290VGVtcGxhdGUgK1xyXG4gICAgJzwvdGFibGU+JyArXHJcbiAgICAnPC9kaXY+JyArXHJcbiAgICAnPC9kaXY+JztcclxuICAkLmZuLmRhdGV0aW1lcGlja2VyLkRQR2xvYmFsID0gRFBHbG9iYWw7XHJcblxyXG4gIC8qIERBVEVUSU1FUElDS0VSIE5PIENPTkZMSUNUXHJcbiAgICogPT09PT09PT09PT09PT09PT09PSAqL1xyXG5cclxuICAkLmZuLmRhdGV0aW1lcGlja2VyLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAkLmZuLmRhdGV0aW1lcGlja2VyID0gb2xkO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfTtcclxuXHJcbiAgLyogREFURVRJTUVQSUNLRVIgREFUQS1BUElcclxuICAgKiA9PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcbiAgJChkb2N1bWVudCkub24oXHJcbiAgICAnZm9jdXMuZGF0ZXRpbWVwaWNrZXIuZGF0YS1hcGkgY2xpY2suZGF0ZXRpbWVwaWNrZXIuZGF0YS1hcGknLFxyXG4gICAgJ1tkYXRhLXByb3ZpZGU9XCJkYXRldGltZXBpY2tlclwiXScsXHJcbiAgICBmdW5jdGlvbiAoZSkge1xyXG4gICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xyXG4gICAgICBpZiAoJHRoaXMuZGF0YSgnZGF0ZXRpbWVwaWNrZXInKSkgcmV0dXJuO1xyXG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIC8vIGNvbXBvbmVudCBjbGljayByZXF1aXJlcyB1cyB0byBleHBsaWNpdGx5IHNob3cgaXRcclxuICAgICAgJHRoaXMuZGF0ZXRpbWVwaWNrZXIoJ3Nob3cnKTtcclxuICAgIH1cclxuICApO1xyXG4gICQoZnVuY3Rpb24gKCkge1xyXG4gICAgJCgnW2RhdGEtcHJvdmlkZT1cImRhdGV0aW1lcGlja2VyLWlubGluZVwiXScpLmRhdGV0aW1lcGlja2VyKCk7XHJcbiAgfSk7XHJcblxyXG59KSk7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2Jvb3RzdHJhcC1kYXRldGltZS1waWNrZXIvanMvYm9vdHN0cmFwLWRhdGV0aW1lcGlja2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9ib290c3RyYXAtZGF0ZXRpbWUtcGlja2VyL2pzL2Jvb3RzdHJhcC1kYXRldGltZXBpY2tlci5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJsZXQgYXBwID0gcmVxdWlyZSgnLi9hcHAuanMnKTtcclxucmVxdWlyZSgnYm9vdHN0cmFwLWRhdGV0aW1lLXBpY2tlcicpO1xyXG5cclxuZnVuY3Rpb24gZ21hcHNJbml0KGdvb2dsZSkge1xyXG4gICAgdmFyIG1hcDtcclxuXHJcbiAgICB0aGlzLm9wZW5Cb29raW5nRm9ybSA9IGZ1bmN0aW9uKGhvdGVsRGF0YSkge1xyXG4gICAgICAgICQoJyNib29raW5nX2hvdGVsSWQnKS52YWwoaG90ZWxEYXRhLmlkKTtcclxuICAgICAgICAkKCcjaG90ZWwtZWRpdCcpLmF0dHIoXHJcbiAgICAgICAgICAgICdocmVmJyxcclxuICAgICAgICAgICAgJCgnI2hvdGVsLWVkaXQnKS5kYXRhKCdwYXRoJykucmVwbGFjZSgnXycsIGhvdGVsRGF0YS5pZClcclxuICAgICAgICApO1xyXG4gICAgICAgICQoJyNib29raW5nLW1vZGFsJykubW9kYWwoJ3Nob3cnKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5hZGRNYXJrZXIgPSBmdW5jdGlvbihob3RlbERhdGEpIHtcclxuICAgICAgICBsZXQgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiBob3RlbERhdGEuY29vcmRzLFxyXG4gICAgICAgICAgICBhbmltYXRpb246IGdvb2dsZS5tYXBzLkFuaW1hdGlvbi5EUk9QLFxyXG4gICAgICAgICAgICBtYXA6IG1hcCxcclxuICAgICAgICAgICAgdGl0bGU6IGhvdGVsRGF0YS5uYW1lLFxyXG4gICAgICAgICAgICBtZXRhZGF0YToge1xyXG4gICAgICAgICAgICAgICAgaWQ6IGhvdGVsRGF0YS5pZFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBzZWxlY3RvciA9ICcjaG90ZWwtbGlzdCAubGlzdC1ncm91cC1pdGVtW2RhdGEtaWQ9JyArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhvdGVsRGF0YS5pZCArICddJztcclxuXHJcbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnbW91c2VvdmVyJyxcclxuICAgICAgICAgICAgKCkgPT4gJChzZWxlY3RvcikuYWRkQ2xhc3MoJ2hpZ2hsaWdodCcpXHJcbiAgICAgICAgKTtcclxuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdtb3VzZW91dCcsXHJcbiAgICAgICAgICAgICgpID0+ICQoc2VsZWN0b3IpLnJlbW92ZUNsYXNzKCdoaWdobGlnaHQnKVxyXG4gICAgICAgICk7XHJcbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLFxyXG4gICAgICAgICAgICAoKSA9PiBvcGVuQm9va2luZ0Zvcm0oaG90ZWxEYXRhKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgICQoc2VsZWN0b3IpLmhvdmVyKCgpID0+IG1hcC5zZXRDZW50ZXIobWFya2VyLmdldFBvc2l0aW9uKCkpKTtcclxuICAgICAgICAkKHNlbGVjdG9yKS5jbGljaygoKSA9PiBvcGVuQm9va2luZ0Zvcm0oaG90ZWxEYXRhKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMuaGFuZGxlQWxsTWFya2VycyA9IGZ1bmN0aW9uKCRwYXJlbnROb2RlKSB7XHJcbiAgICAgICAgJHBhcmVudE5vZGUuZWFjaChmdW5jdGlvbihpbmRleCwgbm9kZSkge1xyXG4gICAgICAgICAgICBjb25zdCBsYXQgPSAkKG5vZGUpLmRhdGEoJ2xhdGl0dWRlJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGxuZyA9ICQobm9kZSkuZGF0YSgnbG9uZ2l0dWRlJyk7XHJcblxyXG4gICAgICAgICAgICBpZihsYXQgIT0gbnVsbCAmJiBsbmcgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgYWRkTWFya2VyKHtcclxuICAgICAgICAgICAgICAgICAgICBjb29yZHM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGF0OiBsYXQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxuZzogbG5nLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogJCgnLm5hbWUnLCAkKG5vZGUpKS5odG1sKCkudHJpbSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIGlkOiAkKG5vZGUpLmRhdGEoJ2lkJyksXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmluaXRNYXAgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBsZXQgJG1hcE5vZGUgPSAkKCcjbWFwJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvb3JkcyA9IHtcclxuICAgICAgICAgICAgbGF0OiA0MCxcclxuICAgICAgICAgICAgbG5nOiAwXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcCgkbWFwTm9kZS5nZXQoMCksIHtcclxuICAgICAgICAgICAgem9vbTogMixcclxuICAgICAgICAgICAgY2VudGVyOiBjb29yZHNcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaGFuZGxlQWxsTWFya2VycygkKFwiI2hvdGVsLWxpc3QgLmxpc3QgbGlcIikpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLmluaXRNYXAoKTtcclxufVxyXG5cclxuJChmdW5jdGlvbigpIHtcclxuICAgIGFwcC5sb2FkR21hcHMoKS50aGVuKGZ1bmN0aW9uKGdvb2dsZU1hcHMpIHtcclxuICAgICAgICBnbWFwc0luaXQoe1xyXG4gICAgICAgICAgICBtYXBzOiBnb29nbGVNYXBzXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHRvZGF5ID0gbmV3IERhdGUoKTtcclxuICAgIGNvbnN0IGRheU1zID0gODY0MDAgKiAxMDAwO1xuXG4gICAgbGV0IGdldERhdGVUaW1lU2V0dGluZ3MgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuICAgICAgICBsZXQgJG5vZGUgPSAkKHNlbGVjdG9yKTtcblxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBtaW5WaWV3OiAnbW9udGgnLFxyXG4gICAgICAgICAgICBhdXRvY2xvc2U6IHRydWUsXHJcbiAgICAgICAgICAgIGZvcm1hdDogJ3l5eXktbW0tZGQnLFxyXG4gICAgICAgICAgICB3ZWVrU3RhcnQ6IDEsXHJcbiAgICAgICAgICAgIGluaXRpYWxEYXRlOiB0b2RheSxcclxuICAgICAgICAgICAgc3RhcnREYXRlOiB0b2RheSxcclxuICAgICAgICAgICAgZW5kRGF0ZTogbmV3IERhdGUodG9kYXkuZ2V0VGltZSgpICsgNjAgKiBkYXlNcyksXHJcbiAgICAgICAgICAgIHRvZGF5QnRuOiB0cnVlLFxyXG4gICAgICAgICAgICBjb250YWluZXI6ICQoJy5kYXRlJywgJG5vZGUpLnBhcmVudCgpLmF0dHIoJ2lkJyksXG4gICAgICAgIH1cclxuICAgIH07XG5cclxuICAgIGNvbnN0IGRhdGVGaWVsZHMgPSB7XHJcbiAgICAgICAgJyNib29raW5nX2RhdGVJbic6IFsnI2Jvb2tpbmdfZGF0ZU91dCcsICdzZXRTdGFydERhdGUnXSxcclxuICAgICAgICAnI2Jvb2tpbmdfZGF0ZU91dCc6IFsnI2Jvb2tpbmdfZGF0ZUluJywgJ3NldEVuZERhdGUnXSxcclxuICAgIH07XHJcblxyXG4gICAgZm9yKGxldCBjdXJTZWxlY3RvciBpbiBkYXRlRmllbGRzKSB7XHJcbiAgICAgICAgdmFyIFthbm90aGVyU2VsZWN0b3IsIG1ldGhvZE5hbWVdID0gZGF0ZUZpZWxkc1tjdXJTZWxlY3Rvcl07XHJcbiAgICAgICAgJChjdXJTZWxlY3RvcilcclxuICAgICAgICAuZGF0ZXRpbWVwaWNrZXIoZ2V0RGF0ZVRpbWVTZXR0aW5ncyhjdXJTZWxlY3RvcikpXHJcbiAgICAgICAgLm9uKCdjaGFuZ2VEYXRlJywgZnVuY3Rpb24oZXYpIHtcclxuICAgICAgICAgICAgJChhbm90aGVyU2VsZWN0b3IpLmRhdGV0aW1lcGlja2VyKG1ldGhvZE5hbWUsIGV2LmRhdGUpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBvcHRpb25zID0ge1xyXG4gICAgICAgIHZhbHVlTmFtZXM6IFtcclxuICAgICAgICAgICAgeyBkYXRhOiBbJ2lkJywgJ2xhdGl0dWRlJywgJ2xvbmdpdHVkZSddIH0sXHJcbiAgICAgICAgICAgICduYW1lJyxcclxuICAgICAgICAgICAgJ3ByaWNlJyxcclxuICAgICAgICAgICAgJ2FkZHJlc3MnLFxyXG4gICAgICAgIF0sXHJcbiAgICB9O1xyXG5cclxuICAgIHZhciBob3RlbExpc3QgPSBuZXcgTGlzdCgnaG90ZWwtbGlzdCcsIG9wdGlvbnMpO1xyXG59KTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vd2ViL2Fzc2V0cy9qcy9ob3RlbHNfbGlzdC5qcyJdLCJzb3VyY2VSb290IjoiIn0=