'use strict';

angular.module('reservasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('docente', {
        url: '/docente',
        templateUrl: 'app/docente/docente.html',
        controller: 'DocenteCtrl'
      });
  });