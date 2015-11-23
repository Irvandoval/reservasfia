'use strict';
var nodemailer = require('nodemailer');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Turno = require('../turno/turno.model');
var schemaOptions = {
  toJSON: {
    virtuals: true
  },
  id: false,
  collection: 'actividades'
};

var ActividadSchema = new Schema({
   nombre: String,// Evaluacion I
   tipo: Number, // clase, evaluacion
   encargado: String,
   materia: {type: Schema.Types.ObjectId, ref: 'Materia'},
   escuela: {type: Schema.Types.ObjectId, ref: 'Escuela'},
   estado: String, // aprobado, desaprobado o en espera
   //turnos: [{type: Schema.Types.ObjectId, ref: 'Turno'}],
   fechaCreacion: {type: Date},
   fechaAprobacion:{type:Date},
   creadoPor: {type: Schema.Types.ObjectId, ref: 'User' },
   comentario: {type: String, required: false}
}, schemaOptions);

ActividadSchema.methods = {
  crearTurnos : function(turnos,callback){
     var k = 0;
     (function crear(actividad){
      console.log(k);
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
   },
   enviarCorreo: function(){

   }
}


module.exports = mongoose.model('Actividad', ActividadSchema);
