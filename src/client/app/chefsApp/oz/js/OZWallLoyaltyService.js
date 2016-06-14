angular.module('oz.AdminApp')

	.factory('GetProviderService', [
	  '$resource',
	  function ($resource) {
	    var provider = {
	      ProviderListData: $resource('/api/allproductprovider', {}, { GetAllProviders: { method: 'GET'} })
	    }
	    return provider;
	  }
	])
	.factory('LoyaltyService', [
	  '$rootScope',
	  '$resource',
	  '$http',
	  '$state',
	  '$log',
	  function ($rootScope, $resource, $http, $state, $log) {
	    var LoyaltyScheme = {
    		Get_Loyalty_History_For_Seller: $resource('/api/loyaltypoints/:providerid', {}, { get_history_data: { method: 'GET', params: { providerid: '@providerid'} } }),
    		Get_Loyalty_Points_For_Seller: $resource('/api/loyaltypoints/:providerid', {}, { manage_loyalty_data: { method: 'POST', params: { providerid: '@providerid'} } })
    	};
	    var LoyaltyService = {};

	    LoyaltyService.getLoyaltyHistory = function (providerid) {
	    	console.log(providerid);
	      LoyaltyScheme.Get_Loyalty_History_For_Seller.get_history_data({providerid: providerid}, function (success) {
	        $log.debug(success);
	        $rootScope.$broadcast('getLoyaltyHistoryDone', success);
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('getLoyaltyHistoryNotDone', error.status);
	      });
	    };

	    LoyaltyService.manageLoyaltyPointsForSeller = function (provider, data) {
	    	console.log(provider.providerid);
	      LoyaltyScheme.Get_Loyalty_Points_For_Seller.manage_loyalty_data({providerid: provider.providerid}, data, function (success) {
	        $log.debug(success);
	        $rootScope.$broadcast('manageLoyaltyPointsDone', success, provider);
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('manageLoyaltyPointsNotDone', error.status);
	      });
	    };

	    return LoyaltyService;
	  }

	]);
