'use strict';

var _ = require('lodash');
var Horario = require('./horario.model');

var xlsx2json = require('xlsx-json');

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

// Creates a new horario in the DB.
exports.create = function(req, res) {
  Horario.create(req.body, function(err, horario) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(horario);
  });
};

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