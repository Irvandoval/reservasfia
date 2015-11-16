'use strict';
var compose = require('composable-middleware');

var Docente = require('../../api/docente/docente.model');
var Turno = require('../../api/turno/turno.model');
var Representante = require('../../api/representante/representante.model');
var Actividad = require('../../api/actividad/actividad.model');
var Reserva = require('../../api/reserva/reserva.model');
var User = require('../../api/user/user.model');

function user() {
 console.log("entra user middle");
  var error = false;
  return compose()
    .use(function(req, res, next) {
        Docente.find({
          usuario: req.params.id
        }, function(err, docente) {
          if (err) {
            return handleError(res, err);
          }
          Actividad.find({
            $or: [{
              creadoPor: req.params.id
            }, {
              encargado: docente.nombre
            }]
          }, function(err, actividades) {
            if (err) {
              return handleError(res, err);
            }
            for (var i = 0; i < actividades.length; i++) {
              (function(it) {
                Reserva.find({
                  actividad: actividades[it]._id
                }).remove();
              })(i)
            }
             for (var i = 0; i < actividades.length; i++) {
            (function(it) {
              Turno.find({
                actividad: actividades[it]._id
              }).remove();
            })(i)
           }
            //en este punto eliminamos las reservas y los turnos creados de este usuario
          }).remove(); //eliminamos actividades
        }).remove(function(){
         next();
        }); //eliminamos docente

    });
}

exports.user = user;
