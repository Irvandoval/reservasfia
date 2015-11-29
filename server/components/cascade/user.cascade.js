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
         if (err) {return next(err)}
         if(!user){ return res.send(401);}
         if(user.role == 'docente'){
          Docente.findOne({
          usuario: req.params.id
        }, function(err, docente) {

            if (err) {return next(err)}
            if(docente){
              docente.remove();
             Actividad.find({
              creadoPor: req.params.id
            }, function(err, actividades) {
               if (err) {return next(err)}
               if(actividades){

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
             for (var i = 0; i < actividades.length; i++) {
              (function(it) {
                  actividad[it].remove();
              })(i)
             }
           }

            });

            }
              docente.remove();
        });


         }else{
           if(user.role == 'representante'){
            Representante.findOne({
            usuario: req.params.id
          }, function(err, representante) {
              if (err) {return next(err)}
              if(representante){

               Actividad.find({
                creadoPor: req.params.id
              }, function(err, actividades) {
                 if (err) {return next(err)}
                 if(actividades){

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
               for (var i = 0; i < actividades.length; i++) {
                (function(it) {
                    actividades[it].remove();
                })(i)
               }
             }

              });
               representante.remove();
              }

          });

           }
         }
         next();
      });
    });
}

exports.user = user;
