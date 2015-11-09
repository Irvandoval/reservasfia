'use strict';

describe('Service: representante', function () {

  // load the service's module
  beforeEach(module('reservasApp'));

  // instantiate service
  var representante;
  beforeEach(inject(function (_representante_) {
    representante = _representante_;
  }));

  it('should do something', function () {
    expect(!!representante).toBe(true);
  });

});
