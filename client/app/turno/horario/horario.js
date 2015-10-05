'use strict';

angular.module('reservasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('horario', {
        url: '/horario',
        templateUrl: 'app/horario/horario.html',
        controller: 'HorarioCtrl'
      });
  });