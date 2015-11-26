'use strict';
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var Turno = require('../turno/turno.model');
var User = require('../user/user.model');
var schemaOptions = {
  toJSON: {
    virtuals: true
  },
  id: false,
  collection: 'actividades'
};

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
   }
}


module.exports = mongoose.model('Actividad', ActividadSchema);
