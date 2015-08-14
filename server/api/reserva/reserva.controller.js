'use strict';

var _ = require('lodash');
var Reserva = require('./reserva.model');

//
exports.choque = function(req, res){
 var choque = true;  
 console.log(req.user);
  for(var prop in req.body){
     console.log("iteracion: " + prop);
     var nuevaReserva = new Reserva(req.body);
     nuevaReserva.detectarChoque(function(err,reser){
       if(!reser) choque = false;
       else{choque = true;}
    });
     if(choque == true){
       return handleError(res, 'se ha detectado choque en el '  + prop + 'º aula ingresado');
    }
  }
  if(choque == false)
  return res.status(200).json(req.body);
    
}
// Get list of reservas de un rango especifico de dias /api/reservas?inicio=aaaa-mm-dd&fin=aaaa-mm-dd
exports.index = function(req, res) {
  Reserva
  .find({$and:[{ inicio:{ $gte: new Date(req.query.inicio) } }, { fin:{ $lte: new Date(req.query.fin) } }]})
  .populate('aula')
  .populate('actividad')
  .exec(function (err, reservas) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(reservas);
  })
};


// Get a single reserva
exports.show = function(req, res) {
  Reserva.findById(req.params.id, function (err, reserva) {
    if(err) { return handleError(res, err); }
    if(!reserva) { return res.status(404).send('Not Found'); }
    return res.json(reserva);
  });
};

// Creates a new reserva in the DB.
exports.create = function(req, res) {
  var newReserva = new Reserva(req.body);
  newReserva.detectarChoque(function(err,reser){
   if(!reser){ //si no hay reserva no hay choque
     
     Reserva.create(req.body, function(err, reserva) {
       if(err) { return handleError(res, err); }
	  return res.status(201).json(reserva);
      });
   }else{
     console.log("miaer " + reser);
     return handleError(res,"Error: Se ha producido un choque");
   }
  });
  
  
};

// Updates an existing reserva in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Reserva.findById(req.params.id, function (err, reserva) {
    if (err) { return handleError(res, err); }
    if(!reserva) { return res.status(404).send('Not Found'); }
    var updated = _.merge(reserva, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(reserva);
    });
  });
};

// Deletes a reserva from the DB.
exports.destroy = function(req, res) {
  Reserva.findById(req.params.id, function (err, reserva) {
    if(err) { return handleError(res, err); }
    if(!reserva) { return res.status(404).send('Not Found'); }
    reserva.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}