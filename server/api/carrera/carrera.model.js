'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CarreraSchema = new Schema({
  codigo: {type:String, unique: true},
  nombre: String,
  plan: String,
  escuela: { type: Schema.Types.ObjectId, ref: 'Escuela' }
});

module.exports = mongoose.model('Carrera', CarreraSchema);
