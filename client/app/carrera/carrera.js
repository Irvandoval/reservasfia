'use strict';

angular.module('reservasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('carrera', {
        url: '/carrera',
        templateUrl: 'app/carrera/carrera.html',
        controller: 'CarreraCtrl',
	    authenticate: true
      });
  });
