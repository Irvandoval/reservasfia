'use strict';

describe('Controller: DocenteCtrl', function () {

  // load the controller's module
  beforeEach(module('reservasApp'));

  var DocenteCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DocenteCtrl = $controller('DocenteCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
