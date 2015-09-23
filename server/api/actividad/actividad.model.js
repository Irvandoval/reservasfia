'use strict';

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
   estado: String, // aprobado, desaprobado o en espera
   //turnos: [{type: Schema.Types.ObjectId, ref: 'Turno'}],
   fechaCreacion: {type: Date},
   creadoPor: {type: Schema.Types.ObjectId, ref: 'User' },
}, schemaOptions);

ActividadSchema.methods = {
  crearTurnos : function(turnos, callback){
   var k = 0;
    console.log("tur length " + turnos);
    for(var i=0; i < turnos.length; i++){

      (function(it,actividad){
       console.log("entra funcion " + k);
       turnos[it].actividad = actividad._id;
       Turno.create(turnos[it],function(err,turno){
       });
        if (k == turnos.length -1){
         callback();
        }
       k++;
      })(i,this);
    }
  }
}
module.exports = mongoose.model('Actividad', ActividadSchema);
