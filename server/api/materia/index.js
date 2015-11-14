'use strict';

var express = require('express');
var controller = require('./materia.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.get('/nombre/:nombre', controller.regexNombre);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
