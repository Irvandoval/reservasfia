'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schemaOptions = {
  collection: 'niveles'
};

var NivelSchema = new Schema({
  nivel: Number, // nivel del 1-10
  pensum: {// pensum al que pertenece el nivel
    type: Schema.Types.ObjectId,
    ref: 'Pensum'
  },
  materia: {// materia que pertenece a un nivel
    type: Schema.Types.ObjectId,
    ref: 'Materia'
  }
});

module.exports = mongoose.model('Nivel', NivelSchema);
