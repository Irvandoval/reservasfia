'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var CarreraSchema = new Schema({
  codigo: {type:String, required: true, unique: true},
  nombre: {type:String, required: true, unique: true},
  plan: {type:String, required: true},
  escuela: { type: Schema.Types.ObjectId, ref: 'Escuela', required: true}
});

module.exports = mongoose.model('Carrera', CarreraSchema);
