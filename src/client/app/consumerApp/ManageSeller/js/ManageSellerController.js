angular.module('oz.ProviderApp')
  .controller('ManageSellerController', ['$scope', '$state', '$http', '$timeout', '$sce', '$log', '$rootScope', 'ProviderServices','$upload','$stateParams', 'ManageSellerService', 'ManageBranchService', 'MyProviderList', 'ProviderCategoryList', 'OrderStatusList', 'checkIfSessionExist', function($scope, $state, $http, $timeout, $sce, $log, $rootScope,ProviderServices,$upload, $stateParams, ManageSellerService,ManageBranchService, MyProviderList, ProviderCategoryList, OrderStatusList, checkIfSessionExist) {
  
    $log.debug("initialising manage seller controller");
    $scope.submitted = false;
    $scope.$state = $state;
    $scope.addprovider = false;
    $scope.form = {};
    $scope.addseller = {cod: false, online:true};
    $scope.addSellerLogo = false;
    $scope.editseller = {};
    $scope.providers_list = [];
    $scope.providers_category_list = [];
    $scope.order_status_list = [];
    $scope.edit_order_status_list = [];
    $scope.sellercategory = {categoryid: '', categoryname: ''};
    var file;
    var fileUpdate;
    $scope.currentSellerIndex;
    $scope.process_configuration_error = '';

    $scope.$watch('$state.$current.locals.globals.checkIfSessionExist', function (checkIfSessionExist) {
      if (checkIfSessionExist.error) {
        $rootScope.showModal();
      };
    });

    $scope.$watch('$state.$current.locals.globals.MyProviderList', function (MyProviderList) {
      $log.debug(MyProviderList);
      if (MyProviderList.success !== undefined && MyProviderList.success.providers.length !== 0) {
        $scope.providers_list = angular.copy(MyProviderList.success.providers); 
        $rootScope.providers = [];
        if ($rootScope.providers.length == 0) {
          $rootScope.providers = angular.copy(MyProviderList.success.providers); 
          $rootScope.provider =  $rootScope.providers[0];
        }
        if (!$rootScope.selectedproviderid) {
          $rootScope.selectedproviderid = $scope.providers_list[0].providerid;
        } 
      } else {
        $scope.providers_list = [];
        $rootScope.providers = [];
        $scope.addprovider = true;
        $log.debug(MyProviderList.error.message);
      } 
    });

    $scope.$watch('$state.$current.locals.globals.ProviderCategoryList', function (ProviderCategoryList) {
      $log.debug(ProviderCategoryList);
      if (ProviderCategoryList.success !== undefined && ProviderCategoryList.success.category.length !== 0) {
        $scope.providers_category_list = angular.copy(ProviderCategoryList.success.category); 
      } else {
        if(ProviderCategoryList.error.code=='AL001'){
          $scope.providers_category_list = [];
          $rootScope.showModal();
        } else {
          $scope.providers_category_list = [];
          $log.debug(ProviderCategoryList.error.message);
          $rootScope.OZNotify(ProviderCategoryList.error.message,'error');
        }
      }
    });

    $scope.$watch('$state.$current.locals.globals.OrderStatusList', function (OrderStatusList) {
      $log.debug(OrderStatusList);
      if (OrderStatusList.success !== undefined && OrderStatusList.success.orderprocess.length !== 0) {
        var orderstatuslist = [];
        orderstatuslist = angular.copy(OrderStatusList.success.orderprocess);
        $scope.process_configuration_error = '';
        if ($scope.order_status_list.length == 0) {
          $scope.process_configuration(orderstatuslist);
        }  
      } else {
        if(OrderStatusList.error.code=='AL001'){
          $scope.order_status_list = [];
          $rootScope.showModal();
        } else {
          $scope.order_status_list = [];
          $scope.process_configuration_error = 'Order process configuration is required for adding seller account. It might be that due to some server or database error, you are not able to see order process configuration options. So please, contact OrderZapp support team for further help. '
          $log.debug(OrderStatusList.error.message);
          $rootScope.OZNotify(OrderStatusList.error.message,'error');
        }
      }
    });

    $scope.process_configuration = function(orderstatuslist){
      if (orderstatuslist.length !== 0) {
        for (var i = 0; i < orderstatuslist.length; ++i) {
          if(orderstatuslist[i].require == true) {
            $scope.order_status_list.push({index:orderstatuslist[i].index, order_status:orderstatuslist[i].order_status, require:orderstatuslist[i].require, default:true });
          } else {
            $scope.order_status_list.push({index:orderstatuslist[i].index, order_status:orderstatuslist[i].order_status, require:orderstatuslist[i].require});
          }
        }
      }
    }

    $scope.showSellerDetail = false;

    $scope.getTrialDate = function(trialdate){
      if (trialdate && trialdate.expirydate) {
        var planExpiryDate = moment.utc(moment(trialdate.expirydate));
        var todaysDate = moment.utc(moment());
        $scope.remainingDaysCount = planExpiryDate.diff(todaysDate, 'days'); 
        return 'Trial' + ' (' + ' ' + $scope.remainingDaysCount + ' ' + 'days remaining )';
      }
    }

    $scope.viewSellerDetail = function(index){
      if (index !== null) {
        $scope.currentSellerIndex = index;
      } else {
        $scope.currentSellerIndex = '';
      }
      $scope.showSellerDetail = !$scope.showSellerDetail;
    }

    $scope.add_provider = function(){
      $scope.addprovider = true;
    }

    $scope.cancelAddSeller = function(){
      $scope.form.addSellerForm.submitted = false;
      $scope.addseller = {};
      $scope.addseller.online = true;
      $scope.addSellerLogo = false;
      $scope.form.addSellerForm.$setPristine();
      $scope.addprovider = false;
      file = null;
      var fileinput = document.getElementById('addProvider');
      fileinput.value = '';
      if (OrderStatusList.success !== undefined && OrderStatusList.success.orderprocess.length !== 0) {
        $scope.order_status_list = [];
        $scope.process_configuration(OrderStatusList.success.orderprocess);
      }
    }

    $scope.onFileSelect = function($files) {
      $log.debug($files);
      for (var i = 0; i < $files.length; i++) {
        if(($files[i].type == 'image/jpg') || ($files[i].type == 'image/png') || ($files[i].type == 'image/gif') || ($files[i].type == 'image/jpeg')){
          if (($files[i].size / 1024) < 2048) {
             file = $files[i];
          }else{
             var field= document.getElementById('addProvider');
             field.value= field.defaultValue;
             $rootScope.OZNotify("Image size must ne less than 2MB" ,'error');
          }
        } else {
              var field= document.getElementById('addProvider');
              field.value= field.defaultValue;
              $rootScope.OZNotify("Please upload image only" ,'error');
        }
      }
      if (file != null) {
        $scope.addSellerLogo = false;
      }
    };

    $scope.onFileSelectUpdate = function($files) {
      for (var i = 0; i < $files.length; i++) {
        if(($files[i].type == 'image/jpg') || ($files[i].type == 'image/png') || ($files[i].type == 'image/gif') || ($files[i].type == 'image/jpeg')){
         if (($files[i].size / 1024) < 2048) {
          fileUpdate = $files[i];
        }else{
          var field= document.getElementById('updateProvider');
          field.value= field.defaultValue;
          $rootScope.OZNotify("Image size must ne less than 2MB" ,'error');
        }
        } else {
          var field= document.getElementById('updateProvider');
          field.value= field.defaultValue;
          $rootScope.OZNotify("Please upload image only" ,'error');
        }
      }
    };  

    // function to send and stringify user registration data to Rest APIs
    $scope.jsonAddSellerData = function(){
      var order_status_list = [];
      for (var i = 0; i < $scope.order_status_list.length; ++i) {
        if($scope.order_status_list[i].require == true) {
          order_status_list.push({index:$scope.order_status_list[i].index, order_status:$scope.order_status_list[i].order_status });
        }
      }
      var sellerdata = 
      {
        data:
          {
            'providername' : $scope.addseller.name,
            'providercode' : $scope.addseller.code,
            'providerbrandname': $scope.addseller.providerbrandname,
            'provideremail': $scope.addseller.provideremail,
            'category' : { 'categoryid': $scope.sellercategory.categoryname.categoryid, 'categoryname': $scope.sellercategory.categoryname.categoryname },
            'providerdescription' : $scope.addseller.description,
            'tax': {
              'tino': $scope.addseller.tino,
              'servicetaxno': $scope.addseller.servicetaxno
            },
            'paymentmode': {
              'cod': $scope.addseller.cod,
              'online': $scope.addseller.online
            }, 
            'orderprocess_configuration': order_status_list
          }  
      };
      return sellerdata; 
    } 

    // function to handle server side responses
    $scope.handleAddSellerResponse = function(data){
      if (data.success) {
        $state.reload();
        $scope.cancelAddSeller();
        $rootScope.OZNotify(data.success.message,'success'); 
      } else {
        if(data.error.code=='AL001'){
          $rootScope.showModal();
        } else {
          $log.debug(data.error.message);
          $rootScope.OZNotify(data.error.message,'error');
        }
      }
      $rootScope.hideSpinner();
    };
  
    $scope.addSeller = function(){
      if ($scope.form.addSellerForm.$valid) {
        if (file !== undefined && file !== null) {
          $rootScope.showSpinner();
          $scope.addSellerLogo = false;
          console.log(file);
          $log.debug('seller Data entered successfully');
          var sellerdata = $scope.jsonAddSellerData();
          $log.debug($scope.jsonAddSellerData());
          $scope.upload = $upload.upload({
            url: '/api/productprovider/', 
            data: sellerdata ,
            file:file, 
          }).progress(function(evt) {
            $log.debug('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
          }).success(function(data, status, headers, config) {
            $scope.handleAddSellerResponse(data);
            $log.debug(data);
          });
        } else{
          $scope.addSellerLogo = true;
        }
      } else {
        if (file == null) {
          $scope.addSellerLogo = true;
        }
        $scope.form.addSellerForm.submitted = true;
      }
    };

    $scope.openEditSeller = function(Seller){
      if (Seller.orderprocess_configuration) {
        var orderprocess = [];
        var status_list = [];
        $scope.edit_order_status_list = [];
        orderprocess = angular.copy(Seller.orderprocess_configuration);
        if (orderprocess.length !== 0) {
          for (var i = 0; i < orderprocess.length; i++) {
            status_list.push(orderprocess[i].order_status);
          }
          if (status_list.length !== 0 && $scope.order_status_list.length !== 0) {
            for (var i = 0; i < $scope.order_status_list.length; i++) {
              var result = status_list.indexOf($scope.order_status_list[i].order_status);
              if (result !== -1) {
                if ($scope.order_status_list[i].default && $scope.order_status_list[i].default == true) {
                  $scope.edit_order_status_list.push({index:$scope.order_status_list[i].index, order_status:$scope.order_status_list[i].order_status, require:true, default:$scope.order_status_list[i].default});
                } else {
                  $scope.edit_order_status_list.push({index:$scope.order_status_list[i].index, order_status:$scope.order_status_list[i].order_status, require:true});
                }
              } else {
                $scope.edit_order_status_list.push({index:$scope.order_status_list[i].index, order_status:$scope.order_status_list[i].order_status, require:false});
              }
            }
          }
        }
      }
      $scope.editseller = angular.copy(Seller);
      $('#editSellerModal').modal({ 
        keyboard: false,
        backdrop: 'static',
        show: true
      });
    };

    // function to send and stringify user registration data to Rest APIs
    $scope.jsonEditSellerData = function(){
      var edit_order_status_list = [];
      for (var i = 0; i < $scope.edit_order_status_list.length; ++i) {
        if($scope.edit_order_status_list[i].require == true) {
          edit_order_status_list.push({index:$scope.edit_order_status_list[i].index, order_status:$scope.edit_order_status_list[i].order_status });
        }
      }
      var sellerdata = 
      {
        providerdata:
          {
            'providername' : $scope.editseller.providername,
            'providercode' : $scope.editseller.providercode,
            'providerbrandname': $scope.editseller.providerbrandname,
            'provideremail': $scope.editseller.provideremail,
            'providerdescription' : $scope.editseller.providerdescription,
            'tax': {
              'tino': $scope.editseller.tax.tino,
              'servicetaxno': $scope.editseller.tax.servicetaxno
            },
            'paymentmode': {
              'cod': $scope.editseller.paymentmode.cod,
              'online': true
            }, 
            'orderprocess_configuration': edit_order_status_list
          }  
      };
      return JSON.stringify(sellerdata); 
    } 

    $scope.handleEditSellerResponse = function(data){
      if (data.success) {
        $('#editSellerModal').modal('hide');
        $state.reload();
        $rootScope.OZNotify(data.success.message,'success'); 
      } else {
        if(data.error.code=='AL001'){
          $('#editSellerModal').modal('hide');
          $rootScope.showModal();
        } else {
          $log.debug(data.error.message);
          $rootScope.OZNotify(data.error.message,'error');
        }
      }
      $rootScope.hideSpinner();
    };


    $scope.handleChangeProviderLogo = function(data, providerid){
      if (data.success) {
        ManageBranchService.update_seller($scope.jsonEditSellerData(), providerid);
        $rootScope.OZNotify(data.success.message,'success'); 
      } else {
        $log.debug(data.error.message);
        $rootScope.OZNotify(data.error.message,'error');
      }
    };

    $scope.editSeller = function(providerid){
      if ($scope.form.editSellerForm.$valid) {
        if (fileUpdate !== undefined && fileUpdate !== null) {
          $rootScope.showSpinner();
          $log.debug('seller Data entered successfully with logo');
          $scope.upload = $upload.upload({
            url: '/api/productprovider/logo/'+providerid, 
            file:fileUpdate, 
          }).progress(function(evt) {
            $log.debug('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
          }).success(function(data, status, headers, config) {
            $scope.handleChangeProviderLogo(data, providerid);
            $log.debug(data);
          });
        } else if (fileUpdate == null) {
          $rootScope.showSpinner();
          ManageBranchService.update_seller($scope.jsonEditSellerData(), providerid);
        }
      } else {
        $log.debug('incorrect data');
        $scope.form.editSellerForm.submitted = true;
      }
    }


    var cleanupEventEditSellerDone = $scope.$on("editSellerDone", function(event, message){
      $log.debug(message);
      $scope.handleEditSellerResponse(message);      
    });

    var cleanupEventEditSellerNotDone = $scope.$on("editSellerNotDone", function(event, message){
      $log.debug(message);
      $rootScope.hideSpinner();
      $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    });

    $scope.$on('$destroy', function(event, message) {
      cleanupEventEditSellerDone();
      cleanupEventEditSellerNotDone();
    });

 }]);

