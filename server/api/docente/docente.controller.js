'use strict';

var _ = require('lodash');
var Docente = require('./docente.model');

// Get list of docentes
exports.index = function(req, res) {
  Docente.find()
  .populate('materias')
  .populate('escuela')
  .populate('usuario')
  .exec(function (err, docentes) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(docentes);
  });
};
// Get list of docentes
exports.indexByMaterias = function(req, res) {
  Docente.find({materias:req.params.id})
  .populate('materias')
  .populate('escuela')
  .exec(function (err, docentes) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(docentes);
  });
};


// Get list of docentes search by regular Expression
exports.regexNombreByMateria = function(req, res) {
  var regex = new RegExp(req.params.nombre, "i");
  var query = { nombre: regex, materias: [req.query.materia] };
  Docente.find(query,function (err, aulas) {
    if(err) { return handleError(res, err); }
    return res.json(200, aulas);
  });
};

//get a single docente by user id
exports.byuser = function(req, res) {
  Docente
  .findOne({usuario: req.params.id})
  .populate('materias')
  .exec(function (err, docente) {
     if(err) { return handleError(res, err); }
     return res.status(200).json(docente);
   })
};
//get a single docente by escuela id
exports.byEscuela = function(req, res) {
  Docente
  .find({escuela: req.params.id})
  .populate('materias')
  .exec(function (err, docente) {
     if(err) { return handleError(res, err); }
     return res.status(200).json(docente);
   })
};
// Get a single docente
exports.show = function(req, res) {
  Docente
  .findById(req.params.id)
  .populate('materias')
  .exec(function (err, docente) {
    if(err) { return handleError(res, err); }
    if(!docente) { return res.status(404).send('Not Found'); }
    return res.json(docente);
  });
};

// Creates a new docente in the DB.
exports.create = function(req, res) {
  Docente.create(req.body, function(err, docente) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(docente);
  });
};

// Updates an existing docente in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Docente.findById(req.params.id, function (err, docente) {
    if (err) { return handleError(res, err); }
    if(!docente) { return res.status(404).send('Not Found'); }
    var updated = _.assign(docente, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(docente);
    });
  });
};

// Deletes a docente from the DB.
exports.destroy = function(req, res) {
  Docente.findById(req.params.id, function (err, docente) {
    if(err) { return handleError(res, err); }
    if(!docente) { return res.status(404).send('Not Found'); }
    docente.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
