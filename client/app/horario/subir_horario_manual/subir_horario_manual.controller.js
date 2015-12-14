'use strict';

angular.module('reservasApp')
  .controller('SubirHorarioManualCtrl', function($scope, $rootScope, $location,ngTableParams,Actividad, $filter, $modal, toaster,Ciclo, Escuela, $resource, Clase, ClaseByHorario, Franja, Auth) {
    $scope.horarioActual = {};
    $scope.esAdmin = Auth.isAdmin;
    $scope.esRepresentante = Auth.isRepresentante;
    $scope.opcion = {};

   var Materia =  $resource('/api/materias/escuela/:escuelaId', {escuelaId: '@id'});

    if (Auth.isAdmin()) {
      Escuela.query(function(escuelas) {
        $scope.escuelas = escuelas;
      });
    }
    Ciclo.query(function(ciclos) {
      $scope.ciclos = ciclos;
    });

    Franja.query(function(franjas) {
      $rootScope.franjas = franjas
    });


    $scope.enviarHorarioAdmin =  function(){
     console.log($scope.horarioActual._id);
     console.log($rootScope.cicloActual._id);
      $resource('/api/horarios/enviar-aprobacion')
      .save({horario: $scope.horarioActual._id, ciclo: $rootScope.cicloActual._id},
       function(){
       $scope.horarioActual.estado = 'enviado_admin';
        $rootScope.tablaHorario.reload();
       toaster.pop('success', "Se ha enviado el horario al admin");
      }, function(err){
       console.log(err);
       toaster.pop('error', "Error al agregar grupo");
      })
    };

    $scope.ciclo = function() {
     if($scope.opcion.ciclo === ''){
          $scope.opcion.hayHorario = false;
     }else{
      if (Auth.isRepresentante()) {

        $resource('/api/representantes/user/:userId', {
            userId: '@id'
          })
          .get({
            userId: Auth.getCurrentUser()._id
          }, function(representante) {
            $scope.opcion.escuela = representante.escuela._id;
             Materia.query({escuelaId: $scope.opcion.escuela}, function(materias){
              $scope.materias = materias;
             });
            $resource('/api/horarios/ciclo/escuela')
              .get({
                ciclo: $scope.opcion.ciclo,
                escuela: $scope.opcion.escuela
              }, function(horario) {

                cargarTabla(horario);
                $scope.opcion.hayHorario = true;
              }, function(err) {
                console.error("entra al error horario");
                $scope.opcion.noHayHorario = true;
              });
          })
      }
     }


    };
    $scope.materiaGrupoNuevo =  function(){
     console.log($scope.opcion.materia);
     $resource('/api/clases/horario/nuevo')
     .save({
      tipo: 'GT',
      numero: 1,
      cupo: 50,
      dia1: 1,
      dia2: 3,
      franja1: '565cd41cff75b7fe2a602d13',
      franja2:'565cd41cff75b7fe2a602d13',
      aula: "55c2e6fbd9de2ffc4ae4af51",
      materia: $scope.opcion.materia,
      ciclo: $rootScope.cicloActual._id,
      horario: $scope.horarioActual._id
     }, function(){
      toaster.pop('success', "Grupo agregado", "Se ha agregado al horario la materia con un grupo de ejemplo");
      $rootScope.tablaHorario.reload();
     }, function(err){
       console.log(err);
       toaster.pop('error', "La materia ya esta agregada en el horario");
     })
    };

    $scope.nuevaClase = function(materia) {
      var modalInstance = $modal.open({
        animation: $scope.animationsEnabled,
        templateUrl: 'nueva-clase.html',
        controller: 'NuevaClaseCtrl',
        size: 'lg',
        resolve: {
          materia: function() {
            return materia;
          },
          ciclo: function(){ return $scope.opcion.ciclo},
          horario: function(){ return $scope.horarioActual},

        }
      });
    };

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
    };

   $scope.verMensaje  = function(clase){
    console.log(clase);
    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'comentario.html',
      controller: 'ComentarioCtrl',
      size: 'sm',
      resolve: {
        actividad: function() {
         return clase.actividad
        }
      }
    });
   }
    $scope.crearHorario = function() {
      $resource('/api/horarios/crear-horario/plantilla')
        .save({
          ciclo: $scope.opcion.ciclo,
          escuela: $scope.opcion.escuela
        }, function(horario) {
          console.log(horario);
          $scope.opcion.noHayHorario = false;
          $scope.opcion.hayHorario = true;
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


    function cargarTabla(horario) {
      $scope.horarioActual = horario;
      console.log(horario._id);
      $rootScope.tablaHorario = new ngTableParams({
       sorting: {nmateria: 'asc'}
      }, {
        counts: [],
        groupBy: function(grupo) {
          return grupo.nmateria +'       (' + grupo.materia.codigo + ')';
        },
        getData: function($defer, params) {
          ClaseByHorario.query({
            horarioId: horario._id
          }, function(clases) {
           var clasesor =  agregarNombreMateria(clases);
            $defer.resolve($filter('orderBy')(clasesor, params.orderBy()));
            $defer.resolve(clasesor);
          })
        }
      });
    };

    function agregarNombreMateria(clases){
      for(var a = 0; a < clases.length; a++){
       clases[a].nmateria = clases[a].materia.nombre;
     }
     return clases;
    };

    $rootScope.cargarAulas = function(query) {
      var res = $resource('/api/aulas/nombre/' + query);
      return res.query().$promise
    };
  })
  .controller('NuevaClaseCtrl', function($scope, $rootScope, $resource, materia, ciclo, horario, Clase, $modalInstance,Aula, toaster) {
    $scope.materia = materia;
    $scope.horarioActual = horario;
    $scope.arrayAulas = [];
    Aula.query(function(aulas){
     $scope.aulas =  aulas;
    })
    $scope.clase = {};
    $resource('/api/docentes/materia/:materiaId', {
        materiaId: '@id'
      })
      .query({
        materiaId: materia._id
      }, function(docentes) {
        $scope.docentes = docentes;
      });


      $scope.enviarClaseDirecto = function(form){
       console.log("entra bb");
       $scope.submitted = true;

       if(form.$valid){
            console.log("entra cc");
       // $scope.clase.materia =  materia._id;
     //   $scope.clase.horario =  horario;
       // $scope.clase.aula = $scope.arrayAulas[0]._id;
       // $scope.clase.ciclo =  ciclo;
        Clase.save({
         tipo: $scope.clase.tipo,
         numero: $scope.clase.numero,
         cupo: $scope.clase.cupo,
         dia1: $scope.clase.dia1,
         dia2: $scope.clase.dia2,
         franja1: $scope.clase.franja1,
         franja2: $scope.clase.franja2,
         aula: $scope.clase.aula,
         materia: materia._id,
         docente: $scope.clase.docente,
         ciclo: $rootScope.cicloActual._id,
         horario: horario._id

        }, function(clase) {
         console.log($rootScope.cicloActual._id);
          toaster.pop('success', "Grupo enviado");
          $rootScope.tablaHorario.reload();
          $modalInstance.dismiss('cancel');
         $resource('/api/clases/crearActividad/:claseId', {claseId: '@id'})
         .save({claseId: clase._id},{ciclo: $rootScope.cicloActual._id}, function(res){
          console.log("mm");
          console.log(res);
         }, function(err){
          toaster.pop('error', "Error al agregar grupo");
         })
        }, function(err) {

         $scope.errors={}
         //update validity of form fields that match the mongoose errors
         angular.forEach(err.data.errors, function(error, field){
          //   form[field].setValidity('mongoose', false);
             $scope.errors[field]= error.message;
       });
          toaster.pop('error', "Numero de grupo ya existe");
        });
      }
    };
    $scope.enviarClase = function(form) {
      $scope.submitted = true;

      if(form.$valid){
      // $scope.clase.materia =  materia._id;
    //   $scope.clase.horario =  horario;
      // $scope.clase.aula = $scope.arrayAulas[0]._id;
      // $scope.clase.ciclo =  ciclo;
       Clase.save({
        tipo: $scope.clase.tipo,
        numero: $scope.clase.numero,
        cupo: $scope.clase.cupo,
        dia1: $scope.clase.dia1,
        dia2: $scope.clase.dia2,
        franja1: $scope.clase.franja1,
        franja2: $scope.clase.franja2,
        aula: $scope.clase.aula,
        materia: materia._id,
        docente: $scope.clase.docente,
        ciclo: $rootScope.cicloActual._id,
        horario: horario._id

       }, function(clase) {
         toaster.pop('success', "Grupo agregado");
         $rootScope.tablaHorario.reload();
         $modalInstance.dismiss('cancel');
       }, function(err) {

        $scope.errors={}
        //update validity of form fields that match the mongoose errors
        angular.forEach(err.data.errors, function(error, field){
         //   form[field].setValidity('mongoose', false);
            $scope.errors[field]= error.message;
      });
         toaster.pop('error', "Error al agregar grupo");
       });
     }
    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

  })


  .controller('EditarClaseCtrl', function($scope, $rootScope, $resource, $modalInstance, toaster,Aula, clase, Clase, Franja, Actividad) {

   Aula.query(function(aulas){
    $scope.aulas =  aulas;
   });
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


    });
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

    $scope.actualizar = function() {
      $scope.clasesx.materia = $scope.clasesx.materia._id;
      $scope.clasesx.docente = $scope.clasesx.docente._id;
      $scope.clasesx.aula = $scope.clasesx.aula._id;
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
    };

  $scope.enviarRechazado =  function(form){
   $scope.submitted = true;
   if(form.$valid){
    $scope.clasesx.materia = $scope.clasesx.materia._id;
    $scope.clasesx.docente = $scope.clasesx.docente._id;
    $scope.clasesx.aula = $scope.clasesx.aula._id;
    $scope.clasesx.franja1 = $scope.clasesx.franja1._id;
    if ($scope.clasesx.franja2)
      $scope.clasesx.franja2 = $scope.clasesx.franja2._id;
    Clase.update({claseId: clase._id}, $scope.clasesx ,function(claseg){
     $resource('/api/clases/crearActividad/:claseId', {claseId: '@id'})
     .save({claseId: claseg._id},{ciclo: $rootScope.cicloActual._id}, function(res){
      $rootScope.tablaHorario.reload();
      $modalInstance.dismiss('cancel');
        toaster.pop('success', "Grupo enviado");
     }, function(err){

         toaster.pop('error', "Error al enviar grupo");
     })
    }, function(err){console.log(err);})
  }
  }
    /*$scope.cargarDocentes = function(query) {
      var res = $resource('/api/docentes/nombre/' + query+'?materia='+clase.materia._id);
      return res.query().$promise
    };*/
  })


  .controller('ComentarioCtrl', function($scope, $modalInstance, actividad, Actividad){
   Actividad.get({idActividad: actividad}, function(actividad){
     $scope.comentario =  actividad.comentario;
   })
   $scope.cancel = function() {
     $modalInstance.dismiss('cancel');
   };
  })
