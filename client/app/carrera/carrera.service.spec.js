'use strict';

describe('Service: aula', function () {

  // load the service's module
  beforeEach(module('reservasApp'));

  // instantiate service
  var aula;
  beforeEach(inject(function (_aula_) {
    aula = _aula_;
  }));

  it('should do something', function () {
    expect(!!aula).toBe(true);
  });

});
