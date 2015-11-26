'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MateriaSchema = new Schema({
  codigo: { type: String, unique: true, required:true },// MAT115, FDE115
  nombre: {type: String,required:true}, // Matematica I , Fundamentos de Economia
  tipo: {type: String, required:true}, // obligatoria o electiva
  escuela: { type: Schema.Types.ObjectId, ref: 'Escuela' },
 // carrera: { type: Schema.Types.ObjectId, ref: 'Carrera' },
 // nivel: Number,// nivel del pensum al que pertenece
  imparteEnCiclo: Number// 1: impar, 2: par, 3: par e impar
});

module.exports = mongoose.model('Materia', MateriaSchema);
