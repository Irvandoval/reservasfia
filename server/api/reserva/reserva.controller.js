'use strict';

var _ = require('lodash');
var Reserva = require('./reserva.model');

//detecta choque de horarios recibe un array de reservas en req.body.data
exports.choque = function(req, res) {
 var reservas = req.body.data; //
 var choque = false;
 console.log(reservas);
 var k = 0;
   for(var i = 0; i < reservas.length; i++){
     (function(iteracion){
        var nuevaReserva = new Reserva(reservas[iteracion]);
        nuevaReserva.detectarChoque(function(err,reserva){
         console.log(choque);
          if(reserva){
            choque = true;
          } // si existe reserva

          if(!reserva && choque == false) // si no existe reserva y la anterior iteracion no hubo choque
           choque  = false;
           if(k == reservas.length - 1){
              if (choque === true){
                 return handleError(res,'Se detecto un choque');
              }else{
                return res.status(200).json({exito: 'Exito'});
              }
           }
           k++;
       });
     })(i,choque);
   }
 }
  // Get list of reservas de un rango especifico de dias /api/reservas?inicio=aaaa-mm-dd&fin=aaaa-mm-dd
exports.index = function(req, res) {
  Reserva
    .find({
      $and: [{
        inicio: {
          $gte: new Date(req.query.inicio)
        }
      }, {
        fin: {
          $lte: new Date(req.query.fin)
        }
      }]
    })
    .populate('aula')
    .populate('actividad')
    .exec(function(err, reservas) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(reservas);
    });
};


// Get a single reserva
exports.show = function(req, res) {
  Reserva.findById(req.params.id, function(err, reserva) {
    if (err) {
      return handleError(res, err);
    }
    if (!reserva) {
      return res.status(404).send('Not Found');
    }
    return res.json(reserva);
  });
};

// Creates a new reserva in the DB.
exports.create = function(req, res) {
  var newReserva = new Reserva(req.body);
  newReserva.detectarChoque(function(err, reser) {
    if (!reser) { //si no hay reserva no hay choque

      Reserva.create(req.body, function(err, reserva) {
        if (err) {
          return handleError(res, err);
        }
        return res.status(201).json(reserva);
      });
    } else {
      return handleError(res, "Error: Se ha producido un choque");
    }
  });
};

// Updates an existing reserva in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Reserva.findById(req.params.id, function(err, reserva) {
    if (err) {
      return handleError(res, err);
    }
    if (!reserva) {
      return res.status(404).send('Not Found');
    }
    var updated = _.merge(reserva, req.body);
    updated.save(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(200).json(reserva);
    });
  });
};

// Deletes a reserva from the DB.
exports.destroy = function(req, res) {
  Reserva.findById(req.params.id, function(err, reserva) {
    if (err) {
      return handleError(res, err);
    }
    if (!reserva) {
      return res.status(404).send('Not Found');
    }
    reserva.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
