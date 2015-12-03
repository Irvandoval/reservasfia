'use strict';

angular.module('reservasApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User) {
         $scope.isAdmin = Auth.isAdmin;
         $scope.isDocente = Auth.isDocente;
         $scope.isRepresentante = Auth.isRepresentante;
         $scope.isInvitado = Auth.isInvitado;
    // Use the User $resource to fetch all users and admin
    $scope.users = User.query();

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };
  });
