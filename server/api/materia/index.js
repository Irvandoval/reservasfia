'use strict';

var express = require('express');
var controller = require('./materia.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', auth.isAuthenticated(), controller.show);
router.get('/nombre/:nombre', auth.isAuthenticated(), controller.regexNombre);
router.get('/escuela/:id', auth.isAuthenticated(), controller.indexByEscuela);
router.post('/', auth.hasRole('admin'), controller.create);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
