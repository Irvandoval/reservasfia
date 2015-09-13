'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var schemaOptions = {
      toJSON: {
        virtuals: true
      },
      id: false
    };
var TurnoSchema = new Schema({
   inicio: Date,
   fin: Date,
   materia: String, // nombre de la materia que pertenece el turno
   actividad: {type: Schema.Types.ObjectId, ref: 'Actividad'},
   aulas: [{ type: Schema.Types.ObjectId, ref: 'Aula'}]
}, schemaOptions);

/**virtuales**/
TurnoSchema
.virtual('start')
.get(function(){
  return this.inicio;
});

TurnoSchema
.virtual('end')
.get(function(){
  return this.fin;
});

TurnoSchema
.virtual('title')
.get(function(){
 var aulasStr = ' ';
  for(var i = 0; i < this.aulas.length; i++){
   aulasStr = aulasStr + this.aulas[i].nombre + ' ';
  }
  return this.actividad.nombre + '\n' + this.materia+ '\n' + aulasStr;
});

/** metodos estaticos **/
TurnoSchema.statics.eliminarTurnoNull = function(turnos){
 var ret = [];
 for(var i = 0; i < turnos.length; i++ )
  if(turnos[i].actividad != null)
       ret.push(turnos[i]);
 return ret;
}
module.exports = mongoose.model('Turno', TurnoSchema);
