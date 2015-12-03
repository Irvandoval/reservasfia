'use strict';

angular.module('reservasApp')
  .controller('SubirHorarioManualCtrl', function($scope, $rootScope, ngTableParams, $filter, $modal, Ciclo, Escuela, $resource, Clase, ClaseByHorario, Auth) {
    $scope.esAdmin = Auth.isAdmin;
    $scope.esRepresentante = Auth.isRepresentante;
    $scope.opcion = {};
    if (Auth.isAdmin()) {
      Escuela.query(function(escuelas) {
        $scope.escuelas = escuelas;
      });
    }
    Ciclo.query(function(ciclos) {
      $scope.ciclos = ciclos;
    });


 $scope.ciclo =  function(){
      if(Auth.isRepresentante()){
         $resource('/api/representantes/user/:userId', {userId: '@id'})
         .get({userId: Auth.getCurrentUser()._id}, function(representante){
           $scope.opcion.escuela = representante.escuela._id;
           $resource('/api/horarios/ciclo/escuela')
           .get({ciclo: $scope.opcion.ciclo, escuela: $scope.opcion.escuela}, function(horario){
              cargarTabla(horario);
              $scope.opcion.hayHorario =  true;
           }, function(err){
            console.error("entra al error horario");
            $scope.opcion.noHayHorario =  true;
           });
        })
      }
}

    $scope.editarClase = function(clase) {
      var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'editar-clase.html',
        controller: 'EditarClaseCtrl',
        size: 'lg',
        resolve: {
          clase: function() {
            return clase;
          }
        }
      });
    }

   $scope.crearHorario = function(){
    $resource('/api/horarios/crear-horario/plantilla')
    .save({ciclo: $scope.opcion.ciclo, escuela: $scope.opcion.escuela}, function(horario){
       console.log(horario);
       $scope.opcion.noHayHorario =  false;
       $scope.opcion.hayHorario =  true;
       cargarTabla(horario);
    })

   }
    $scope.eliminar = function(id) {
      Clase.delete({
        claseId: id
      }, function() {
        $rootScope.tablaHorario.reload();
        console.log('exito');
      }, function() {
        console.log('error');
      })
    }


    function cargarTabla(horario){
     $rootScope.tablaHorario = new ngTableParams({}, {
       counts: [],
       groupBy: function(grupo) {
         return grupo.materia.nombre + '       ( ' + grupo.materia.codigo + ' )';
       },
       getData: function($defer, params) {
         ClaseByHorario.query({
           horarioId: horario._id
         }, function(clases) {
           $defer.resolve($filter('orderBy')(clases, params.orderBy()));
           $defer.resolve(clases);
         })
       }
     });
    }
  })
  .controller('NuevaClaseCtrl', function($scope, $rootScope) {

  })
  .controller('EditarClaseCtrl', function($scope, $rootScope, $resource, $modalInstance, toaster, clase, Clase, Franja) {
    $scope.arrayAulas = [];

    $resource('/api/docentes/materia/:materiaId', {
        materiaId: '@id'
      })
      .query({
        materiaId: clase.materia._id
      }, function(docentes) {
        $scope.docentes = docentes;
      });
    Clase.get({
      claseId: clase._id
    }, function(clas) {
      $scope.clasesx = clas;
      $scope.arrayAulas.push($scope.clasesx.aula);

    });
    Franja.query(function(franjas) {
      $scope.franjas = franjas
    });
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

    $scope.actualizar = function() {
      $scope.clasesx.materia = $scope.clasesx.materia._id;
      $scope.clasesx.docente = $scope.clasesx.docente._id;
      $scope.clasesx.aula = $scope.arrayAulas[0]._id;
      $scope.clasesx.franja1 = $scope.clasesx.franja1._id;
      if ($scope.clasesx.franja2)
        $scope.clasesx.franja2 = $scope.clasesx.franja2._id;
      console.log($scope.clasesx);
      Clase.update({
        claseId: clase._id
      }, $scope.clasesx, function() {
        $rootScope.tablaHorario.reload();
        $modalInstance.dismiss('cancel');
        //toaster.pop('success', "Carrera ingresada", "La carrera se ha agregado al sistema");
      }, function(err) {
        toaster.pop('error', "Error", "Ha ocurrido un error al enviar. Por favor intente mas tarde");
      });
    }

    $scope.cargarAulas = function(query) {
      var res = $resource('/api/aulas/nombre/' + query);
      return res.query().$promise
    };
    /*$scope.cargarDocentes = function(query) {
      var res = $resource('/api/docentes/nombre/' + query+'?materia='+clase.materia._id);
      return res.query().$promise
    };*/
  })
