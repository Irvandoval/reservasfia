'use strict';

angular.module('reservasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('calendarizacion', {
        url: '/calendarizacion',
        templateUrl: 'app/calendarizacion/calendarizacion.html',
        controller: 'CalendarizacionCtrl'
      });
  });