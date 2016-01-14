'use strict';

angular.module('reservasApp')
  .controller('AdminCtrl', function ($scope, $http, Auth) {
         $scope.isAdmin = Auth.isAdmin;
         $scope.isDocente = Auth.isDocente;
         $scope.isRepresentante = Auth.isRepresentante;
         $scope.isInvitado = Auth.isInvitado;
  });
