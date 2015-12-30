'use strict';

var express = require('express');
var controller = require('./actividad.controller');
var auth = require('../../auth/auth.service');
var comprobar = require('../../components/middleware/actividad.mw');
var envioCorreo = require('../../components/middleware/correo.mw');
var cascade = require('../../components/cascade/actividad.cascade');
var router = express.Router();

router.get('/', controller.prueba);
router.get('/aprobados', auth.isAuthenticated(), controller.indexAprobados);
router.get('/misaprobados', auth.isAuthenticated(), controller.indexMisAprobados);
router.get('/espera_escuela_b',auth.isAuthenticated(), controller.indexEsperaEscuelaB);
router.get('/desaprobados_escuela',auth.isAuthenticated(), controller.indexDesaprobadosByEscuela);
router.get('/aprobados_escuela',auth.isAuthenticated(), controller.indexByEscuela);
router.get('/cancelados_escuela', auth.isAuthenticated(), controller.indexCanceladosByEscuela);
router.get('/espera', auth.isAuthenticated(), controller.indexEspera);
router.get('/misespera', auth.isAuthenticated(),controller.indexMisEspera);
router.get('/desaprobados', controller.indexDesaprobados);
router.get('/misdesaprobados',auth.isAuthenticated(), controller.indexMisDesaprobados);
router.get('/miscancelados',auth.isAuthenticated(), controller.indexMisCancelados);
router.get('/enviados_escuela_admin', auth.hasRole('admin'), controller.indexToEscuelaAdmin);
router.get('/cancelados', auth.hasRole('admin'), controller.indexCancelados);
router.get('/:id', controller.show);
router.get('/comprobante/:id',controller.comprobante);
router.post('/', controller.create);
router.put('/:id', auth.isAuthenticated(), comprobar.actividadCancelada(), controller.update);
router.patch('/:id', auth.isAuthenticated(), comprobar.actividadCancelada(), controller.update);
router.delete('/:id', cascade.actividad(), controller.destroy);

module.exports = router;
