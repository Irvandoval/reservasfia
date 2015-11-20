'use strict';

angular.module('reservasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('representante', {
        url: '/representante',

        controller: 'RepresentanteCtrl',
        authenticate: true
      });
  });