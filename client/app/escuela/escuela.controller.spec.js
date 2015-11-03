'use strict';

describe('Controller: EscuelaCtrl', function () {

  // load the controller's module
  beforeEach(module('reservasApp'));

  var EscuelaCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EscuelaCtrl = $controller('EscuelaCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
  });
});
