'use strict';

angular.module('reservasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('representante', {
        url: '/representante',
        templateUrl: 'app/representante/representante.html',
        controller: 'RepresentanteCtrl',
      });
  });
