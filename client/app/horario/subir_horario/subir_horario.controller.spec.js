'use strict';

describe('Controller: HorarioCtrl', function () {

  // load the controller's module
  beforeEach(module('reservasApp'));

  var HorarioCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HorarioCtrl = $controller('HorarioCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
