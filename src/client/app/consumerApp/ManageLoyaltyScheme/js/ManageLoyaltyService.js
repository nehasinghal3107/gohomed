angular.module('oz.ProviderApp')
	.factory('GetLoyaltySchemeService', [
	  '$resource',
	  function ($resource) {
	    var loyalty = {
	      MyProvider_Data: $resource('/api/myproviderbranchinfo', {}, { GetMyProviderData: { method: 'GET'} }),
    		Get_Loyalty_History_For_Seller: $resource('/api/loyaltypoints/:providerid', {}, { get_history_data: { method: 'GET' } })
	    }
	    return loyalty;
	  }
	])
	.factory('LoyaltySchemeService', [
	  '$rootScope',
	  '$resource',
	  '$http',
	  '$state',
	  '$log',
	  function ($rootScope, $resource, $http, $state, $log) {
	    var LoyaltyScheme = {
    		Add_Loyalty_Scheme: $resource("/api/loyaltyscheme/:providerid", {}, {add: { method: 'POST', params: { providerid: '@providerid'} } }),
	    	Get_Loyalty_Scheme_For_Seller: $resource("/api/loyaltyscheme/:providerid", {}, { get: { method: 'GET', params: { providerid: '@providerid'} } }),
    		Delete_Loyalty_Scheme_For_Seller: $resource("/api/loyaltyscheme/:providerid/:branchid/:schemeid", {}, { delete: { method: 'DELETE', params: { providerid: '@providerid', branchid: '@branchid', schemeid: '@schemeid'} } }),
    		Deactivate_Loyalty_Scheme_For_Seller: $resource("/api/activatedeactivateloyaltyscheme/:providerid/:branchid/:schemeid?action=deactivate ", {}, { deactivate: { method: 'GET', params: { providerid: '@providerid', branchid: '@branchid', schemeid: '@schemeid'} } }),
    		Activate_Loyalty_Scheme_For_Seller: $resource("/api/activatedeactivateloyaltyscheme/:providerid/:branchid/:schemeid?action=activate ", {}, { activate: { method: 'GET', params: { providerid: '@providerid', branchid: '@branchid', schemeid: '@schemeid'} } }),
    		Update_Loyalty_Scheme_For_Seller: $resource("/api/loyaltyscheme/:providerid/:branchid", {}, {update: { method: 'PUT', params: { providerid: '@providerid', branchid: '@branchid'} } })
    	};
	    var LoyaltySchemeService = {};

	    LoyaltySchemeService.add_LoyaltyScheme = function (providerid, data) {
	    	console.log(providerid);
	      LoyaltyScheme.Add_Loyalty_Scheme.add({providerid: providerid}, data, function (success) {
	        $log.debug(success);
	        $rootScope.$broadcast('addLoyaltySchemeDone', success, providerid);
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('addLoyaltySchemeNotDone', error.status);
	      });
	    };

	    LoyaltySchemeService.get_LoyaltyScheme = function (providerid) {
	      LoyaltyScheme.Get_Loyalty_Scheme_For_Seller.get({providerid: providerid}, function (success) {
	        $log.debug(success);
	        $rootScope.$broadcast('getLoyaltySchemeDone', success);
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('getLoyaltySchemeNotDone', error.status);
	      });
	    };

	    LoyaltySchemeService.delete_LoyaltyScheme = function(providerid, branchid, schemeid) {
	    	LoyaltyScheme.Delete_Loyalty_Scheme_For_Seller.delete({providerid: providerid, branchid: branchid, schemeid: schemeid}, function (success) {
	        $log.debug(success);
	        $rootScope.$broadcast('deleteLoyaltySchemeDone', success, providerid);
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('deleteLoyaltySchemeNotDone', error.status);
	      });
	    };

	    LoyaltySchemeService.deactivate_LoyaltyScheme = function(providerid, branchid, schemeid) {
	    	LoyaltyScheme.Deactivate_Loyalty_Scheme_For_Seller.deactivate({providerid: providerid, branchid: branchid, schemeid: schemeid}, function (success) {
	        $log.debug(success);
	        $rootScope.$broadcast('deactivateLoyaltySchemeDone', success, providerid);
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('deactivateLoyaltySchemeNotDone', error.status);
	      });
	    };

	    LoyaltySchemeService.activate_LoyaltyScheme = function(providerid, branchid, schemeid) {
	    	LoyaltyScheme.Activate_Loyalty_Scheme_For_Seller.activate({providerid: providerid, branchid: branchid, schemeid: schemeid}, function (success) {
	        $log.debug(success);
	        $rootScope.$broadcast('activateLoyaltySchemeDone', success, providerid);
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('activateLoyaltySchemeNotDone', error.status);
	      });
	    };

	    LoyaltySchemeService.update_LoyaltyScheme = function(providerid, branchid, data) {
	    	LoyaltyScheme.Update_Loyalty_Scheme_For_Seller.update({providerid: providerid, branchid: branchid}, data, function (success) {
	        $log.debug(success);
	        $rootScope.$broadcast('updateLoyaltySchemeDone', success, providerid);
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('updateLoyaltySchemeNotDone', error.status);
	      });
	    };

	    return LoyaltySchemeService;
	  }

	]);
