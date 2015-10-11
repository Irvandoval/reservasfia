'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DocenteSchema = new Schema({
  nombre: { type: String, required: true },// Nombre del docente
  escuela: { type: Schema.Types.ObjectId, ref: 'Escuela', required: true}, //escuela a la que pertenece
  materias: [ {type: Schema.Types.ObjectId, ref: 'Materia', required: false} ],//materias que imparte
  usuario: {type: Schema.Types.ObjectId, ref: 'Usuario', required: false } // el usuario en el sistema
});

module.exports = mongoose.model('Docente', DocenteSchema);
