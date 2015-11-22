'use strict';

describe('Controller: SubirHorarioManualCtrl', function () {

  // load the controller's module
  beforeEach(module('reservasApp'));

  var SubirHorarioManualCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SubirHorarioManualCtrl = $controller('SubirHorarioManualCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
