'use strict';

angular.module('reservasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('materia', {
        url: '/materia',
        templateUrl: 'app/materia/materia.html',
        controller: 'MateriaCtrl'
      });
  });
