'use strict';

angular.module('reservasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('subir_horario_manual', {
        url: '/subir_horario_manual',
        templateUrl: 'app/horario/subir_horario_manual/subir_horario_manual.html',
        controller: 'SubirHorarioManualCtrl',
        authenticate: true
      });
  });
