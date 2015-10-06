'use strict';

describe('Controller: UsuarioCtrl', function () {

  // load the controller's module
  beforeEach(module('reservasApp'));

  var UsuarioCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UsuarioCtrl = $controller('UsuarioCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
