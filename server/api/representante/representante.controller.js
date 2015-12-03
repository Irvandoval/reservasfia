'use strict';

var _ = require('lodash');
var Representante = require('./representante.model');

// Get list of representantes
exports.index = function(req, res) {
  Representante.find()
  .populate('escuela')
  .populate('usuario')
  .exec(function (err, representantes) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(representantes);
  });
};
exports.showByUser = function(req, res) {
  Representante.findOne({usuario: req.user._id })
  .populate('escuela')
  .populate('usuario')
  .exec(function (err, representantes) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(representantes);
  });
};
// Get a single representante
exports.show = function(req, res) {
  Representante.findById(req.params.id)
  .populate('escuela')
  .populate('usuario')
  .exec(function (err, representante) {
    if(err) { return handleError(res, err); }
    if(!representante) { return res.status(404).send('Not Found'); }
    return res.json(representante);
  });
};



// Creates a new representante in the DB.
exports.create = function(req, res) {
  Representante.create(req.body, function(err, representante) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(representante);
  });
};

// Updates an existing representante in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Representante.findById(req.params.id, function (err, representante) {
    if (err) { return handleError(res, err); }
    if(!representante) { return res.status(404).send('Not Found'); }
    var updated = _.merge(representante, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(representante);
    });
  });
};

// Deletes a representante from the DB.
exports.destroy = function(req, res) {
  Representante.findById(req.params.id, function (err, representante) {
    if(err) { return handleError(res, err); }
    if(!representante) { return res.status(404).send('Not Found'); }
    representante.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
