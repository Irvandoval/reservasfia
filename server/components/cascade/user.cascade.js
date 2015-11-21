'use strict';
var compose = require('composable-middleware');

var Docente = require('../../api/docente/docente.model');
var Turno = require('../../api/turno/turno.model');
var Representante = require('../../api/representante/representante.model');
var Actividad = require('../../api/actividad/actividad.model');
var Reserva = require('../../api/reserva/reserva.model');
var User = require('../../api/user/user.model');

function user() {
  return compose()
    .use(function(req, res, next) {
      User.findById(req.params.id, function(err, user) {
        if (user.role === 'docente') {
          Docente.find({
            usuario: req.params.id
          }, function(err, docente) {
            if (err) {
              return handleError(res, err);
            }
            Actividad.find({
              creadoPor: req.params.id
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
          }).remove(function() {
            next();
          });

        }else{
           if(user.role === 'representante'){
           Representante.find({
              usuario: req.params.id
            }, function(err, representante) {
              if (err) {
                return handleError(res, err);
              }
              Actividad.find({
                creadoPor: req.params.id
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
            }).remove(function() {
              next();
            });
           }else{
              next();
           }
        }


      });
    });
}

exports.user = user;
