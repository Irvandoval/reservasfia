'use strict';

angular.module('reservasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('reserva-revisar-solicitud', {
        url: '/solicitudes-reservas',
        templateUrl: 'app/reserva/revisar_solicitud/revisar_solicitud.html',
        controller: 'RevisarSolicitudCtrl'
      });
  });