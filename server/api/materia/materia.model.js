'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MateriaSchema = new Schema({
  codigo: { type: String, unique: true },// MAT115, FDE115
  nombre: String, // Matematica I , Fundamentos de Economia
  tipo: String, // obligatoria o electiva
  escuela: { type: Schema.Types.ObjectId, ref: 'Escuela' },
  carrera: { type: Schema.Types.ObjectId, ref: 'Carrera' },
  imparteEnCiclo: Number// 1: impar, 2: par, 3: par e impar
});

module.exports = mongoose.model('Materia', MateriaSchema);
