'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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

module.exports = mongoose.model('Actividad', ActividadSchema);
