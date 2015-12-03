'use strict';

var _ = require('lodash');
var Horario = require('./horario.model');

var xlsx2json = require('xlsx-json');
var Clase =  require('../clase/clase.model');
var done =  true;

exports.xlstojson = function(req, res) {
    var task = [
    {
        "input":  req.file.path,
        "sheet":  "sheetName1",
        "output": null
    }
]
 xlsx2json(task, function(err, jsonArr) {
    if (err) {
        console.log(err);
        return res.json(404,err);
    }
    console.log(jsonArr);
    return res.json(200,jsonArr);
});

}

// Get list of horarios
exports.index = function(req, res) {
  Horario.find(function (err, horarios) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(horarios);
  });
};

// Get a single horario
exports.show = function(req, res) {
  Horario.findById(req.params.id, function (err, horario) {
    if(err) { return handleError(res, err); }
    if(!horario) { return res.status(404).send('Not Found'); }
    return res.json(horario);
  });
};

// Get a single horario
exports.showByCicloAndEscuela = function(req, res) {
 console.log("entra mmm");
  Horario.findOne({escuela: req.query.escuela, ciclo: req.query.ciclo, estado: {$ne: 'plantilla'}}, function (err, horario) {
    if(err) { return handleError(res, err); }
    if(!horario) { return res.status(404).send('Not Found'); }
    return res.json(horario);
  });

};

// Creates a new horario in the DB.
exports.create = function(req, res) {
  Horario.create(req.body, function(err, horario) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(horario);
  });
};

exports.createPlantilla =  function(req, res){
 req.body.estado = 'borrador';
 Horario.create (req.body, function(err, horario){
   if(err) { return handleError(res, err); }
   console.log("horario");
   console.log(horario);
   Horario.findOne({estado: 'plantilla', escuela: req.body.escuela}, function(err, plantilla){
         Clase.find({horario: plantilla._id}, function(err, clases){
             if(err) { return handleError(res, err); }
              for(var i = 0; i < clases.length ; i++){
                (function(it, hr){
                 Clase.create({
                   tipo: clases[it].tipo,
                   numero: clases[it].numero,
                   cupo: clases[it].cupo,
                   franja1: clases[it].franja1,
                   franja2: clases[it].franja2,
                   dia1: clases[it].dia1,
                   dia2: clases[it].dia2,
                   aula: clases[it].aula,
                   materia: clases[it].materia,
                   ciclo: req.body.ciclo,
                   docente: clases[it].docente,
                   horario: hr._id
                 }, function(err, clase){
                        if (err) console.log(err);
                 });
                })(i, horario)
              }
           return res.status(200).json(horario);
         });
   })
 })
}
// Updates an existing horario in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Horario.findById(req.params.id, function (err, horario) {
    if (err) { return handleError(res, err); }
    if(!horario) { return res.status(404).send('Not Found'); }
    var updated = _.merge(horario, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(horario);
    });
  });
};

// Deletes a horario from the DB.
exports.destroy = function(req, res) {
  Horario.findById(req.params.id, function (err, horario) {
    if(err) { return handleError(res, err); }
    if(!horario) { return res.status(404).send('Not Found'); }
    horario.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};



function handleError(res, err) {
  return res.status(500).send(err);
}
