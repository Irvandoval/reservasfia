'use strict';

angular.module('reservasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('reserva-revisar-solicitud-escuela', {
        url: '/solicitudes-reservas-escuela',
        templateUrl: 'app/reserva/revisar_solicitud_escuela/revisar_solicitud_escuela.html',
        controller: 'RevisarSolicitudEscuelaCtrl',
        authenticate: true
      });
  });
