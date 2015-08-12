'use strict';

angular.module('reservasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('reserva-mi-solicitud', {
        url: '/mis-solicitudes',
        templateUrl: 'app/reserva/mi_solicitud/reserva_mi_solicitud.html',
        controller: 'ReservaMiSolicitudCtrl'
      });
  });