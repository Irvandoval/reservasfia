/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`

'use strict';
var User = require('../api/user/user.model');
var Aula = require('../api/aula/aula.model');
var Escuela = require('../api/escuela/escuela.model');
var Actividad = require('../api/actividad/actividad.model');
var Materia = require('../api/materia/materia.model');
var Docente = require('../api/docente/docente.model');
var Ciclo = require('../api/ciclo/ciclo.model');
var Representante = require('../api/representante/representante.model');
var Horario = require('../api/horario/horario.model');
var Clase =  require('../api/clase/clase.model');
var Franja =  require('../api/franja/franja.model');

Clase.find({}).remove(function(){
Clase.create({
    "tipo" : "GT",
    "numero" : 1,
    "cupo" : 50,
    "franja1" : "565cd41cff75b7fe2a602d14",
    "franja2" : "565cd41cff75b7fe2a602d14",
    "dia1" : 1,
    "dia2" : 3,
    "aula" :  "55c2e6fbd9de2ffc4ae4af4a",
    "materia" : "56a95cfd2e4fb44c3342b172",
    "ciclo" : "56aadbc1a0ec109345fb946d",
    "docente" : "56a960022e4fb44c3342b177",
    "horario" : "56aacdd6eec797f53de1c29f"
},
{
    "tipo" : "GD",
    "numero" : 1,
    "cupo" : 50,
    "franja1" : "565cd41cff75b7fe2a602d14",
    "dia1" : 4,
    "aula" :  "55c2e6fbd9de2ffc4ae4af4c",
    "materia" : "56a95cfd2e4fb44c3342b172",
    "ciclo" : "56aadbc1a0ec109345fb946d",
    "docente" : "56a960022e4fb44c3342b177",
    "horario" : "56aacdd6eec797f53de1c29f"
},{
    "tipo" : "GT",
    "numero" : 1,
    "cupo" : 60,
    "franja1" : "565cd41cff75b7fe2a602d13",
    "franja2" : "565cd41cff75b7fe2a602d13",
    "dia1" : 1,
    "dia2" : 3,
    "aula" : "55c2e6fbd9de2ffc4ae4af49",
    "materia" : "56565d96d0a06ce437930383",
    "ciclo" : "56aadbc1a0ec109345fb946d",
    "docente" : "56a963ba2e4fb44c3342b17a",
    "horario" : "56aacdd6eec797f53de1c29f"
},
{
    "tipo" : "GT",
    "numero" : 2,
    "cupo" : 60,
    "franja1" : "565cd41cff75b7fe2a602d14",
    "franja2" : "565cd41cff75b7fe2a602d14",
    "dia1" : 1,
    "dia2" : 3,
    "aula" : "55c2e6fbd9de2ffc4ae4af4b",
    "materia" : "56565d96d0a06ce437930383",
    "ciclo" : "56aadbc1a0ec109345fb946d",
    "docente" : "56a963ba2e4fb44c3342b17a",
    "horario" : "56aacdd6eec797f53de1c29f"
},
{
    "tipo" : "GD",
    "numero" : 1,
    "cupo" : 60,
    "franja1" : "565cd41cff75b7fe2a602d13",
    "dia1" : 4,
    "aula" : "55c2e6fbd9de2ffc4ae4af49",
    "materia" : "56565d96d0a06ce437930383",
    "ciclo" : "56aadbc1a0ec109345fb946d",
    "docente" : "56a95eb22e4fb44c3342b175",
    "horario" : "56aacdd6eec797f53de1c29f"
},
{
    "tipo" : "GD",
    "numero" : 2,
    "cupo" : 60,
    "franja1" : "565cd41cff75b7fe2a602d14",
    "dia1" : 4,
    "aula" : "55c2e6fbd9de2ffc4ae4af51",
    "materia" : "56565d96d0a06ce437930383",
    "ciclo" : "56aadbc1a0ec109345fb946d",
    "docente" : "56a95eb22e4fb44c3342b175",
    "horario" : "56aacdd6eec797f53de1c29f"
}
)
});
*/
