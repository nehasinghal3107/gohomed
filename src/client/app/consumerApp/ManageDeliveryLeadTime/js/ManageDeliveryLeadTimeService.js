

angular.module('oz.ProviderApp')

.factory('ProviderLeadtimeService', [
  '$resource',
  '$rootScope',
  function($resource, $rootScope)
  {
       var service = {
       	getAllProducts : $resource('/api/productleadtime/:providerid/:branchid?category=category', {}, {get : {method : 'GET', params : {providerid: '@providerid',branchid : '@branchid'}}}),
        // changeLeadTime : $resource('/api/manageproductleadtime/providerid/branchid' , {}, {})
        changeProductLeadTime : $resource('/api/manageproductleadtime/:providerid/:branchid', {}, {post : {method : 'POST', params : {providerid: '@providerid',branchid : '@branchid'}}})
       };

       var callService = {};
      
       callService.getAllCategories = function()
       {   
       	service.getAllProducts.get({providerid : $rootScope.selectedproviderid, branchid : $rootScope.selectedBranchId}, function(success)
       		{ 
       		      $rootScope.$broadcast('gotAllProductsSuccessfully', success);
       		},
       		function(error)
       		{
       			$rootScope.$broadcast('notGotProducts', error);
       		}
       	);
       };

      callService.changeProductLeadTime = function(content)
       {  
        service.changeProductLeadTime.post({providerid : $rootScope.selectedproviderid, branchid : $rootScope.selectedBranchId}, content, function(success)
          { 
                $rootScope.$broadcast('changedproductLeadTime', success);
          },
          function(error)
          {
            $rootScope.$broadcast('notChangedLeadTime', error);
          }
        );
       };
       return callService;
  }]);


