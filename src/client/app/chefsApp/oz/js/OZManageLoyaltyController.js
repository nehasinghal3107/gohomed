angular.module('oz.AdminApp')
  .controller('OZManageLoyaltyController', ['$scope', '$state', '$http', '$timeout', '$sce', '$log', 'UserSessionService',  'OZWallService', 'GetProviderService', 'LoyaltyService', 'providerData', '$rootScope', '$upload', function($scope, $state, $http, $timeout, $sce, $log, UserSessionService, OZWallService, GetProviderService, LoyaltyService, providerData, $rootScope, $upload) {


  console.log("initialise Loyalty Controller....");

  $scope.providers_list = [];
  $scope.$state = $state;
  $scope.form = {};
  $scope.provider = {};
  $scope.payment_modes = ['cash','cheque','online'];
  $scope.loyaltypoints = {};
  $scope.loyalty_history = {};
  $scope.submitted = false;
  $scope.loyaltyNotAvailable = false;
  $scope.loyaltyAvailable = false;

  $scope.$watch('$state.$current.locals.globals.providerData', function (providerData) {
    $log.debug(providerData);
    if (providerData.success && providerData.success.productprovider.length !== 0) {
      $scope.providers_list = angular.copy(providerData.success.productprovider);
    } else if (providerData.error && providerData.error.message) {
      $scope.providers_list = [];
      $log.debug(providerData.error.message);
      $rootScope.OZNotify(providerData.error.message, 'error');
    } 
  });

  $scope.getLoyaltyHistoryForSeller = function(provider){
    if (provider) {
      console.log(provider);
      $rootScope.showSpinner();
      var providerid = provider.providerid;
      LoyaltyService.getLoyaltyHistory(providerid);
    }
  }

  // function to handle server side responses
  $scope.handleGetLoyaltyHistoryResponse = function(data){
    if (data.success) {
      console.log(data.success);
      if (data.success.doc.history.length !== 0) {
        $scope.loyaltyAvailable = true;
        $scope.loyaltyNotAvailable = false;
        $scope.loyalty_history = angular.copy(data.success.doc);
      } else {
        $scope.loyaltyAvailable = true;
        $scope.loyaltyNotAvailable = false;
        $scope.loyalty_history = angular.copy(data.success.doc);
      }
      $rootScope.OZNotify(data.success.message,'success'); 
    } else {
      if(data.error.code=='AL001'){
        $rootScope.showModal();
      } else if(data.error.code=='LP001') {
        $scope.loyalty_history = {};
        $scope.loyaltyAvailable = false;
        $scope.loyaltyNotAvailable = true;
        $log.debug(data.error.message);
        $rootScope.OZNotify(data.error.message,'error');
      } else {
        $log.debug(data.error.message);
        $rootScope.OZNotify(data.error.message,'error');
      }
    }
    $rootScope.hideSpinner();
  };

  var cleanupEventGetLoyaltyHistoryDone = $scope.$on("getLoyaltyHistoryDone", function(event, message){
    $log.debug(message);
    $scope.handleGetLoyaltyHistoryResponse(message);      
  });

  var cleanupEventGetLoyaltyHistoryNotDone = $scope.$on("getLoyaltyHistoryNotDone", function(event, message){
    $rootScope.hideSpinner();
    $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
  });


  // function to send and stringify user registration data to Rest APIs
  $scope.jsonManageLoyaltyPointsData = function(action){
    var loyaltypoints = 
    {
      "loyalty_points":$scope.loyaltypoints.value,
      "action":action,
      "payment_mode":$scope.loyaltypoints.payment,
      "remark": $scope.loyaltypoints.remark 
    };
    return JSON.stringify(loyaltypoints); 
  }

  $scope.manageLoyaltyPoints = function(providerdata, action){
    if (providerdata != undefined && providerdata.providerid != undefined) {
      if ($scope.form.addLoyalty.$valid) {
        $rootScope.showSpinner();
        var data = $scope.jsonManageLoyaltyPointsData(action);
        LoyaltyService.manageLoyaltyPointsForSeller(providerdata, data);
      } else {
        $log.debug('incorrect data');
        $scope.form.addLoyalty.submitted = true;
      }
    } else {
      $rootScope.OZNotify('Please select your provider to manage loyalty points.','error');
    }

  }

    // function to handle server side responses
  $scope.handleManageLoyaltyPointsResponse = function(data, provider){
    if (data.success) {
      console.log(data.success);
      $scope.loyaltypoints = {};
      $scope.form.addLoyalty.$setPristine();
      $scope.getLoyaltyHistoryForSeller(provider);
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

  var cleanupEventManageLoyaltyPointsDone = $scope.$on("manageLoyaltyPointsDone", function(event, message, provider){
    $log.debug(message);
    $scope.handleManageLoyaltyPointsResponse(message, provider);      
  });

  var cleanupEventManageLoyaltyPointsNotDone = $scope.$on("manageLoyaltyPointsNotDone", function(event, message){
    $rootScope.hideSpinner();
    $rootScope.OZNotify("It looks as though we have broken something on our server system. Our support team is notified and will take immediate action to fix it." + message, 'error');   
  });


  $scope.$on('$destroy', function(event, message) {
    cleanupEventGetLoyaltyHistoryDone();
    cleanupEventGetLoyaltyHistoryNotDone();
    cleanupEventManageLoyaltyPointsDone();
    cleanupEventManageLoyaltyPointsNotDone();
  });

}]);