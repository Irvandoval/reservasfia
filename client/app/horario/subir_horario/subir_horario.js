'use strict';

angular.module('reservasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('subir-horario', {
        url: '/horario/subir_horario',
        templateUrl: 'app/horario/subir_horario/subir_horario.html',
        controller: 'SubirHorarioCtrl'
      });
  });