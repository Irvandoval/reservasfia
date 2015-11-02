'use strict';

describe('Controller: ReservaCtrl', function () {

  // load the controller's module
  beforeEach(module('reservasApp'));

  var ReservaCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ReservaCtrl = $controller('ReservaCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
