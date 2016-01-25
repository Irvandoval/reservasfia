'use strict';

var _ = require('lodash');
var Turno = require('./turno.model');

// Envia lista de turnos
exports.index = function(req, res) {
  Turno.find({})
  .populate('aulas')
  .populate('actividad')
  .exec(function(err, docs) {
    var options = {
      path: 'actividad.materia',
      model: 'Materia'
    }
    if (err) {
      return handleError(res, err);
    }
    Turno.populate(docs, options, function(err, turnos){
       if(err) return handleError(res, err);
       return res.status(200).json(turnos);
    });
  });

};

//Envia la lista de turnos por actividad
exports.indexByActividad = function(req,res){
 Turno.find({actividad: req.params.id})
 .populate('aulas')
 .populate('actividad')
 .sort({'inicio': 1})
 .exec(function(err, turnos) {
   if (err) {
     return handleError(res, err);
   }
   return res.status(200).json(turnos);
 });
}

// Envia la lista de turnos de actividades aprobadas
exports.indexAprobados = function(req, res){
 Turno.find({$and: [{
   inicio: {
     $gte: new Date(req.query.inicio)
   }
 }, {
   fin: {
     $lte: new Date(req.query.fin)
   }
 }]
})
  .populate('aulas')
  .populate({path: 'actividad', match: {estado: 'aprobado'}})
  .exec(function(err, docs) {
    var options = {
      path: 'actividad.materia',
      model: 'Materia'
    }
    if (err) {
      console.log(err);
      return handleError(res, err);
    }
    Turno.populate(docs, options, function(err, docs){
       if(err) return handleError(res, err);
       var opt  ={
        path: 'actividad.encargado',
        model: 'Docente'
       }
       Turno.populate(docs, opt,function(err, turnos){
           if(err) return handleError(res, err);
           var turn = Turno.eliminarValoresNull(turnos);
           return res.status(200).json(turn);
       });
    });
  });
}

//envia los turnos de actividades que estan en espera del administrador
exports.indexEnEspera = function(req, res){
 Turno.find({$and: [{
   inicio: {
     $gte: new Date(req.query.inicio)
   }
 }, {
   fin: {
     $lte: new Date(req.query.fin)
   }
 }]
})
 .populate('aulas')
 .populate({path: 'actividad', match: {estado: 'espera_admin'}})
 .exec(function(err, docs) {
   var options = {
     path: 'actividad.materia',
     model: 'Materia'
   }
   if (err) {
     return handleError(res, err);
   }
   Turno.populate(docs, options, function(err, docs){
      if(err) return handleError(res, err);
      var opt  ={
       path: 'actividad.encargado',
       model: 'Docente'
      }
      Turno.populate(docs, opt,function(err, turnos){
          if(err) return handleError(res, err);
          var turn = Turno.eliminarValoresNull(turnos);
          return res.status(200).json(turn);
      });
   });
 });
}

//Envia los turnos de actividades que estan en espera de la escuela
exports.indexEsperaEscuela = function(req, res) {
  var turn = [];
 Turno.find({$and: [{
   inicio: {
     $gte: new Date(req.query.inicio)
   }
 }, {
   fin: {
     $lte: new Date(req.query.fin)
   }
 }]
})
 .populate('aulas')
 .populate({path: 'actividad', match: {estado: 'espera_escuela'}})
 .exec(function(err, docs) {
   var options = {
     path: 'actividad.materia',
     model: 'Materia'
   }
   if (err) {
     return handleError(res, err);
   }
   Turno.populate(docs, options, function(err, docs){
      if(err) return handleError(res, err);
      var opt  ={
       path: 'actividad.encargado',
       model: 'Docente'
      }
      Turno.populate(docs, opt,function(err, turnos){
          if(err) return handleError(res, err);
          //var turn = Turno.eliminarValoresNull(turnos);
	  turn = turnos.filter(Turno.filtroValoresNull);     
          return res.status(200).json(turn);
      });
   });
 });
};

//Envia los turnos por aulas especificas
exports.indexByAula = function(req,res){
   if (!req.query._aulas)
    return res.status(404).send('No encontrado');
   Turno.find({$and: [{
     inicio: {
       $gte: new Date(req.query.inicio)
     }
   }, {
     fin: {
       $lte: new Date(req.query.fin)
     }
   }]
  })
  .populate({path: 'aulas', match: {nombre: {$in: req.query._aulas}}})
  .populate('actividad')
  .exec(function(err, docs) {
    var options = {
      path: 'actividad.materia',
      model: 'Materia'
    }
    if (err) {
      console.log(err);
      return handleError(res, err);
    }
    Turno.populate(docs, options, function(err, turnos){
       if(err) return handleError(res, err);
       var turn = Turno.eliminarValoresNull(turnos);
       return res.status(200).json(turn);
    });
  });

}
// Get a single turno
exports.show = function(req, res) {
  Turno.findById(req.params.id, function (err, turno) {
    if(err) { return handleError(res, err); }
    if(!turno) { return res.status(404).send('Not Found'); }
    return res.json(turno);
  });
};


// Creates a new turno in the DB.
exports.create = function(req, res) {
  Turno.create(req.body, function(err, turno) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(turno);
  });
};

// Updates an existing turno in the DB.
exports.update = function(req, res) {
  console.log(req.body);
 // if(req.body._id) { delete req.body._id; }
  Turno.findById(req.params.id, function (err, turno) {
    if (err) { return handleError(res, err); }
    if(!turno) { return res.status(404).send('Not Found'); }
    var updated = _.extend(turno, req.body);
    updated.actividad.estado = req.body.actividad.estado;
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(turno);
    });
  });
};

// Deletes a turno from the DB.
exports.destroy = function(req, res) {
  Turno.findById(req.params.id, function (err, turno) {
    if(err) { return handleError(res, err); }
    if(!turno) { return res.status(404).send('Not Found'); }
    turno.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
