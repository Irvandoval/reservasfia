'use strict';

angular.module('reservasApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('usuario', {
        url: '/usuario',
        templateUrl: 'app/usuario/usuario.html',
        controller: 'UsuarioCtrl'
      });
  });