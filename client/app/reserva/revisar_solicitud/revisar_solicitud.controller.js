'use strict';

angular.module('reservasApp')
  .controller('RevisarSolicitudCtrl', function($rootScope, $scope, $modal, $resource, NgTableParams, $filter, Actividad) {
    $rootScope.enEspera = new NgTableParams({
      page: 1, // paginacion, primera en mostrar
      count: 15, // cantidad de elementos a mostrar por pagina
      sorting: {
        fechaCreacion: 'asc'
      }
    }, {
      total: 0,
      getData: function($defer, params) {
        Actividad.query({
            idActividad: 'espera'
          }).$promise
          .then(function(actividadesProm) {
          var actividades = rellenarEscuela(actividadesProm);
            var orderedRecentActivity = params.filter() ?
              $filter('orderBy')(actividades, params.orderBy()) :
              actividades;
            params.total(orderedRecentActivity.length);
            $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          });
      }
    });

    $rootScope.aprobados = new NgTableParams({
      page: 1, // paginacion, primera en mostrar
      count: 15, // cantidad de elementos a mostrar por pagina
      sorting: {
        fechaCreacion: 'desc'
      }
    }, {
      total: 0,
      getData: function($defer, params) {
        Actividad.query({
            idActividad: 'aprobados'
          }).$promise
          .then(function(actividadesProm) {
            var actividades = rellenarEscuela(actividadesProm);
            var orderedRecentActivity = params.filter() ?
              $filter('orderBy')(actividades, params.orderBy()) :
              actividades;
            params.total(orderedRecentActivity.length);
            $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          });

      }
    });

    $rootScope.cancelados = new NgTableParams({
      page: 1, // paginacion, primera en mostrar
      count: 15, // cantidad de elementos a mostrar por pagina
      sorting: {
        fechaCreacion: 'desc'
      }
    }, {
      total: 0,
      getData: function($defer, params) {
        Actividad.query({
            idActividad: 'cancelados'
          }).$promise
          .then(function(actividadesProm) {
            var actividades = rellenarEscuela(actividadesProm);
            var orderedRecentActivity = params.filter() ?
              $filter('orderBy')(actividades, params.orderBy()) :
              actividades;
            params.total(orderedRecentActivity.length);
            $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          });
      }
    });

    $rootScope.enviadosAEscuela = new NgTableParams({
      page: 1, // paginacion, primera en mostrar
      count: 15, // cantidad de elementos a mostrar por pagina
      sorting: {
        fechaCreacion: 'desc'
      }
    }, {
      total: 0,
      getData: function($defer, params) {
        Actividad.query({
            idActividad: 'enviados_escuela_admin'
          }).$promise
          .then(function(actividades) {
            var orderedRecentActivity = params.filter() ?
              $filter('orderBy')(actividades, params.orderBy()) :
              actividades;
            params.total(orderedRecentActivity.length);
            $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          });

      }
    });


    $rootScope.desaprobados = new NgTableParams({
      page: 1, // paginacion, primera en mostrar
      count: 15, // cantidad de elementos a mostrar por pagina
      sorting: {
        fechaCreacion: 'asc'
      }
    }, {
      total: 0,
      getData: function($defer, params) {
        Actividad.query({
            idActividad: 'desaprobados'
          }).$promise
          .then(function(actividadesProm) {
            var actividades = rellenarEscuela(actividadesProm);
            var orderedRecentActivity = params.filter() ?
              $filter('orderBy')(actividades, params.orderBy()) :
              actividades;
            params.total(orderedRecentActivity.length);
            $defer.resolve(orderedRecentActivity.slice((params.page() - 1) * params.count(), params.page() * params.count()));
          });
      }
    });

    $scope.detalleReserva = function(idActividad, tipo) {
      $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'detalleReserva.html',
        controller: 'DetalleReservaCtrl',
        size: 'lg',
        resolve: {
          actividad: function() {
            return Actividad.get({
              idActividad: idActividad
            }).$promise;
          },
          tipo: function() {
            return tipo;
          }
        }
      });
    };

    function rellenarEscuela(actividades) {
      for (var i = 0; i < actividades.length; i++) {
        actividades[i].nescuela = actividades[i].escuela.nombre;
      }
      return actividades;
    }
  })

.controller('DetalleReservaCtrl', function($rootScope, $scope, $resource, $window, $location, $modalInstance, $modal, actividad, tipo, Actividad, Turno, toaster) {
    $scope.actividad = actividad;
    $scope.cancelar = false;
    $scope.mensaje = {};
    $scope.tipo = tipo;
    $scope.diferenciaMinutos = Math.round(((new Date() - new Date(actividad.fechaCreacion)) / 1000) / 60); // minutes
    console.log($scope.diferenciaMinutos);
    $scope.rechazarSolicitud = function() {
      $modalInstance.close(actividad);
      var actividadEditada = {};
      actividadEditada = nuevaActividad(actividad, 'desaprobado');
      actividadEditada.comentario = $scope.mensaje.descripcion;
      Actividad.update({
          idActividad: actividad._id
        }, actividadEditada).$promise
        .then(function() {
          $rootScope.enEspera.reload();
          $rootScope.aprobados.reload();
          $rootScope.desaprobados.reload();
          toaster.pop('success', 'Actividad rechazada', 'La actividad ahora se ha movido a "Rechazados"');
        }, function() {
          console.log('error');
        });

    };

    $scope.cancelarSolicitud = function() {
      console.log($scope.mensaje.descripcion);
      $modalInstance.close(actividad);
      var actividadEditada = {};
      actividadEditada = nuevaActividad(actividad, 'cancelado');
      actividadEditada.comentario = $scope.mensaje.descripcion;
      Actividad.update({
          idActividad: actividad._id
        }, actividadEditada).$promise
        .then(function() {
          $rootScope.enEspera.reload();
          $rootScope.aprobados.reload();
          $rootScope.desaprobados.reload();
          $rootScope.cancelados.reload();
          toaster.pop('success', 'Actividad cancelada', 'La actividad ahora se ha movido a "Cancelados"');
        }, function(err) {
          console.log('error');
          console.error(err);
        });

    };

    $scope.cancelacion = function() {
      $scope.cancelar = true;
    };

    $scope.aprobarSolicitudClase = function() {
      $modalInstance.close(actividad);
      var reservas = {};
      reservas.data = [];
      var turnos = [];
     // var actividadEditada = {};
      var cont = 0;
      for (var i = 0; i < $scope.turnos.length; i++) { // creamos los objetos reservas
        var turno = $scope.turnos[i];
        for (var j = 0; j < turno.aulas.length; j++) {
          var aula = turno.aulas[j];
          var nuevaReserva = {
            inicio: turno.inicio,
            fin: turno.fin,
            aula: aula._id,
            actividad: actividad._id
          };
          reservas.data[cont] = nuevaReserva;
          cont++;
        }
        turnos[i] = turno._id;

      }
      $resource('/api/reservas/choque/detectarChoqueForHorario')
        .save(reservas, function(respuesta) {
          if (respuesta.choque) {
            if (respuesta.actividad.escuela._id !== actividad.escuela._id) {
              var modalInstance = $modal.open({
                animation: $scope.animationsEnabled,
                templateUrl: 'confirmacion-choque.html',
                controller: 'ConfirmacionChoqueCtrl',
                size: 'lg',
                resolve: {
                  actividad: function() {
                    return respuesta.actividad;
                  }
                }
              });

              modalInstance.result.then(function(resp) {
                if (resp)
                  {enviarReservaClase(reservas, cont);}
              });

            } else {
              toaster.pop('error', 'Error', 'Se ha detectado choque');
            }


          } else {
            enviarReservaClase(reservas, cont);
          }

        });
    };
    $scope.aprobarSolicitud = function() {
      $modalInstance.close(actividad);
      var reservas = {};
      reservas.data = [];
      var turnos = [];
      var actividadEditada = {};
      var cont = 0;
      for (var i = 0; i < $scope.turnos.length; i++) { // creamos los objetos reservas
        var turno = $scope.turnos[i];
        for (var j = 0; j < turno.aulas.length; j++) {
          var aula = turno.aulas[j];
          var nuevaReserva = {
            inicio: turno.inicio,
            fin: turno.fin,
            aula: aula._id,
            actividad: actividad._id
          };
          reservas.data[cont] = nuevaReserva;
          cont++;
        }
        turnos[i] = turno._id;
        console.log(reservas);
      }
      $resource('/api/reservas/choque/detectarChoque').save(reservas).$promise // comprobamos que no haya choque
        .then(function() { // contexto que no detecto choque del array de objetos reserva
          //console.log(reservas);
          for (var i = 0; i < cont; i++) {
            $resource('/api/reservas').save(reservas.data[i]);
          }
          actividadEditada = nuevaActividad(actividad, 'aprobado');
          actividadEditada.fechaAprobacion = new Date();
          Actividad.update({
              idActividad: actividad._id
            }, actividadEditada).$promise
            .then(function() {
              // actividad.estado = 'aprobado';
              $rootScope.enEspera.reload();
              $rootScope.aprobados.reload();
              $rootScope.desaprobados.reload();
              //actualizarTurnos(actividadEditada,respuesta);
              toaster.pop('success', 'Actividad aprobada', 'Las reservas se han cargado en el sistema');
            }, function() {
              //error al actualizar
            });
        }, function() {
          console.log('ERROR');
          toaster.pop('error', 'Error', 'Se ha detectado choque');
        });
    };
    $resource('/api/turnos/actividad/:idActividad', {
        idActividad: '@id'
      })
      .query({
        idActividad: $scope.actividad._id
      }, function(turnos) {
        $scope.turnos = turnos;
      });

    $scope.eliminarSolicitud = function() {
      console.log('entra');
      var Actividad = $resource('/api/actividades/:actividadId', {
        actividadId: '@id'
      });
      Actividad.delete({
        actividadId: actividad._id
      }, function() {
        $rootScope.enEspera.reload();
        $rootScope.aprobados.reload();
        $rootScope.desaprobados.reload();
        $modalInstance.dismiss('cancel');
        toaster.pop('success', 'Actividad eliminada', 'La actividad se ha eliminado del sistema');
      }, function() {//error
      });
    };
    $scope.comprobante = function() {
      $location.path('/api/actividades/comprobante' + actividad._id);
    };
    $scope.ok = function() {
      $modalInstance.close();
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

    function enviarReservaClase(reservas, c) {
      var actividadEditada = {};
      for (var i = 0; i < c; i++) {
        $resource('/api/reservas').save(reservas.data[i]);
      }
      actividadEditada = nuevaActividad(actividad, 'aprobado');
      actividadEditada.fechaAprobacion = new Date();
      Actividad.update({
          idActividad: actividad._id
        }, actividadEditada).$promise
        .then(function() {
          // actividad.estado = 'aprobado';
          $rootScope.enEspera.reload();
          $rootScope.aprobados.reload();
          $rootScope.desaprobados.reload();
          //actualizarTurnos(actividadEditada,respuesta);
          toaster.pop('success', 'Actividad aprobada', 'Las reservas se han cargado en el sistema');
        }, function() {
          //error al actualizar
        });
    }

   /* function actualizarTurnos(actividad, respuesta) {
      var aulaAux = [];
      for (var g = 0; g < $scope.turnos.length; g++) {
        actividad.estado = respuesta;

        for (var s in $scope.turnos[g].aulas) {
          aulaAux[s] = $scope.turnos[g].aulas[s]._id;
        }
        var turnoActualizado = {
          inicio: $scope.turnos[g].inicio,
          fin: $scope.turnos[g].fin,
          actividad: actividad,
          aulas: aulaAux
        };
        Turno.update({
            idTurno: $scope.turnos[g]._id
          }, turnoActualizado, function() {
            console.log('exito al editar turno.....');
          },
          function(err) {
            console.log(err);
          }
        );

      }
    }*/

    function nuevaActividad(actividad, respuesta) {
      var actividadEdit = {};
      actividadEdit._id = actividad._id;
      actividadEdit.estado = respuesta;
      // actividadEdit.turnos = turnos;
      actividadEdit.tipo = actividad.tipo;
      actividadEdit.materia = actividad.materia._id;
      actividadEdit.nombre = actividad.nombre;
      actividadEdit.encargado = actividad.encargado._id;
      actividadEdit.creadoPor = actividad.creadoPor;
      actividadEdit.fechaCreacion = actividad.fechaCreacion;
      return actividadEdit;
    }


  })
  .controller('ConfirmacionChoqueCtrl', function($scope, actividad, $modalInstance) {
    $scope.actividad = actividad;

    $scope.aprobar = function() {
      $modalInstance.close(true);
    };
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  });
