'use strict';

describe('Service: Materia', function () {

  // load the service's module
  beforeEach(module('reservasApp'));

  // instantiate service
  var materia;
  beforeEach(inject(function (_materia_) {
    materia= _materia_;
  }));

  it('should do something', function () {
    expect(!!Materia).toBe(true);
  });

});
