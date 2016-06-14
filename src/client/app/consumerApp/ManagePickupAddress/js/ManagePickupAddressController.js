angular.module('oz.ProviderApp')
  .controller('ManagePickupAddressController', ['$scope', '$state', '$http', '$timeout', '$sce', '$log', '$rootScope', 'ProviderServices','$upload','$stateParams', 'ManageSellerService', 'ManageDeliveryChargesService', 'ManageBranchService', 'PickupAddressList', 'CountryDataList', 'checkIfSessionExist', function($scope, $state, $http, $timeout, $sce, $log, $rootScope,ProviderServices,$upload, $stateParams, ManageSellerService, ManageDeliveryChargesService, ManageBranchService, PickupAddressList, CountryDataList, checkIfSessionExist) {
  
    $log.debug("initialising manage pickup address controller");
    $scope.providers_pickup_address = [];
    $scope.pickup = {};
    $scope.editpickup = {};
    $scope.$state = $state;
    $scope.form = {};
    $scope.submitted = false;
    $scope.editAddress = false;
    $scope.states = [];
    $scope.cities = [];
    $scope.zipcodes = [];
    $scope.Areas = [];
    var char_regex = /^[a-zA-Z]*$/;
    var zipcode_regex = /^[0-9]{6}$/;

    $scope.$watch('$state.$current.locals.globals.checkIfSessionExist', function (checkIfSessionExist) {
      if (checkIfSessionExist.error) {
        $rootScope.showModal();
      };
    });

    $scope.$watch('$state.$current.locals.globals.PickupAddressList', function (PickupAddressList) {
      $log.debug(PickupAddressList);
      if (PickupAddressList.success !== undefined && PickupAddressList.success.addresses.length !== 0) {
        $scope.providers_pickup_address = angular.copy(PickupAddressList.success.addresses); 
      } else {
        if(PickupAddressList.error.code=='AL001'){
          $scope.providers_pickup_address = [];
          $rootScope.showModal();
        } else {
          $scope.providers_pickup_address = [];
          $log.debug(PickupAddressList.error.message);
          $rootScope.OZNotify(PickupAddressList.error.message,'error');
        }
      }
    });

    $scope.$watch('$state.$current.locals.globals.CountryDataList', function (CountryDataList) {
      $log.debug(CountryDataList);
      if (CountryDataList.success && CountryDataList.success.country.length !== 0) {
        $scope.country_list = angular.copy(CountryDataList.success.country);
      }
    });

    var cleanupEventChange_in_provideridDone = $scope.$on("change_in_providerid", function(event, data){
      $log.debug(data);
      $state.reload();     
    });

    $scope.getStateForCountry = function(country){
      if (country) {
        $rootScope.showSpinner();
        $scope.states = [];
        $scope.cities = [];
        $scope.Areas = [];
        $scope.pickup.zipcode = '';
        ManageDeliveryChargesService.GetStateList(country);
      }
    }

    // // function to handle server side responses
    $scope.handleGetStateListResponse = function(data, country){
      if (data.success) {
        if (data.success.states.length >= 0) {
          $scope.states = angular.copy(data.success.states);
        } else {
          $scope.states = [];
        }
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

    var cleanupEventGetStateListDone = $scope.$on("getStateListDone", function(event, message, country){
      $log.debug(message);
      $scope.handleGetStateListResponse(message, country);      
    });

    var cleanupEventGetStateListNotDone = $scope.$on("getStateListNotDone", function(event, message){
      $rootScope.hideSpinner();
      $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    });


    $scope.getCityForState = function(state) {
      if (state) {
        $rootScope.showSpinner();
        $scope.cities = [];
        $scope.Areas = [];
        $scope.pickup.zipcode = '';
        ManageDeliveryChargesService.GetCityList(state);
      }
    }

    // // function to handle server side responses
    $scope.handleGetCityListResponse = function(data, state){
      if (data.success) {
        if (data.success.city.length >= 0) {
          $scope.cities = angular.copy(data.success.city);
        } else {
          $scope.cities = [];
        }
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

    var cleanupEventGetCityListDone = $scope.$on("getCityListDone", function(event, message, state){
      $log.debug(message);
      $scope.handleGetCityListResponse(message, state);      
    });

    var cleanupEventGetCityListNotDone = $scope.$on("getCityListNotDone", function(event, message){
      $rootScope.hideSpinner();
      $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    });

    $scope.getAreaForCity = function(city) {
      if (city) {
        $rootScope.showSpinner();
        $scope.Areas = [];
        $scope.pickup.zipcode = '';
        ManageDeliveryChargesService.GetAreaForCityList(city);
      }
    }

    // // function to handle server side responses
    $scope.handleGetAreaForCityListResponse = function(data, city){
      if (data.success) {
        if (data.success.location.length !== 0) {
          $scope.Areas = angular.copy(data.success.location);
        } else {
          $scope.Areas = [];
        }
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

    var cleanupEventGetAreaForCityListDone = $scope.$on("getAreaForCityListDone", function(event, message, city){
      $log.debug(message);
      $scope.handleGetAreaForCityListResponse(message, city);      
    });

    var cleanupEventGetAreaForCityListNotDone = $scope.$on("getAreaForCityListNotDone", function(event, message){
      $rootScope.hideSpinner();
      $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    });


    $scope.getZipcodeForArea = function(area) {
      if (area) {
        $scope.pickup.zipcode = '';
        console.log(area);
        $scope.pickup.zipcode = angular.copy(area.zipcode);
      }
    }

    $scope.cancelAddPickupAddress = function(){
      $scope.pickup = {};
      $scope.states = [];
      $scope.cities = [];
      $scope.Areas = [];
      $scope.form.addPickupAddress.$setPristine();
      $scope.form.addPickupAddress.submitted = false;
    };


    // function to send and stringify user registration data to Rest APIs
    $scope.jsonAddPickupAddressData = function(){
      // if (char_regex.test($scope.pickup.state) && char_regex.test($scope.pickup.city) && zipcode_regex.test($scope.pickup.zipcode) && char_regex.test($scope.pickup.area))  {};
      var Pickupdata = 
      {
        location: {
          'address1': $scope.pickup.address1,
          'address2': $scope.pickup.address2,
          'area': $scope.pickup.area.area,
          'city': $scope.pickup.city,
          'country': $scope.pickup.country,
          'state': $scope.pickup.state,
          'zipcode': $scope.pickup.area.zipcode
        }
      }
      return JSON.stringify(Pickupdata); 
    } 

    // function to handle server side responses
    $scope.handleAddPickupAddressResponse = function(data){
      if (data.success) {
        $state.reload();
        $scope.cancelAddPickupAddress();
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
  
    $scope.addPickupAddress = function(){
      if ($scope.form.addPickupAddress.$valid) {
        $rootScope.showSpinner();
        ManageBranchService.addPickupLocation($scope.jsonAddPickupAddressData());
      } else {
        $log.debug('incorrect data');
        $scope.form.addPickupAddress.submitted = true;
      }
    }

    var cleanupEventAddPickupAddressDone = $scope.$on("addPickupAddressDone", function(event, message){
      $log.debug(message);
      $scope.handleAddPickupAddressResponse(message);      
    });

    var cleanupEventAddPickupAddressNotDone = $scope.$on("addPickupAddressNotDone", function(event, message){
      $rootScope.hideSpinner();
      $log.debug(message);
      $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    });


    $scope.enableEditAddress = function(index, address) {
      $rootScope.showSpinner();
      $scope.editpickup = angular.copy(address);
      ManageDeliveryChargesService.getLocation(address);
      $scope.editAddress = true;
      $scope.CurrentAddressIndex = index;
    }

    // function to handle server side responses
    $scope.handleGetLocationDataResponse = function(stateData, cityData, areaData){
      if (stateData.success) {
        if (stateData.success.states.length !== 0) {
          $scope.states = angular.copy(stateData.success.states);
          if (cityData.success && cityData.success.city.length !== 0) {
            $scope.cities = angular.copy(cityData.success.city);
            if (areaData.success && areaData.success.location.length !== 0) {
              $scope.Areas = angular.copy(areaData.success.location);
            } else {
              $scope.Areas = [];
            }
          } else {
            $scope.cities = [];
          }
        } else {
          $scope.states = [];
        }
      } else {
        if(stateData.error.code=='AL001'){
          $rootScope.showModal();
        } else {
          $log.debug(stateData.error.message);
          $rootScope.OZNotify(stateData.error.message,'error');
        }
      }
      $rootScope.hideSpinner();
    }; 

    var cleanupEventGetLocationDataDone = $scope.$on("getLocationDataDone", function(event, stateData, cityData, areaData){
      $log.debug(stateData);
      $log.debug(cityData);
      $log.debug(areaData);
      $scope.handleGetLocationDataResponse(stateData, cityData, areaData);      
    });

    var cleanupEventGetLocationDataNotDone = $scope.$on("getLocationDataNotDone", function(event, message){
      $rootScope.hideSpinner();
      $log.debug(message);
      $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    });


    $scope.cancelEnableEditAddress = function() {
      $scope.editAddress = false;
      $scope.CurrentAddressIndex = '';
      $scope.editpickup = {};
      $scope.form.editPickupAddress.$setPristine();
      $scope.form.editPickupAddress.submitted = false;
    }

    $scope.getStateForEditCountry = function(country) {
      if (country) {
        $rootScope.showSpinner();
        $scope.states = [];
        $scope.cities = [];
        $scope.Areas = [];
        $scope.editpickup.state = '';
        $scope.editpickup.city = '';
        $scope.editpickup.area = '';
        $scope.editpickup.zipcode = '';
        ManageDeliveryChargesService.GetStateList(country);
      }
    }

    $scope.getCityForEditState = function(state) {
      if (state) {
        $rootScope.showSpinner();
        $scope.cities = [];
        $scope.Areas = [];
        $scope.editpickup.city = '';
        $scope.editpickup.area = '';
        $scope.editpickup.zipcode = '';
        ManageDeliveryChargesService.GetCityList(state);
      }
    }

    $scope.getAreaForEditCity = function(city) {
      if (city) {
        $rootScope.showSpinner();
        $scope.Areas = [];
        $scope.editpickup.area = '';
        $scope.editpickup.zipcode = '';
        ManageDeliveryChargesService.GetAreaForCityList(city);
      }
    }

    $scope.getZipcodeForEditArea = function(area) {
      if (area) {
        $scope.editpickup.zipcode = '';
        $scope.editpickup.zipcode = area.zipcode;
      }
    }

    // function to send and stringify user registration data to Rest APIs
    $scope.jsonEditPickupAddressData = function(){
      var location = {};
      if ($scope.editpickup.area.area == undefined) {
        location.area = $scope.editpickup.area;
        location.zipcode = $scope.editpickup.zipcode;
      } else {
        location.area = $scope.editpickup.area.area;
        location.zipcode = $scope.editpickup.area.zipcode;
      }
      var Pickupdata = 
      {
        location: {
          'address1': $scope.editpickup.address1,
          'address2': $scope.editpickup.address2,
          'area': location.area,
          'city': $scope.editpickup.city,
          'country': $scope.editpickup.country,
          'state': $scope.editpickup.state,
          'zipcode': location.zipcode
        }
      }
      return JSON.stringify(Pickupdata); 
    } 

    // function to handle server side responses
    $scope.handleEditPickupAddressResponse = function(data){
      if (data.success) {
        $state.reload();
        $scope.cancelEnableEditAddress();
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
  
    $scope.editPickupAddress = function(addressid){
      $log.debug($scope.jsonEditPickupAddressData());
      if ($scope.form.editPickupAddress.$valid) {
        $rootScope.showSpinner();
        ManageBranchService.updatePickupLocation($scope.jsonEditPickupAddressData(), addressid);
      } else {
        $log.debug('incorrect data');
        $scope.form.editPickupAddress.submitted = true;
      }
    }

    var cleanupEventEditPickupAddressDone = $scope.$on("updatePickupAddressDone", function(event, message){
      $log.debug(message);
      $scope.handleEditPickupAddressResponse(message);      
    });

    var cleanupEventEditPickupAddressNotDone = $scope.$on("updatePickupAddressNotDone", function(event, message){
      $rootScope.hideSpinner();
      $log.debug(message);
      $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    });


    // function to handle server side responses
    $scope.handleDeletePickupAddressResponse = function(data){
      if (data.success) {
        $state.reload();
        // $scope.cancelAddPickupAddress();
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


    $scope.deletePickupAddress = function(addressid) {
      $rootScope.showSpinner();
      ManageBranchService.deletePickupLocation(addressid);
    }

    var cleanupEventDeletePickupAddressDone = $scope.$on("deletePickupAddressDone", function(event, message){
      $log.debug(message);
      $scope.handleDeletePickupAddressResponse(message);      
    });

    var cleanupEventDeletePickupAddressNotDone = $scope.$on("deletePickupAddressNotDone", function(event, message){
      $rootScope.hideSpinner();
      $log.debug(message);
      $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
    });


    $scope.$on('$destroy', function(event, message) {
      cleanupEventAddPickupAddressDone();
      cleanupEventAddPickupAddressNotDone();
      cleanupEventDeletePickupAddressDone();
      cleanupEventDeletePickupAddressNotDone();
      cleanupEventEditPickupAddressDone();
      cleanupEventEditPickupAddressNotDone();
      cleanupEventGetStateListDone();
      cleanupEventGetStateListNotDone();
      cleanupEventGetCityListDone();
      cleanupEventGetCityListNotDone();
      cleanupEventGetAreaForCityListDone();
      cleanupEventGetAreaForCityListNotDone();
      cleanupEventGetLocationDataDone();
      cleanupEventGetLocationDataNotDone();
    });

}]);

