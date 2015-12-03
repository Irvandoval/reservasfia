'use strict';

describe('Service: clase', function () {

  // load the service's module
  beforeEach(module('reservasApp'));

  // instantiate service
  var clase;
  beforeEach(inject(function (_clase_) {
    clase = _clase_;
  }));

  it('should do something', function () {
    expect(!!clase).toBe(true);
  });

});
