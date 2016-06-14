angular.module('oz.ProviderApp')
  .controller('ManageDeliveryLeadTimeController', ['$scope', '$state', '$http', '$timeout', '$sce', '$log', '$rootScope', 'ProviderLeadtimeService','$upload','$stateParams', function($scope, $state, $http, $timeout, $sce, $log, $rootScope,ProviderLeadtimeService,$upload, $stateParams) {
  
  $scope.$watch('selectedBranchId', function (selectedBranchId) {
      ProviderLeadtimeService.getAllCategories();
      $rootScope.showSpinner();
  });
    
  $scope.contentOfAllProducts = [];

  var tempContentOfAllProducts = [];

  var regexForNumbers = /^\d+$/;;
    
  $scope.enableTheEditorFunction = function(products)
  {
          products.editing = true;
  };

  $scope.cancel = function(products)
  {
    	products.editing = false;
    	$scope.contentOfAllProducts = angular.copy(tempContentOfAllProducts);
  };

  var cleanUpEventGotAllProducts = $scope.$on('gotAllProductsSuccessfully', function(event, data)
  {     
      $scope.contentOfAllProducts = [];
      $scope.tempContentOfAllProducts = [];        
      if(data.error)
      {
          if(data.error.code === 'AL001')
          {
            $rootScope.showModal();
          }
          else
          {
            $rootScope.OZNotify(data.error.message, 'error');
          }
          $rootScope.hideSpinner();
       }
       if(data.success)
       {
         	     $scope.contentOfAllProducts = [];
         	     tempContentOfAllProducts = [];
                 $scope.contentOfAllProducts = angular.copy(data.success.productleadtime);
                 tempContentOfAllProducts = angular.copy(data.success.productleadtime);
                                  $rootScope.hideSpinner();
                 $log.debug('got content '+JSON.stringify(data.success.productleadtime));

       }
   });

  var cleanUpEventGetAllProductFail = $scope.$on('notGotProducts', function(event, data)
  {
      $rootScope.OZNotify('Some issue with the server! Please try again after some time', 'error');
       $scope.contentOfAllProducts = [];
       $scope.tempContentOfAllProducts = []; 
       $rootScope.hideSpinner();
  });

  $scope.changeLeadTimes = function(products)
  {
          if(products.leadtime.value === undefined || products.leadtime.value === '' || regexForNumbers.test(products.leadtime.value) === false)
          {
            $rootScope.OZNotify('Please enter valid lead time! The time must be in numeric form', 'error');
          }
          else if(products.leadtime.option === undefined || products.leadtime.option === '' )
          {
            $rootScope.OZNotify('Please select atleast one option from the list', 'error');
          }
          else
          {
           var content = {"productleadtimedata":[{"productid":products.productid, 'productname' : products.productname,"leadtime":{"value": products.leadtime.value,"option": products.leadtime.option}}]}; 
           ProviderLeadtimeService.changeProductLeadTime(content);  $log.debug(JSON.stringify(content));
         }
  };

  var cleanUpEventChangeProductLeadtime = $scope.$on('changedproductLeadTime', function(event, data)
  {             
         if(data.error)
         {
          if(data.error.code === 'AL001')
          {
            $rootScope.showModal();
          }
          else
          {
            $rootScope.OZNotify(data.error.message, 'error');
          }
         }
         if(data.success)
         {
            $rootScope.OZNotify(data.success.message, 'success');
              ProviderLeadtimeService.getAllCategories();
         }
  });

  var cleanUpEventNotChangeProductLeadtime = $scope.$on('notChangedLeadTime', function(event, data)
  {
      $rootScope.OZNotify('Some issue with the server! Please try again after some time', 'error');
  });

  $scope.showGlobalTextLead = function(list)
  {
  
      // console.log('test');
      list.new = {};
      list.new = {'leadtime' : {'value' : '', 'option' : ''}};
      list.new.leadtime.value = '';
      list.new.leadtime.option = '';
      if(document.getElementById(list.category.categoryid).checked === true)
      {
              list.editing = true;
      }

      if(document.getElementById(list.category.categoryid).checked === false)
      {
                list.editing = false;
      }
  };

  $scope.hideGlobalTextLead = function(list)
  {
    	list.editing = false;
      document.getElementById(list.category.categoryid).checked = false;
      
  };

  $scope.applyLeadTimesAll = function(list)
  {
      var arrayToBeSent = {'productleadtimedata' : []};
     
      if( list.new.leadtime.value === undefined ||  list.new.leadtime.value === '' || regexForNumbers.test(list.new.leadtime.value) === false)
      {
        $rootScope.OZNotify('Please enter valid lead time! The time must be in numeric form', 'error');
      }
      else if(list.new.leadtime.option === undefined || list.new.leadtime.option === '' )
      {
        $rootScope.OZNotify('Please select atleast one option from the list', 'error');
      }
      else
      {
           for(var i = 0; i < list.productleadtime.length; i++)
           {
                   arrayToBeSent.productleadtimedata.push({'productid' : list.productleadtime[i].productid, 'productname' : list.productleadtime[i].productname, 'leadtime' : {'value' : list.new.leadtime.value, 'option' : list.new.leadtime.option}});
           }
           // console.log(JSON.stringify(arrayToBeSent));
           ProviderLeadtimeService.changeProductLeadTime(arrayToBeSent);  $log.debug(JSON.stringify(arrayToBeSent));
      } 
   }

  $scope.$on('$destroy', function(event, message) 
  {
        cleanUpEventGotAllProducts();
        cleanUpEventGetAllProductFail();
        cleanUpEventChangeProductLeadtime();
        cleanUpEventNotChangeProductLeadtime();
  });

 }]);

