'use strict';

describe('Controller: MateriaCtrl', function () {

  // load the controller's module
  beforeEach(module('reservasApp'));

  var MateriaCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MateriaCtrl = $controller('MateriaCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
  });
});
