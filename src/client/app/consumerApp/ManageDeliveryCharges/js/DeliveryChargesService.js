angular.module('oz.ProviderApp')

	.factory('GetLocationService', [
	  '$resource',
	  function ($resource) {
	    var location = {
	      LocationData: $resource('/api/location?key=:keydata&value=:data', {}, { GetAllLocationData: { method: 'GET'} }),
	      LocationArea: $resource('api/location/area?city=:data&result=jsonarray', {}, { GetAllAreaForCity: {method: 'GET'} }),
	      Get_AllBranchArea_For_Delivery: $resource('/api/branchdeliverycharges/:branchid', {}, { all_brancharea_for_delivery: { method: 'GET' } })
	    }
	    return location;
	  }
	])
	.factory('ManageDeliveryChargesService', [
	  '$rootScope',
	  '$resource',
	  '$http',
	  '$state',
	  '$log',
	  function ($rootScope, $resource, $http, $state, $log) {
	    var DeliveryChargeLocation = {
    		Get_Location: $resource('/api/location?key=:keydata&value=:data', {}, { get_location_data: { method: 'GET', params: { keydata: '@keydata', data: '@data' } } }),
    		Get_State_For_Country: $resource('/api/location?key=:keydata&value=:data', {}, { state_for_country: { method: 'GET', params: { keydata: '@keydata', data: '@data' } } }),
    		Get_City_For_State: $resource('/api/location?key=:keydata&value=:data', {}, { city_for_state: { method: 'GET', params: { keydata: '@keydata', data: '@data' } } }),
    		Get_Zipcode_For_City: $resource('/api/location?key=:keydata&value=:data', {}, { zipcode_for_city: { method: 'GET', params: { keydata: '@keydata', data: '@data' } } }),
    		Get_Area_For_Zipcode: $resource('/api/location?key=:keydata&value=:data', {}, { area_for_zipcode: { method: 'GET', params: { keydata: '@keydata', data: '@data' } } }),
    		Get_Area_For_Delivery: $resource('/api/branchdeliverycharges/:branchid?zipcode=:zipcode', {}, { area_for_delivery: { method: 'GET', params: { branchid: '@branchid', zipcode: '@zipcode' } } }),
    		Add_Charges_For_Delivery: $resource('/api/managedeliverycharges/:branchid', {}, { manage_delivery_charges: { method: 'PUT', params: { branchid: '@branchid'} } }),
    		Get_AllAvailableAreas_For_Delivery: $resource('/api/branchdeliverycharges/:branchid', {}, { all_brancharea_for_delivery: { method: 'GET' }, params: { branchid: '@branchid'} }),
	      Get_Area_For_City: $resource('api/location/area?city=:data&result=jsonarray', {}, { Get_All_Area_List: {method: 'GET'} })
    	};
	    var DeliveryChargeService = {};

	    DeliveryChargeService.GetStateList = function (country) {
	      DeliveryChargeLocation.Get_State_For_Country.state_for_country({keydata:'state', data: country}, function (success) {
	        $log.debug(success);
	        $rootScope.$broadcast('getStateListDone', success, country);
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('getStateListNotDone', error.status);
	      });
	    };

	    DeliveryChargeService.GetCityList = function (state) {
	      DeliveryChargeLocation.Get_City_For_State.city_for_state({keydata:'city', data: state}, function (success) {
	        $log.debug(success);
	        $rootScope.$broadcast('getCityListDone', success, state);
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('getCityListNotDone', error.status);
	      });
	    };

	    DeliveryChargeService.GetZipcodeList = function (city) {
	      DeliveryChargeLocation.Get_Zipcode_For_City.zipcode_for_city({keydata:'zipcode', data: city}, function (success) {
	        $log.debug(success);
	        $rootScope.$broadcast('getZipcodeListDone', success, city);
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('getZipcodeListNotDone', error.status);
	      });
	    };

	    DeliveryChargeService.GetAreaForCityList = function (city) {
	      DeliveryChargeLocation.Get_Area_For_City.Get_All_Area_List({data: city}, function (success) {
	        $log.debug(success);
	        $rootScope.$broadcast('getAreaForCityListDone', success, city);
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('getAreaForCityListNotDone', error.status);
	      });
	    };

	    DeliveryChargeService.GetAreaList = function (zipcode) {
	      DeliveryChargeLocation.Get_Area_For_Zipcode.area_for_zipcode({keydata:'area', data: zipcode}, function (success) {
	        $log.debug(success);
	        $rootScope.$broadcast('getAreaListDone', success, zipcode);
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('getAreaListNotDone', error.status);
	      });
	    };


	    DeliveryChargeService.GetAvailableAreaList = function (zipcode, arealist) {
	      DeliveryChargeLocation.Get_Area_For_Delivery.area_for_delivery({branchid: $rootScope.selectedBranchId, zipcode: zipcode}, function (success) {
	        $log.debug(success);
	        $rootScope.$broadcast('getAvailableAreaListDone', success, zipcode, arealist);
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('getAvailableAreaListNotDone', error.status);
	      });
	    };

	    DeliveryChargeService.AddDeliveryAvailability = function (data, zipcode) {
	      DeliveryChargeLocation.Add_Charges_For_Delivery.manage_delivery_charges({branchid: $rootScope.selectedBranchId}, data, function (success) {
	        $log.debug(success);
	        $rootScope.$broadcast('addDeliveryAvailabilityDone', success, zipcode);
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('addDeliveryAvailabilityNotDone', error.status);
	      });
	    };

	    DeliveryChargeService.EditDeliveryAvailability = function (data, zipcode) {
	      DeliveryChargeLocation.Add_Charges_For_Delivery.manage_delivery_charges({branchid: $rootScope.selectedBranchId}, data, function (success) {
	        $log.debug(success);
	        $rootScope.$broadcast('editDeliveryAvailabilityDone', success, zipcode);
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('editDeliveryAvailabilityNotDone', error.status);
	      });
	    };

	    DeliveryChargeService.GetAllAreaAvailabilityForBranch = function () {
	    	if ($rootScope.selectedBranchId) {
	    		DeliveryChargeLocation.Get_AllAvailableAreas_For_Delivery.all_brancharea_for_delivery({branchid: $rootScope.selectedBranchId}, function (success) {
		        $log.debug(success);
		        $rootScope.$broadcast('getAllAreaAvailabilityDone', success);
		      }, function (error) {
		        $log.debug(error);
		        $rootScope.$broadcast('getAllAreaAvailabilityNotDone', error.status);
		      });
	    	}
	    };

	    DeliveryChargeService.getLocation = function (locationdata) {
	      DeliveryChargeLocation.Get_Location.get_location_data({keydata:'state', data: locationdata.country}, function (successState) {
	        $log.debug(successState);
	      	DeliveryChargeLocation.Get_Location.get_location_data({keydata:'city', data: locationdata.state}, function (successCity) {
	      		$log.debug(successCity);
	      		DeliveryChargeLocation.Get_Area_For_City.Get_All_Area_List({data: locationdata.city}, function (successArea) {
	      			$log.debug(successArea);
		        	$rootScope.$broadcast('getLocationDataDone', successState, successCity, successArea);
	      		}, function (error){
	      			$log.debug(error);
		        	$rootScope.$broadcast('getLocationDataNotDone', error.status);
	      		})
	      	}, function (error) {
		        $log.debug(error);
		        $rootScope.$broadcast('getLocationDataNotDone', error.status);
		      })
	      }, function (error) {
	        $log.debug(error);
	        $rootScope.$broadcast('getLocationDataNotDone', error.status);
	      });
	    };

	    return DeliveryChargeService;
	  }
	]);
