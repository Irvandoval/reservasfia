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
   escuela: {type: Schema.Types.ObjectId, ref: 'Escuela'},
   estado: String, // aprobado, desaprobado o en espera
   //turnos: [{type: Schema.Types.ObjectId, ref: 'Turno'}],
   fechaCreacion: {type: Date},
   fechaAprobacion:{type:Date},
   creadoPor: {type: Schema.Types.ObjectId, ref: 'User' },
}, schemaOptions);

ActividadSchema.methods = {
  crearTurnos : function(turnos,callback){
   var k = 0;
  var abort= false;

    for(var i=0; i < turnos.length && !abort; i++){
      (function(it,actividad, abortar){
       turnos[it].actividad = actividad._id;
       Turno.create(turnos[it],function(err,turno){
        if(err) { }
       });
        if (k == turnos.length -1){
         callback();
        }
       k++;
      })(i,this, abort);
    }
  }
}


module.exports = mongoose.model('Actividad', ActividadSchema);
