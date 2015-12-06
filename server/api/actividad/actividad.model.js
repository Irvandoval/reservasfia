'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Turno = require('../turno/turno.model');
var User = require('../user/user.model');
var Docente = require('../docente/docente.model');
var Representante  = require('../representante/representante.model');

var schemaOptions = {
  toJSON: {
    virtuals: true
  },
  id: false,
  collection: 'actividades'
};
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'reservasfia@gmail.com',
        pass: 'reserva$'
    }
});

var ActividadSchema = new Schema({
   nombre: {type:String, required:true},// Evaluacion I
   tipo: Number, // clase, evaluacion
   encargado: {type: Schema.Types.ObjectId, ref: 'Docente', required: true },
   materia: {type: Schema.Types.ObjectId, ref: 'Materia'},
   escuela: {type: Schema.Types.ObjectId, ref: 'Escuela'},
   estado: {type:String, required:true}, // aprobado, desaprobado o en espera
   //turnos: [{type: Schema.Types.ObjectId, ref: 'Turno'}],
   fechaCreacion: {type: Date,required: true},
   fechaAprobacion:{type:Date,required: false},
   creadoPor: {type: Schema.Types.ObjectId, ref: 'User', required: true },
   comentario: {type: String, required: false},
   ciclo: {type: Schema.Types.ObjectId, ref: 'Ciclo'},
}, schemaOptions);

ActividadSchema.methods = {
  crearTurnos : function(turnos,callback){
     var k = 0;
     (function crear(actividad){
      if(k < turnos.length){
         turnos[k].actividad = actividad._id;
         Turno.create(turnos[k],function(err,turno){
              if(err) { //si da error en crear turno
                   Turno.remove({actividad:this._id})

                  callback(err);// elimina todos los turnos creados hasta el momento
              }else{
               k++;
               crear(actividad);
              }
          });
      }else{
       callback(null);
      }
     }(this));
   }
}

ActividadSchema.statics.correoNuevaActividad =  function  correoNuevaActividad(actividad, html){
var correos = [];
  Representante.find({escuela: actividad.escuela}, function(err, representantes){
   if(!err && representantes){
    for(var i = 0; i< representantes.length; i++){
      if(representantes[i].correo){
       correos.push(representantes[i].correo)
      }
    }
   }
   Docente.findById(actividad.encargado, function(err, docente){
         if(!err && docente){
           if(docente.correo){
            correos.push(docente.correo);
           }
         }
    var mailOptions = {
             from: 'Reservas FIA-UES <reservasfia@gmail.com>', // sender address
             to: correos, // list of receivers
             subject: '¡' + actividad.nombre + ' ' + 'ha sido creado!',  // Subject line
             html: html
            };
            transporter.sendMail(mailOptions, function(error, info){
              if(error){console.log(error);}
            });
   });
  });

};

module.exports = mongoose.model('Actividad', ActividadSchema);
