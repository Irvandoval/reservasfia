'use strict';
var compose = require('composable-middleware');
var Turno = require('../../api/turno/turno.model');
var Actividad = require('../../api/actividad/actividad.model');
var Reserva = require('../../api/reserva/reserva.model');
var User = require('../../api/user/user.model');

function actividad(){
 return compose()
 .use(function(req, res, next){
  Actividad.findById(req.params.id, function(err, actividad){
     if (err) {return handleError(res, err);}
     Reserva.find({actividad: actividad._id}).remove( function(){
        if (err) {return handleError(res, err);}
        Turno.find({actividad: actividad._id}).remove(function(){
             next();
        });
     });
  })
 });
}
exports.actividad = actividad;
