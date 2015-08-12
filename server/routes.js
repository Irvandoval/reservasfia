/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/turnos', require('./api/turno'));
  app.use('/api/actividades', require('./api/actividad'));
  app.use('/api/reservas', require('./api/reserva'));
  app.use('/api/clases', require('./api/clase'));
  app.use('/api/horarios', require('./api/horario'));
  app.use('/api/ciclos', require('./api/ciclo'));
  app.use('/api/docentes', require('./api/docente'));
  app.use('/api/pensums', require('./api/pensum'));
  app.use('/api/niveles', require('./api/nivel'));
  app.use('/api/materias', require('./api/materia'));
  app.use('/api/carreras', require('./api/carrera'));
  app.use('/api/escuelas', require('./api/escuela'));
  app.use('/api/aulas', require('./api/aula'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
 app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
    
};
