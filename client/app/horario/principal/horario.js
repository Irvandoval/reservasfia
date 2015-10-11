'use strict';

angular.module('reservasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('horario', {
        url: '/horario',
        templateUrl: 'app/horario/principal/horario.html',
        controller: 'HorarioCtrl'
      });
  });